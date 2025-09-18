"use client";
import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import { format, parseISO } from "date-fns";

function getLast6Months() {
    const now = new Date();
    return Array.from({ length: 6 }).map((_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        return format(d, "MMM yyyy");
    });
}

function getIncomeVsExpensesData(data) {
    const months = getLast6Months();

    // Initialize result
    const result = months.map(month => ({
        month,
        income: 0,
        expenses: 0,
    }));

    data.forEach(item => {
        const itemMonth = format(parseISO(item.date), "MMM yyyy");
        const idx = months.indexOf(itemMonth);
        if (idx !== -1) {
            if (item.type === "income") {
                result[idx].income += Number(item.amount);
            } else if (item.type === "expense") {
                result[idx].expenses += Number(item.amount);
            }
        }
    });

    return result;
}
const IncomeVsExpenses = ({ data }) => {

    const chartData = getIncomeVsExpensesData(data);

    return (
        <div className="bg-card rounded-2xl shadow-lg p-6 ">
            <h2 className="text-xl font-semibold mb-2 text-center">
                Income vs Expenses
            </h2>
            <ResponsiveContainer width="100%" height={212}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 13 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 13 }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            color: "#222",
                            borderRadius: "8px",
                            border: "none"
                        }}
                        labelStyle={{ color: "#2563eb" }}
                    />
                    <Legend
                        wrapperStyle={{ color: "#2563eb" }}
                        layout="horizontal"
                        verticalAlign="top"
                        align="center"
                    />
                    <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#22c55e" }}
                        activeDot={{ r: 7 }}
                        name="Income"
                    />
                    <Line
                        type="monotone"
                        dataKey="expenses"
                        stroke="#f43f5e"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#f43f5e" }}
                        activeDot={{ r: 7 }}
                        name="Expenses"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default IncomeVsExpenses;