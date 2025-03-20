from django.urls import path
from .views import MonthlyRecordViewSet, IncomeForecastView, ExpenseForecastView, MonthlyRecordDeleteView, MonthlyRecordUpdateView, BudgetListCreateView, BudgetDetailView, ExpenseListCreateView, ExpenseDetailView, TaskListCreateView, TaskDetailView

urlpatterns = [
     # Budget endpoints
    path('budgets/', BudgetListCreateView.as_view(), name='budget-list-create'),
    path('budgets/<int:pk>/', BudgetDetailView.as_view(), name='budget-detail'),

    # Expense endpoints
    path('expenses/', ExpenseListCreateView.as_view(), name='expense-list-create'),
    path('expenses/<int:pk>/', ExpenseDetailView.as_view(), name='expense-detail'),

    # Task endpoints
    path('tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
    
    path('monthly/', MonthlyRecordViewSet.as_view(), name='monthly_list_create'),
    path('monthly/<int:pk>/delete/', MonthlyRecordDeleteView.as_view(), name='monthly-record-delete'),
    path('monthly/<int:pk>/update/', MonthlyRecordUpdateView.as_view(), name='monthly-record-update'),
    path('forecast-expenses/', ExpenseForecastView.as_view(), name='forecast_expenses'),
    path('forecast-income/', IncomeForecastView.as_view(), name='forecast_income'),
   
]
