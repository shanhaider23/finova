'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Charts from './Charts';

export default function FinancialForecastCharts() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

                const [incomeResponse, expenseResponse, monthlyResponse] = await Promise.all([
                    axios.get(`${apiBaseUrl}/api/forecast-income/`),
                    axios.get(`${apiBaseUrl}/api/forecast-expenses/`),
                    axios.get(`${apiBaseUrl}/api/monthly/`),
                ]);

                if (!incomeResponse.data.next_six_month_income_prediction ||
                    !Array.isArray(incomeResponse.data.next_six_month_income_prediction)) {
                    console.error("Error: incomeResponse.data.next_six_month_income_prediction is not an array", incomeResponse.data);
                    return;
                }

                if (!expenseResponse.data.next_six_months_expense_forecast ||
                    !Array.isArray(expenseResponse.data.next_six_months_expense_forecast)) {
                    console.error("Error: expenseResponse.data.next_six_months_expense_forecast is not an array", expenseResponse.data);
                    return;
                }

                const incomeData = incomeResponse.data.next_six_month_income_prediction.map(item => ({
                    month: item.month,
                    income: item.predicted_income,
                    expense: 0,
                    cashFlow: item.predicted_income,
                    isForecast: true,
                }));

                const expenseData = expenseResponse.data.next_six_months_expense_forecast.map(item => ({
                    month: item.month,
                    income: 0,
                    expense: item.predicted_expense,
                    cashFlow: -item.predicted_expense,
                    isForecast: true,
                }));

                const monthlyData = monthlyResponse.data.map(item => ({
                    month: item.date,
                    income: item.type === 'income' ? item.amount : 0,
                    expense: item.type === 'expense' ? item.amount : 0,
                    cashFlow: item.type === 'income' ? item.amount : -item.amount,
                    isForecast: false,
                }));

                const combinedData = [...monthlyData, ...incomeData, ...expenseData];

                const getMonthName = (dateStr) => {
                    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const monthIndex = new Date(dateStr).getMonth();
                    return months[monthIndex];
                };

                const aggregatedData = combinedData.reduce((acc, item) => {
                    const monthName = getMonthName(item.month);
                    let existingEntry = acc.find(entry => entry.month === monthName);

                    if (!existingEntry) {
                        existingEntry = { month: monthName, income: 0, expense: 0, cashFlow: 0, isForecast: item.isForecast };
                        acc.push(existingEntry);
                    }

                    if (item.income) existingEntry.income += item.income;
                    if (item.expense) existingEntry.expense += Math.abs(item.expense);

                    existingEntry.cashFlow = existingEntry.income - existingEntry.expense;

                    return acc;
                }, []);

                const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const sortedData = aggregatedData.sort((a, b) => {
                    return monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month);
                });
                setData(sortedData);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-5 space-y-12">
            <h1 className="text-3xl font-bold text-center">
                🔮 Financial Forecasting Dashboard
            </h1>

            <Charts
                headline="📈 Income & Expense (Including Forecast)"
                data={data}
                chartType="line"
            />

            <Charts
                headline="📊 Income vs Expense (Including Forecast)"
                data={data}
                chartType="bar"
            />

            <Charts
                headline="🌊 Cash Flow (Including Forecast)"
                data={data}
                chartType="area"
            />
        </div>
    );
}