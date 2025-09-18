import React from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

// Dummy calculation (replace with your real logic)
function calculateScore({ spending, savingsRate, debtRatio, netWorthGrowth }) {
    // Example: weighted average (customize as needed)
    let score =
        0.4 * (100 - spending) + // less spending is better
        0.3 * savingsRate +
        0.2 * (100 - debtRatio) + // less debt is better
        0.1 * netWorthGrowth;
    return Math.max(0, Math.min(100, Math.round(score)));
}

// Dummy tip generator (replace with your real logic)
function getTip(score) {
    if (score < 60) return "Try to reduce unnecessary expenses this month.";
    if (score < 80) return "Reduce dining out by 10% to boost your score.";
    return "Great job! Keep building your savings.";
}

export default function FinancialHealthScore({
    spending = 40,        // percent of income spent
    savingsRate = 30,     // percent of income saved
    debtRatio = 20,       // percent of income to debt payments
    netWorthGrowth = 10,  // percent growth this year
}) {
    const score = calculateScore({ spending, savingsRate, debtRatio, netWorthGrowth });
    const gaugeData = [
        {
            name: "Score",
            value: score,
            fill: score < 60 ? "#ef4444" : score < 80 ? "#facc15" : "#22c55e",
        },
    ];

    return (
        <div className="bg-card rounded-xl shadow-lg p-5 flex flex-col items-center w-full h-[100%]">
            <h2 className="text-xl font-semibold text-center">Financial Health Score</h2>
            <div className="w-full flex justify-center -mt-16">
                <ResponsiveContainer width={180} height={180}>
                    <RadialBarChart
                        cx="50%"
                        cy="100%"
                        innerRadius="80%"
                        outerRadius="100%"
                        barSize={18}
                        data={gaugeData}
                        startAngle={180}
                        endAngle={0}
                    >
                        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                        <RadialBar
                            minAngle={15}
                            clockWise
                            dataKey="value"
                            cornerRadius={10}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
            <div className="text-center mt-2">
                <div className="text-3xl font-bold">{score}/100</div>
                <div className="text-sm text-gray-500 mt-1 italic">{getTip(score)}</div>
            </div>
            <div className="flex justify-center gap-4 mt-3 text-lg text-gray-400">
                <span>Spending: {spending}%</span>
                <span>Savings: {savingsRate}%</span>
                <span>Debt: {debtRatio}%</span>
                <span>Net Worth: {netWorthGrowth}%</span>
            </div>
        </div>
    );
}