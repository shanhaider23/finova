from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import MonthlyRecord, Budget, Expense, Task
from .serializers import MonthlyRecordSerializer, BudgetSerializer, ExpenseSerializer, TaskSerializer
from .ml import forecast_next_six_months_income, forecast_next_six_months_expenses
from django.db.models import Sum, Count
import json
from datetime import datetime
from django.http import JsonResponse

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



from .services import generate_financial_advice

class FinancialAdviceView(APIView):
    def get(self, request, *args, **kwargs):
        # Get income & expense predictions
        income_predictions = forecast_next_six_months_income()
        expense_predictions = forecast_next_six_months_expenses()

        # # Get the number of months to forecast from query params (default is 1 month for debugging)
        # months_to_forecast = int(request.query_params.get('months', 1))

        # # Limit to the specified number of months (1 or more months)
        # income_predictions = income_predictions[:months_to_forecast]
        # expense_predictions = expense_predictions[:months_to_forecast]

        advice = []

        # Generate advice for the specified number of months
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

        return Response({"financial_advice": advice}, status=status.HTTP_200_OK)

# class FinancialAdviceView(APIView):
#     def get(self, request, *args, **kwargs):
#         income_predictions = forecast_next_six_months_income()
#         expense_predictions = forecast_next_six_months_expenses()

#         advice = []

#         for i in range(len(income_predictions)):
#             income = income_predictions[i]["predicted_income"]
#             expense = expense_predictions[i]["predicted_expense"]
#             month = income_predictions[i]["month"]

#             prompt = (
#                 f"For the month of {month}, the user has an expected income of ${income:.2f} "
#                 f"and expenses of ${expense:.2f}. Provide a detailed financial recommendation."
#             )

#             try:
#                 ai_advice = generate_financial_advice(prompt)
#             except Exception as e:
#                 ai_advice = f"⚠️ Unable to generate AI advice at the moment. Error: {str(e)}"

#             advice.append({
#                 "month": month,
#                 "suggestion": ai_advice
#             })

#         return Response({"financial_advice": advice}, status=status.HTTP_200_OK)
# Set your OpenAI API Key
# client.api_key = os.getenv("OPENAI_API_KEY")  # Store it securely in .env

# class FinancialAdviceView(APIView):
#     def get(self, request, *args, **kwargs):
#         # Get income & expense predictions
#         income_predictions = forecast_next_six_months_income()
#         expense_predictions = forecast_next_six_months_expenses()

#         advice = []

#         for i in range(len(income_predictions)):
#             income = income_predictions[i]["predicted_income"]
#             expense = expense_predictions[i]["predicted_expense"]
#             month = income_predictions[i]["month"]

#             # Structured AI prompt
#             prompt = (
#                 f"For {month}, your predicted income is ${income:.2f} and expenses are ${expense:.2f}. "
#                 f"Provide a detailed financial recommendation covering: \n"
#                 f"1️⃣ Budgeting strategies 💰\n"
#                 f"2️⃣ How to reduce unnecessary spending 📉\n"
#                 f"3️⃣ Investment options if there are savings 📈\n"
#                 f"4️⃣ Smart money-saving tips 🏦\n"
#                 f"Format the response in clear bullet points."
#             )

#             # Call OpenAI API
#             try:
#                 response = client.chat.completions.create(
#                     model="gpt-4o",  # Use GPT-4o for better financial insights
#                     messages=[
#                         {"role": "system", "content": "You are a highly knowledgeable financial advisor."},
#                         {"role": "user", "content": prompt}
#                     ],
#                     temperature=0.7  # Controls creativity of response
#                 )

#                 # Extract AI-generated advice
#                 ai_advice = response.choices[0].message.content.strip()

#             except Exception as e:
#                 ai_advice = f"⚠️ Unable to generate AI advice due to an error: {str(e)}"

#             # Append AI-generated financial advice
#             advice.append({
#                 "month": month,
#                 "suggestion": ai_advice
#             })

#         return JsonResponse({"financial_advice": advice}, status=200)


# class FinancialAdviceView(APIView):
#     def get(self, request, *args, **kwargs):
#         # Get income & expense predictions
#         income_predictions = forecast_next_six_months_income()
#         expense_predictions = forecast_next_six_months_expenses()

#         advice = []
        
#         # Compare income vs. expense and generate advice
#         for i in range(6):  # Next six months
#             income = income_predictions[i]["predicted_income"]
#             expense = expense_predictions[i]["predicted_expense"]
#             month = income_predictions[i]["month"]

#             # Advice logic
#             if expense > income:
#                 advice.append({
#                     "month": month,
#                     "suggestion": f"Warning! Your predicted expenses ({expense:.2f}) exceed your income ({income:.2f}). Consider reducing discretionary spending."
#                 })
#             elif (income - expense) > (income * 0.3):  # 30% savings rule
#                 advice.append({
#                     "month": month,
#                     "suggestion": f"Good job! You are projected to save {income - expense:.2f}. Consider investing this amount wisely."
#                 })
#             else:
#                 advice.append({
#                     "month": month,
#                     "suggestion": f"Your projected savings this month are {income - expense:.2f}. Try cutting down expenses on entertainment or dining out."
#                 })

#         return JsonResponse({"financial_advice": advice}, status=200)