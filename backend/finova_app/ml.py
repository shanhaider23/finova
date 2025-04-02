import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime
from .models import MonthlyRecord

def forecast_next_six_months_income():
    # Load data from the database
    incomes = MonthlyRecord.objects.filter(type='income').order_by('date')
    print(f"Incomes data from database: {list(incomes.values('date', 'amount'))}")  # Debugging line
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
    data['date'] = pd.to_datetime(data['date'])  # Ensure it's a datetime object
    data['year_month'] = data['date'].dt.to_period('M')  # Extract Year-Month

    # Group by year-month and sum expenses
    monthly_data = data.groupby('year_month')['amount'].sum().reset_index()
    monthly_data['month_number'] = range(1, len(monthly_data) + 1)

    X = monthly_data[['month_number']]
    y = monthly_data['amount']

    # Train the model
    model = LinearRegression()
    model.fit(X, y)

    # Predict the next 6 months
    future_month_numbers = np.array([[len(monthly_data) + i] for i in range(1, 7)])
    predictions = model.predict(future_month_numbers)

    # Get the last recorded month and generate future months
    last_month = monthly_data['year_month'].max()
    future_months = [
        (last_month + i).strftime('%Y-%m') for i in range(1, 7)
    ]

    # Prepare result
    forecast = [{'month': month, 'predicted_expense': round(amount, 2)} 
                for month, amount in zip(future_months, predictions)]

    return forecast