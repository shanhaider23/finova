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
import LoadingSkeleton from '@/app/_component/LoadingSkeleton';


function getLast6Months() {
    const now = new Date();
    return Array.from({ length: 6 }).map((_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        return format(d, "MMM yyyy");
    });
}

export function getNetWorthChartData(data) {
    const months = getLast6Months();

    // Initialize result
    const result = months.map(month => ({
        month,
        assets: 0,
        liabilities: 0,
        netWorth: 0,
    }));

    data.forEach(item => {
        const itemMonth = format(parseISO(item.date), "MMM yyyy");
        const idx = months.indexOf(itemMonth);
        if (idx !== -1) {
            if (item.type === "income") {
                result[idx].assets += Number(item.amount);
            } else if (item.type === "expense") {
                result[idx].liabilities += Number(item.amount);
            }
        }
    });

    // Calculate net worth for each month
    result.forEach(row => {
        row.netWorth = row.assets - row.liabilities;
    });

    return result;
}


const NetWorthChart = ({ data, loading }) => {
    const chartData = getNetWorthChartData(data);

    if (loading) {
        return (
            <div className="bg-card h-full flex justify-center items-center p-5 rounded-lg shadow-md">
                <LoadingSkeleton height={200} />
            </div>
        );
    }

    return (
        <div className="bg-card rounded-2xl shadow-lg p-6 ">
            <h2 className="text-xl font-semibold mb-2 text-center">
                Net Worth Over Time
            </h2>
            <ResponsiveContainer width="100%" height={225}>
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
                        dataKey="netWorth"
                        stroke="#4CAF50"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#4CAF50" }}
                        activeDot={{ r: 7 }}
                        name="Net Worth"
                    />
                    <Line
                        type="monotone"
                        dataKey="assets"
                        stroke="#2196F3"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#2196F3" }}
                        activeDot={{ r: 7 }}
                        name="Assets"
                    />
                    <Line
                        type="monotone"
                        dataKey="liabilities"
                        stroke="#F44336"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#F44336" }}
                        activeDot={{ r: 7 }}
                        name="Liabilities"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default NetWorthChart;