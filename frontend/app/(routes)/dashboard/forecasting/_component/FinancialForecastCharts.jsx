'use client';
import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

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

                    cashFlow: item.predicted_income,
                    isForecast: true,
                }));

                const expenseData = expenseResponse.data.next_six_months_expense_forecast.map(item => ({
                    month: item.month,
                    expense: item.predicted_expense,

                    cashFlow: -item.predicted_expense,
                    isForecast: true,
                }));




                const monthlyData = monthlyResponse.data
                    .map(item => ({
                        month: item.date,
                        income: item.type === 'income' ? item.amount : 0,
                        expense: item.type === 'expense' ? item.amount : 0,
                        isForecast: false,
                    }))
                    .filter(item => item.income !== 0 || item.expense !== 0);
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

                    // Ensure actual data replaces forecasted data when available
                    if (!item.isForecast) {
                        existingEntry.income = item.income || existingEntry.income;
                        existingEntry.expense = item.expense || existingEntry.expense;
                    } else if (!existingEntry.income && !existingEntry.expense) {
                        existingEntry.income += item.income || 0;
                        existingEntry.expense += Math.abs(item.expense || 0);
                    }

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

            {/* Line Chart */}
            <div className="h-[400px]">
                <h2 className="text-xl font-semibold mb-3">
                    📈 Income vs Expense (Including Forecast)
                </h2>
                <ResponsiveContainer>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />

                        {/* Actual Data */}
                        <Line
                            type="monotone"
                            dataKey="income"
                            data={data}
                            stroke="#52c41a"
                            strokeWidth={2}
                            name="Forecast Income"
                        />
                        <Line
                            type="monotone"
                            dataKey="expense"
                            data={data}
                            stroke="#ff4d4f"
                            strokeWidth={2}
                            name="Forecast Expense"
                        />


                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="h-[400px]">
                <h2 className="text-xl font-semibold mb-3">
                    📊 Income vs Expense (Including Forecast)
                </h2>
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="income" fill="#52c41a" name="Income" />
                        <Bar dataKey="expense" fill="#ff4d4f" name="Expense" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Area Chart */}
            <div className="h-[400px]">
                <h2 className="text-xl font-semibold mb-3">
                    🌊 Cash Flow (Actual vs Forecast)
                </h2>
                <ResponsiveContainer>
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="cashFlow"
                            stroke="#1890ff"
                            fill="#1890ff"
                            name="Cash Flow"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}