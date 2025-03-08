import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import timedelta
from .models import MonthlyIncome, MonthlyExpense

def forecast_next_three_months_income():
    # Load data from the database
    incomes = MonthlyIncome.objects.all().order_by('month')
    if incomes.count() < 2:
        return "Not enough data"

    # Prepare data
    data = pd.DataFrame(list(incomes.values('month', 'amount')))
    data['month_number'] = range(1, len(data) + 1)

    X = data[['month_number']]
    y = data['amount']

    # Train the model
    model = LinearRegression()
    model.fit(X, y)

    # Predict the next 3 months
    future_month_numbers = np.array([
        [len(data) + 1],
        [len(data) + 2],
        [len(data) + 3],
        [len(data) + 4],
        [len(data) + 5],
        [len(data) + 6]
    ])
    predictions = model.predict(future_month_numbers)

    # Optional: Get last month and generate next 3 dates
    last_month = data['month'].max()
    future_months = [
        (last_month + pd.DateOffset(months=i)).strftime('%Y-%m-%d')
        for i in range(1, 7)
    ]

    # Prepare result
    forecast = []
    for month, amount in zip(future_months, predictions):
        forecast.append({
            'month': month,
            'predicted_income': round(amount, 2)
        })

    return forecast
def forecast_next_three_months_expenses():
    # Load data from the database
    expenses = MonthlyExpense.objects.all().order_by('date')
    if expenses.count() < 2:
        return "Not enough data"

    # Prepare data
    data = pd.DataFrame(list(expenses.values('date', 'amount')))
    data['month_number'] = range(1, len(data) + 1)

    X = data[['month_number']]
    y = data['amount']

    # Train the model
    model = LinearRegression()
    model.fit(X, y)

    # Predict the next 3 months
    future_month_numbers = np.array([
        [len(data) + 1],
        [len(data) + 2],
        [len(data) + 3],
        [len(data) + 4],
        [len(data) + 5],
        [len(data) + 6]
    ])
    predictions = model.predict(future_month_numbers)

    # Optional: Get last date and create next 3 month dates
    last_date = data['date'].max()
    future_months = [
        (last_date + pd.DateOffset(months=i)).strftime('%Y-%m-%d')
        for i in range(1, 7)
    ]

    # Prepare result
    forecast = []
    for month, amount in zip(future_months, predictions):
        forecast.append({
            'month': month,
            'predicted_expense': round(amount, 2)
        })

    return forecast