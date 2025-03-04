from rest_framework import serializers
from .models import Budget, Expense, Monthly, Task

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'

class MonthlySerializer(serializers.ModelSerializer):
    class Meta:
        model = Monthly
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
