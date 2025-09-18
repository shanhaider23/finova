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

	const budgetBarColor = isDarkMode ? '#3ABE34' : '#66FFCA';
	const spendBarColor = isDarkMode ? '#F84233' : '#58D1FF';
	const overBarColor = '#FF0000';

	// Preprocess data for stacked bars
	const processedData = (budgetList || []).map(item => {
		const spendWithinBudget = Math.min(item.totalSpend, item.amount);
		const spendOverBudget = Math.max(item.totalSpend - item.amount, 0);
		return {
			...item,
			spendWithinBudget,
			spendOverBudget,
			remaining: Math.max(item.amount - item.totalSpend, 0),
		};
	});

	return (
		<div className="shadow-lg bg-card h-full hover:shadow-xl p-5">
			<h2 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2">
				Budgets Activity
			</h2>
			<div>
				<ResponsiveContainer width="100%" height={500}>
					<BarChart
						data={processedData}
						margin={{
							top: 5,
							right: 5,
							left: 5,
							bottom: 60,
						}}
						barCategoryGap="20%"
					>
						<XAxis dataKey="name" stroke={isDarkMode ? '#ddd' : '#8884d8'} interval={0} textAnchor="end" angle={-25} />
						<YAxis stroke={isDarkMode ? '#ddd' : '#8884d8'} />
						<Tooltip
							contentStyle={{
								backgroundColor: isDarkMode ? '#222' : '#fff',
								color: isDarkMode ? '#fff' : '#222',
								borderRadius: '8px',
								border: 'none'
							}}
						/>
						<Legend wrapperStyle={{ color: isDarkMode ? '#ddd' : '#8884d8' }}
							layout="horizontal"
							verticalAlign="top"
							align="center" />
						<Bar dataKey="spendWithinBudget" stackId="a" fill={spendBarColor} name="Spent (within budget)" />
						<Bar dataKey="spendOverBudget" stackId="a" fill={overBarColor} name="Over Spent" />
						<Bar dataKey="remaining" stackId="a" fill={budgetBarColor} name="Remaining Budget" />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

export default BarChartDashboard;
