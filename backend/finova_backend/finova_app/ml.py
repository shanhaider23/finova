import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import timedelta
from .models import MonthlyRecord

def forecast_next_six_months_income():
    # Load data from the database
    incomes = MonthlyRecord.objects.filter(type='income').order_by('date')
    if incomes.count() < 2:
        return "Not enough data"

    # Prepare data
    data = pd.DataFrame(list(incomes.values('date', 'amount')))
    data['month_number'] = range(1, len(data) + 1)

    X = data[['month_number']]
    y = data['amount']

    # Train the model
    model = LinearRegression()
    model.fit(X, y)

    # Predict the next 6 months
    future_month_numbers = np.array([
        [len(data) + 1],
        [len(data) + 2],
        [len(data) + 3],
        [len(data) + 4],
        [len(data) + 5],
        [len(data) + 6]
    ])
    predictions = model.predict(future_month_numbers)

    # Optional: Get last date and generate next 6 dates
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
            'predicted_income': round(amount, 2)
        })

    return forecast

def forecast_next_six_months_expenses():
    # Load data from the database
    expenses = MonthlyRecord.objects.filter(type='expense').order_by('date')
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

    # Predict the next 6 months
    future_month_numbers = np.array([
        [len(data) + 1],
        [len(data) + 2],
        [len(data) + 3],
        [len(data) + 4],
        [len(data) + 5],
        [len(data) + 6]
    ])
    predictions = model.predict(future_month_numbers)

    # Optional: Get last date and create next 6 month dates
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