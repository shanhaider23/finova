# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import BudgetViewSet, ExpenseViewSet, MonthlyViewSet, TaskViewSet

# router = DefaultRouter()
# router.register(r'budgets', BudgetViewSet)
# router.register(r'expenses', ExpenseViewSet)
# router.register(r'monthly', MonthlyViewSet)
# router.register(r'tasks', TaskViewSet)

# urlpatterns = [
#     path('', include(router.urls)),
# ]

from django.urls import path
from .views import MonthlyIncomeListCreateView, IncomeForecastView, ExpenseForecastView, ExpenseListCreateView

urlpatterns = [
    path('monthly-income/', MonthlyIncomeListCreateView.as_view(), name='monthly_income_list_create'),
    path('forecast-expenses/', ExpenseForecastView.as_view(), name='forecast_expenses'),
    path('forecast-income/', IncomeForecastView.as_view(), name='forecast_income'),
    path('monthly-expense/', ExpenseListCreateView.as_view(), name='monthly_expense_list_create'),
]
