from django.urls import path
from .views import MonthlyRecordViewSet, IncomeForecastView, ExpenseForecastView, MonthlyRecordDeleteView, MonthlyRecordUpdateView

urlpatterns = [
    path('monthly/', MonthlyRecordViewSet.as_view(), name='monthly_list_create'),
    path('monthly/<int:pk>/delete/', MonthlyRecordDeleteView.as_view(), name='monthly-record-delete'),
    path('monthly/<int:pk>/update/', MonthlyRecordUpdateView.as_view(), name='monthly-record-update'),
    path('forecast-expenses/', ExpenseForecastView.as_view(), name='forecast_expenses'),
    path('forecast-income/', IncomeForecastView.as_view(), name='forecast_income'),
   
]
