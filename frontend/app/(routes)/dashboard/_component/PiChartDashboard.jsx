import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import dayjs from 'dayjs';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import LoadingSkeleton from '@/app/_component/LoadingSkeleton';

function PiChartDashboard({ monthlyList, loading }) {
	const currentMonth = dayjs().format('YYYY-MM');
	const [month, setMonth] = useState(currentMonth);
	const months = Array.from({ length: 12 }, (_, i) => {
		const date = dayjs().month(i).format('YYYY-MM');
		return { label: dayjs().month(i).format('MMMM'), value: date };
	});

	const filteredData = monthlyList.filter(
		(item) => dayjs(item.date).format('YYYY-MM') === month
	);

	const totalIncome = filteredData
		.filter((item) => item.type === 'income')
		.reduce((sum, item) => sum + Number(item.amount), 0);

	const totalExpenses = filteredData
		.filter((item) => item.type === 'expense')
		.reduce((sum, item) => sum + Number(item.amount), 0);

	const expensePercentage = totalIncome
		? Math.round((totalExpenses / totalIncome) * 100)
		: 0;

	const expenseCategories = filteredData
		.filter((item) => item.type === 'expense')
		.reduce((acc, item) => {
			const category = item.category.trim().toLowerCase(); // Normalize category names
			if (!acc[category]) {
				acc[category] = {
					name: item.category, // Keep original casing for display
					amount: 0,
				};
			}
			acc[category].amount += Number(item.amount);
			return acc;
		}, {});

	const data = Object.values(expenseCategories)
		.map(({ name, amount }) => ({
			name,
			value: Number(((amount / totalIncome) * 100).toFixed(2)),
		}))
		.filter((item) => item.value >= 1);

	const otherCategory = Object.values(expenseCategories)
		.map(({ amount }) => ({
			value: Number(((amount / totalIncome) * 100).toFixed(3)),
		}))
		.filter((item) => item.value < 1)
		.reduce((acc, item) => acc + item.value, 0);

	if (otherCategory > 0) {
		data.push({
			name: 'Others',
			value: Number(otherCategory.toFixed(2)),
		});
	}

	// Sort data by value (percentage) in descending order
	data.sort((a, b) => b.value - a.value);

	const COLORS = [
		'#7c0000', // Purple
		'#ff1414', // Deep Pink
		'#F84134', // Red

		'#D2691E', // Chocolate
		'#FF8C00', // Orange
		'#FFD700', // Yellow

		'#178d21', // Blue-Violet
		'#0cb91a', // Blue
		'#32CD32', // Lime Green
		'#84da5d', // Deep Sky Blue
		'#77f577', // Lime Green
	];

	if (loading) {
		return (
			<div className="bg-card h-full flex justify-center items-center p-5 rounded-lg shadow-md">
				<LoadingSkeleton height={200} />
			</div>
		);
	}

	return (
		<div className="bg-card flex justify-start items-center flex-col shadow-md">
			<div className="flex justify-between items-center w-full">
				<h2 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-5 mt-5 pl-5">
					{dayjs(month).format('MMMM')} Month Activity
				</h2>
				<div className="pr-5">
					<Select value={month} onValueChange={setMonth}>
						<SelectTrigger className="w-[120px] bg-input round">
							<SelectValue placeholder={dayjs(month).format('MMMM')} />
						</SelectTrigger>
						<SelectContent className="bg-input round">
							{months.map(({ label, value }) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className="relative w-[92%] h-75">
				<ResponsiveContainer width="100%" height={200}>
					<PieChart>
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							innerRadius={70}
							outerRadius={90}
							paddingAngle={5}
							dataKey="value"
							isAnimationActive={true} // Prevents animation issues
						>
							{data.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[index % COLORS.length]}
								/>
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: '#fff',
								borderRadius: '8px',
								padding: '5px',
								border: '1px solid #ddd',
							}}
							formatter={(value, name) => [`${value.toFixed(2)}%`, name]}
						/>
					</PieChart>
				</ResponsiveContainer>

				{/* Center Text */}
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<span className="text-xl font-bold text-gray-800 dark:text-gray-200">
						{expensePercentage}%
					</span>
					<span className="text-sm text-gray-600 dark:text-gray-400">
						Spent
					</span>
				</div>
			</div>
			<div className="m-5 text-center w-[92%]  overflow-y-auto">
				<table className="w-full border-collapse">
					<thead>
						<tr className="text-gray-700 dark:text-gray-300 border-b">
							<th className="p-2 text-left">Category</th>
							<th className="p-2 text-center">%</th>
							<th className="p-2 text-right">Amount </th>
						</tr>
					</thead>
					<tbody>
						{data.map((entry, index) => {
							const categoryKey = Object.keys(expenseCategories).find(
								(key) => expenseCategories[key].name === entry.name
							);
							const amount = categoryKey
								? expenseCategories[categoryKey].amount
								: 0;

							return (
								<tr
									key={index}
									className="border-b"
									style={{ color: COLORS[index % COLORS.length] }}
								>
									<td className="p-2 text-left">{entry.name}</td>
									<td className="p-2 text-center">{entry.value}%</td>
									<td className="p-2 text-right">{amount.toFixed(2)}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default PiChartDashboard;
