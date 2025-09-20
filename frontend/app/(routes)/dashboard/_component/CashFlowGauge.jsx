"use client";
import React from "react";
import {
    RadialBarChart,
    RadialBar,
    Tooltip,
    PolarAngleAxis
} from "recharts";
import LoadingSkeleton from '@/app/_component/LoadingSkeleton';

const CashFlowGauge = ({ monthlyList = [], loading }) => {
    // Calculate total income and expenses from monthlyList
    const totalIncome = monthlyList
        .filter(item => item.type === "income")
        .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const totalExpenses = monthlyList
        .filter(item => item.type === "expense")
        .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const cashFlow = totalIncome - totalExpenses;
    const percentage = totalIncome > 0 ? (cashFlow / totalIncome) * 100 : 0;

    const data = [
        {
            name: "Cash Flow",
            value: Math.max(Math.min(percentage, 100), 0), // Clamp between 0 and 100
            fill: cashFlow >= 0 ? "#4CAF50" : "#F63642", // green or red
        },
    ];

    if (loading) {
        return (
            <div className="bg-card h-full flex justify-center items-center p-5 rounded-lg shadow-md">
                <LoadingSkeleton height={200} />
            </div>
        );
    }

    return (
        <div className="bg-card h-full flex justify-around items-center flex-col p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Cash Flow</h2>
            <RadialBarChart
                width={150}
                height={150}
                cx="50%"
                cy="50%"
                innerRadius="80%"
                outerRadius="100%"
                barSize={15}
                data={data}
                startAngle={180}
                endAngle={0}
            >
                <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    tick={false}
                />
                <RadialBar
                    minAngle={15}
                    clockWise
                    dataKey="value"
                    cornerRadius={10}
                />
                <Tooltip />
            </RadialBarChart>

            <p className={`text-xl font-bold mt-2 ${cashFlow >= 0 ? "text-green-600" : "text-red-500"}`}>
                {cashFlow >= 0 ? `+${cashFlow}` : `${cashFlow}`}
            </p>
            <p className="text-sm text-gray-500">
                from {totalIncome} income
            </p>
            <p className="text-sm text-gray-500">
                expenses: {totalExpenses}
            </p>
        </div>
    );
};

export default CashFlowGauge;