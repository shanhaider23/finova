'use client';
import React, { useState, useEffect } from 'react';
import {
	Bar,
	BarChart,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

function BarChartDashboard({ budgetList, totalBudget, totalSpend }) {
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		setIsDarkMode(document.documentElement.classList.contains('dark'));
	}, []);

	// Only execute code that uses `isDarkMode` after the component has mounted
	const budgetBarColor = isDarkMode ? '#3ABE34' : '#66FFCA';

	const spendBarColor = isDarkMode ? '#F84233' : ' #58D1FF';

	return (
		<div className="shadow-lg bg-card h-full hover:shadow-xl p-5">
			<h2 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-5">
				Budgets Activity
			</h2>
			<ResponsiveContainer width={'100%'} height={'90%'}>
				<BarChart
					data={budgetList}
					margin={{
						top: 5,
						right: 5,
						left: 5,
						bottom: 5,
					}}
				>
					<XAxis dataKey="name" stroke={isDarkMode ? '#ddd' : '#8884d8'} />
					<YAxis stroke={isDarkMode ? '#ddd' : '#8884d8'} />
					<Tooltip />
					<Legend wrapperStyle={{ color: isDarkMode ? '#ddd' : '#8884d8' }} />

					{/* Bars with dynamic color based on totalBudget and totalSpend */}
					<Bar dataKey="totalSpend" stackId="a" fill={spendBarColor} />
					<Bar dataKey="amount" stackId="a" fill={budgetBarColor} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}

export default BarChartDashboard;
