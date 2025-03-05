from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BudgetViewSet, ExpenseViewSet, MonthlyViewSet, TaskViewSet

router = DefaultRouter()
router.register(r'budgets', BudgetViewSet)
router.register(r'expenses', ExpenseViewSet)
router.register(r'monthly', MonthlyViewSet)
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
]