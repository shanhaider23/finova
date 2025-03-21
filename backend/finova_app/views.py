from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import MonthlyRecord, Budget, Expense, Task
from .serializers import MonthlyRecordSerializer, BudgetSerializer, ExpenseSerializer, TaskSerializer
from .ml import forecast_next_six_months_income, forecast_next_six_months_expenses
from django.db.models import Sum, Count


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
            return MonthlyRecord.objects.filter(created_by=user_email)
        return MonthlyRecord.objects.none()

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
        prediction = forecast_next_six_months_income()
        if prediction == "Not enough data":
            return Response({"error": "Not enough data to make a forecast."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"next_six_month_income_prediction": prediction}, status=status.HTTP_200_OK)

class ExpenseForecastView(APIView):
    def get(self, request):
        forecast = forecast_next_six_months_expenses()
        if forecast == "Not enough data":
            return Response({"error": "Not enough data to make a forecast."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"next_six_months_expense_forecast": forecast}, status=status.HTTP_200_OK)