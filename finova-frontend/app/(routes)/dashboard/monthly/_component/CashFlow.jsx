'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMonthly } from '@/redux/slices/monthlySlice';

import { useUser } from '@clerk/nextjs';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { Loader } from 'lucide-react';
import {
	Bar,
	BarChart,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

function CashFlow({ month, setMonth, year, setYear }) {
	const dispatch = useDispatch();
	const { user } = useUser();
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		setIsDarkMode(document.documentElement.classList.contains('dark'));
	}, []);

	const {
		list: monthlyList,
		loading,
		error,
	} = useSelector((state) => state.monthly);

	useEffect(() => {
		if (user?.primaryEmailAddress?.emailAddress) {
			dispatch(fetchMonthly(user.primaryEmailAddress.emailAddress));
		}
	}, [dispatch, user]);

	if (loading) {
		return (
			<div>
				<Loader />
			</div>
		);
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	const filteredList = monthlyList.filter((item) => {
		const itemMonth = new Date(item.date)
			.toLocaleString('default', { month: 'long' })
			.toLowerCase();
		const itemYear = new Date(item.date).getFullYear().toString();

		return (!month || itemMonth === month) && (!year || itemYear === year);
	});

	const totals = filteredList.reduce((acc, item) => {
		acc[item.type] = (acc[item.type] || 0) + parseFloat(item.amount);
		return acc;
	}, {});
	const balance = (totals.income || 0) - (totals.expense || 0);

	const data = [
		{
			name: 'Income',
			income: totals.income,
		},
		{
			name: 'Expenses',
			expense: totals.expense,
		},
	];

	const budgetBarColor = isDarkMode ? '#4caf50' : '#009688';

	const spendBarColor = isDarkMode ? '#ff6347' : '#d32f2f';

	return (
		<div className=" w-full p-5 shadow-lg bg-card">
			<div className="grid grid-cols-1 grid-rows-[40%, 60% ]  gap-5">
				<div className="flex flex-col justify-center items-stretch gap-5">
					<div>
						<div className="w-full text-left border-collapse">
							<div className="border  bg-table dark:border-gray-700 flex justify-center items-center text-lg p-2 italic">
								<h1 className="capitalize">
									{month || year || 'Select Month or Year'}
								</h1>
							</div>
							<div>
								<div className="grid grid-cols-2 border  shadow-lg bg-table dark:border-gray-700">
									<h2 className="justify-self-center self-center">Month</h2>
									<Select value={month} onValueChange={setMonth}>
										<SelectTrigger className="bg-table">
											<SelectValue placeholder="Select a Month" />
										</SelectTrigger>
										<SelectContent className="bg-dropdown">
											<SelectGroup>
												<SelectItem value="january">January</SelectItem>
												<SelectItem value="february">February</SelectItem>
												<SelectItem value="march">March</SelectItem>
												<SelectItem value="april">April</SelectItem>
												<SelectItem value="may">May</SelectItem>
												<SelectItem value="june">June</SelectItem>
												<SelectItem value="july">July</SelectItem>
												<SelectItem value="august">August</SelectItem>
												<SelectItem value="september">September</SelectItem>
												<SelectItem value="october">October</SelectItem>
												<SelectItem value="november">November</SelectItem>
												<SelectItem value="december">December</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>
								<div className="grid grid-cols-2 border  shadow-lg bg-table dark:border-gray-700">
									<h2 className="justify-self-center self-center">Year</h2>
									<Select value={year} onValueChange={setYear}>
										<SelectTrigger className="bg-table">
											<SelectValue placeholder="Select a Year" />
										</SelectTrigger>
										<SelectContent className="bg-dropdown">
											<SelectGroup>
												<SelectItem value="2022">2022</SelectItem>
												<SelectItem value="2023">2023</SelectItem>
												<SelectItem value="2024">2024</SelectItem>
												<SelectItem value="2025">2025</SelectItem>
												<SelectItem value="2026">2026</SelectItem>
												<SelectItem value="2027">2027</SelectItem>
												<SelectItem value="2028">2028</SelectItem>
												<SelectItem value="2029">2029</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					</div>
					<div className="bg-table shadow-md  overflow-hidden border border-gray-200 dark:border-gray-700">
						<div className="overflow-x-auto">
							{loading ? (
								<div className="flex justify-center items-center p-10">
									<Loader className="animate-spin" size={50} />
								</div>
							) : filteredList.length > 0 ? (
								<table className="w-full text-center border-collapse">
									<tbody>
										{Object.entries(totals).map(([type, amount]) => (
											<tr
												key={type}
												className="border-b last:border-none hover:bg-gray-100 dark:hover:bg-gray-600 transition"
											>
												<td
													className={`p-3 text-gray-800 dark:text-gray-200 ${
														type === 'income' ? 'bg-green-500' : 'bg-red-500'
													}`}
												>
													{type === 'income' ? 'Income' : 'Expense'}
												</td>
												<td className="p-3 text-gray-800 dark:text-gray-200">
													{amount.toFixed(2)}
												</td>
											</tr>
										))}
										<tr className="border-t font-bold">
											<td className="p-3 bg-blue-500 text-white">Balance</td>
											<td className="p-3">{balance.toFixed(2)}</td>
										</tr>
									</tbody>
								</table>
							) : (
								<div className="text-center p-10 text-gray-500 dark:text-gray-400">
									No records available
								</div>
							)}
						</div>
					</div>
				</div>
				<div className="border border-gray-200 dark:border-gray-700 bg-table">
					<div className="border shadow-lg bg-dropdown  round dark:border-gray-700 flex justify-center items-center text-lg p-2 italic">
						<h1 className="">Cash Flow </h1>
					</div>
					<div className="mt-4">
						<ResponsiveContainer width={'80%'} height={250}>
							<BarChart
								data={data}
								margin={{
									top: 5,
									right: 5,
									left: 5,
									bottom: 5,
								}}
							>
								<XAxis
									dataKey="name"
									stroke={isDarkMode ? '#ddd' : '#8884d8'}
								/>
								<YAxis stroke={isDarkMode ? '#ddd' : '#8884d8'} />
								<Tooltip />
								<Legend
									wrapperStyle={{ color: isDarkMode ? '#ddd' : '#8884d8' }}
								/>

								{/* Bars with dynamic color based on totalBudget and totalSpend */}
								<Bar dataKey="income" stackId="a" fill={budgetBarColor} />
								<Bar dataKey="expense" stackId="a" fill={spendBarColor} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CashFlow;
