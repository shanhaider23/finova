import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Loader } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

function PiChart({ expensesList }) {
	const [chartData, setChartData] = useState(null);
	const [isDarkMode, setIsDarkMode] = useState(false);

	// Detect dark or light mode
	useEffect(() => {
		const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
		setIsDarkMode(darkModeQuery.matches);

		const updateMode = (e) => setIsDarkMode(e.matches);
		darkModeQuery.addEventListener('change', updateMode);

		return () => darkModeQuery.removeEventListener('change', updateMode);
	}, []);

	// Define light and dark color schemes
	const lightColors = [
		'#FF6384',
		'#36A2EB',
		'#FFCE56',
		'#4BC0C0',
		'#9966FF',
		'#FF9F40',
	];
	const darkColors = [
		'#FF6384',
		'#36A2EB',
		'#FFCE56',
		'#4BC0C0',
		'#9966FF',
		'#FF9F40',
	];

	// Update the chart data when expensesList changes
	useEffect(() => {
		if (expensesList && expensesList.length > 0) {
			const aggregatedData = expensesList.reduce((acc, transaction) => {
				acc[transaction.category] =
					(acc[transaction.category] || 0) + transaction.amount;
				return acc;
			}, {});

			const categories = Object.keys(aggregatedData);
			const amounts = Object.values(aggregatedData);
			const colors = isDarkMode ? darkColors : lightColors;

			setChartData({
				labels: categories,
				datasets: [
					{
						label: 'Amount by Category',
						data: amounts,
						backgroundColor: colors.slice(0, categories.length),
						borderColor: colors.map((color) => color.replace('0.8', '1')),
						borderWidth: 1,
					},
				],
			});
		} else {
			setChartData(null);
		}
	}, [expensesList, isDarkMode]);

	if (!chartData) {
		return (
			<div className="flex justify-center items-center h-40">
				<Loader className="animate-spin" size={40} />
			</div>
		);
	}

	return (
		<div className="w-full max-w-md mx-auto">
			<Pie data={chartData} />
		</div>
	);
}

export default PiChart;
