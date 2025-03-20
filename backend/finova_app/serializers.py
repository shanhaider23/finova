from rest_framework import serializers
from .models import MonthlyRecord, Budget, Expense, Task

class MonthlyRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyRecord
        fields = '__all__'

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = '__all__'


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'