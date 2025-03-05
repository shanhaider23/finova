from rest_framework import viewsets
from .models import Budget, Expense, Monthly, Task
from .serializers import BudgetSerializer, ExpenseSerializer, MonthlySerializer, TaskSerializer

class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

class MonthlyViewSet(viewsets.ModelViewSet):
    queryset = Monthly.objects.all()
    serializer_class = MonthlySerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer