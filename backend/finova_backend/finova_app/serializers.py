from rest_framework import serializers
from .models import MonthlyIncome, MonthlyExpense

class MonthlyIncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyIncome
        fields = ['id', 'month', 'amount']

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyExpense
        fields = ['id', 'date', 'amount', 'category', 'description']