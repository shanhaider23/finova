from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import MonthlyIncome, MonthlyExpense
from .serializers import MonthlyIncomeSerializer, ExpenseSerializer
from .ml import forecast_next_three_months_income, forecast_next_three_months_expenses

# List all income entries or add new income data
class MonthlyIncomeListCreateView(generics.ListCreateAPIView):
    queryset = MonthlyIncome.objects.all().order_by('-month')
    serializer_class = MonthlyIncomeSerializer
class ExpenseListCreateView(generics.ListCreateAPIView):
    queryset = MonthlyExpense.objects.all()
    serializer_class = ExpenseSerializer

# Forecast API
class IncomeForecastView(APIView):
    def get(self, request):
        prediction = forecast_next_three_months_income()
        if prediction == "Not enough data":
            return Response({"error": "Not enough data to make a forecast."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"next_month_income_prediction": prediction}, status=status.HTTP_200_OK)

class ExpenseForecastView(APIView):
    def get(self, request):
        forecast = forecast_next_three_months_expenses()
        if forecast == "Not enough data":
            return Response({"error": "Not enough data to make a forecast."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"next_three_months_expense_forecast": forecast}, status=status.HTTP_200_OK)
 
