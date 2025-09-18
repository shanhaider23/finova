from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import MonthlyRecord, Budget, Expense, Task, ParentBudget
from .serializers import MonthlyRecordSerializer, BudgetSerializer, ExpenseSerializer, TaskSerializer, ParentBudgetSerializer
from .ml import forecast_next_six_months_income, forecast_next_six_months_expenses
from django.db.models import Sum, Count
import json
from datetime import datetime
from django.http import JsonResponse
from .services import generate_financial_advice
import hashlib
from django.core.cache import cache


class ParentBudgetListCreateView(generics.ListCreateAPIView):
    queryset = ParentBudget.objects.all()
    serializer_class = ParentBudgetSerializer

    def get_queryset(self):
        user_email = self.request.query_params.get('email')
        if user_email:
            return ParentBudget.objects.filter(created_by=user_email)
        return ParentBudget.objects.none()

class ParentBudgetDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ParentBudget.objects.all()
    serializer_class = ParentBudgetSerializer 

# Budget Views
class BudgetListCreateView(generics.ListCreateAPIView):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer

    def get_queryset(self):
        user_email = self.request.query_params.get('email')
        if user_email:
           return Budget.objects.filter(created_by=user_email).annotate(
                totalSpend=Sum('expenses__amount'),  # Sum of all related expenses' amounts
                totalItem=Count('expenses')         # Count of all related expenses
            )
        return Budget.objects.none()


class BudgetDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer


# Expense Views
class ExpenseListCreateView(generics.ListCreateAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        user_email = self.request.query_params.get('email')
        if user_email:
            return Expense.objects.filter(created_by=user_email)
        return Expense.objects.none()


class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer


# Task Views
class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_queryset(self):
        user_email = self.request.query_params.get('email')
        if user_email:
            return Task.objects.filter(created_by=user_email)
        return Task.objects.none()


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

# List all income entries or add new income data

class MonthlyRecordViewSet(generics.ListCreateAPIView):
    serializer_class = MonthlyRecordSerializer

    def get_queryset(self):
        user_email = self.request.query_params.get('email')
        
        if user_email:
           records = MonthlyRecord.objects.filter(created_by=user_email)
          
           return records
        return MonthlyRecord.objects.none()
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        return Response(serializer.data)
    
class MonthlyRecordDeleteView(generics.DestroyAPIView):
    queryset = MonthlyRecord.objects.all()
    serializer_class = MonthlyRecordSerializer

    def delete(self, request, *args, **kwargs):
        try:
            record = self.get_object()
            record.delete()
            return Response({"message": "Record deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except MonthlyRecord.DoesNotExist:
            return Response({"error": "Record not found"}, status=status.HTTP_404_NOT_FOUND)

class MonthlyRecordUpdateView(generics.UpdateAPIView):
    queryset = MonthlyRecord.objects.all()
    serializer_class = MonthlyRecordSerializer

    def put(self, request, *args, **kwargs):
        try:
            record = self.get_object()
            serializer = self.get_serializer(record, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Record updated successfully", "data": serializer.data}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except MonthlyRecord.DoesNotExist:
            return Response({"error": "Record not found"}, status=status.HTTP_404_NOT_FOUND)

# Forecast API
class IncomeForecastView(APIView):
    def get(self, request):
        # Get the user email from query parameters
        user_email = request.query_params.get('email')
        
        if not user_email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Pass the user email to the forecast function
        prediction = forecast_next_six_months_income(user_email)
        
        if prediction == "Not enough data":
            return Response({"error": "Not enough data to make a forecast."}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"next_six_month_income_prediction": prediction}, status=status.HTTP_200_OK)


class ExpenseForecastView(APIView):
    def get(self, request):
        # Get the user email from query parameters
        user_email = request.query_params.get('email')

        if not user_email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Pass the user email to the forecast function
        forecast = forecast_next_six_months_expenses(user_email)
        
        if forecast == "Not enough data":
            return Response({"error": "Not enough data to make a forecast."}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"next_six_months_expense_forecast": forecast}, status=status.HTTP_200_OK)






class FinancialAdviceView(APIView):
    def get(self, request, *args, **kwargs):
        user_email = request.query_params.get('email')
        print(f"User email: {user_email}")
        # Get income & expense predictions
        income_predictions = forecast_next_six_months_income(user_email)
        expense_predictions = forecast_next_six_months_expenses(user_email)
        print(f"Income predictions: {income_predictions}")
        print(f"Expense predictions: {expense_predictions}")
        # Generate a unique cache key based on the income and expense predictions
        # Convert predictions to a string to ensure consistency when checking equality
        predictions_str = json.dumps({
            "income_predictions": income_predictions,
            "expense_predictions": expense_predictions
        })

        # Create a hash of the predictions string to use as the cache key
        cache_key = f"financial_advice_{hashlib.md5(predictions_str.encode()).hexdigest()}"

        # Check if the data is already cached
        cached_advice = cache.get(cache_key)
        if cached_advice:
            # If cached advice exists, return it
            return Response({"financial_advice": cached_advice}, status=status.HTTP_200_OK)

        advice = []

        # Generate financial advice for each month
        for i in range(len(income_predictions)):
            income = income_predictions[i]["predicted_income"]
            expense = expense_predictions[i]["predicted_expense"]
            month = income_predictions[i]["month"]

            prompt = (
                f"For the month of {month}, the user has an expected income of ${income:.2f} "
                f"and expenses of ${expense:.2f}. Provide a detailed financial recommendation."
            )

            try:
                ai_advice = generate_financial_advice(prompt)
            except Exception as e:
                ai_advice = f"⚠️ Unable to generate AI advice at the moment. Error: {str(e)}"

            advice.append({
                "month": month,
                "suggestion": ai_advice
            })

        # Cache the generated financial advice for 1 hour
        cache.set(cache_key, advice, timeout=60*60)  # Cache for 1 hour

        return Response({"financial_advice": advice}, status=status.HTTP_200_OK)
