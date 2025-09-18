"use client";
import React from "react";

const SpendingLeaderboard = ({ expenses = [] }) => {
    if (!expenses || expenses.length === 0) {
        return <p className="text-gray-500">No expenses to show.</p>;
    }

    // 1. Group by category
    const categoryTotals = expenses.reduce((acc, expense) => {
        const cat = expense.category || "Other";
        acc[cat] = (acc[cat] || 0) + expense.amount;
        return acc;
    }, {});

    // 2. Convert to array and sort
    const sorted = Object.entries(categoryTotals)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount);

    const total = sorted.reduce((sum, c) => sum + c.amount, 0);

    return (
        <div className="bg-card rounded-xl shadow-lg p-5 w-full max-w-full mx-auto overflow-hidden">
            <h2 className="text-lg font-semibold mb-2">
                Top Spending Categories
            </h2>
            <ul className="space-y-3">
                {sorted.slice(0, 5).map((item, index) => {
                    const percentage = ((item.amount / total) * 100).toFixed(1);
                    return (
                        <li
                            key={item.category}
                            className="flex items-center justify-between border-b pb-2 last:border-b-0"
                        >
                            <span className="flex items-center gap-2 min-w-0">
                                <span className="text-xl">
                                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🔹"}
                                </span>
                                <span className="truncate max-w-[120px] font-medium text-gray-800 dark:text-gray-200" title={item.category}>
                                    {item.category}
                                </span>
                            </span>
                            <span className="font-semibold text-gray-700 dark:text-gray-100 text-right min-w-0 truncate max-w-[100px]">
                                {item.amount} <span className="text-xs text-gray-500">({percentage}%)</span>
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default SpendingLeaderboard;