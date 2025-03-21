from rest_framework import serializers
from .models import MonthlyRecord, Budget, Expense, Task

class MonthlyRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyRecord
        fields = '__all__'

class BudgetSerializer(serializers.ModelSerializer):
    totalSpend = serializers.FloatField(read_only=True)  # Read-only field for totalSpend
    totalItem = serializers.IntegerField(read_only=True)  # Read-only field for totalItem

    class Meta:
        model = Budget
        fields = ['id', 'name', 'amount', 'currency', 'icon', 'created_by', 'totalSpend', 'totalItem']


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'