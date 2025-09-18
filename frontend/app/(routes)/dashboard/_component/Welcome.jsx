import { UserButton, useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import FinanceAIAdviceBanner from '../advice/_component/FinanceAIAdviceBanner';
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

function Welcome({ budgetList, parentBudgetList }) {
	const { user } = useUser();
	const [totalBudget, setTotalBudget] = useState(0);
	const [totalSpend, setTotalSpend] = useState(0);
	const [currency, setCurrency] = useState('$');
	const [fromCurrency, setFromCurrency] = useState('');
	const [toCurrency, setToCurrency] = useState('');
	const [rates, setRates] = useState({});
	const [lastUpdated, setLastUpdated] = useState('');

	useEffect(() => {
		const storedFromCurrency = localStorage.getItem('fromCurrency');
		const storedToCurrency = localStorage.getItem('toCurrency');
		const savedRates = localStorage.getItem('currencyRates');
		const savedLastUpdated = localStorage.getItem('lastUpdated');

		if (savedRates) setRates(JSON.parse(savedRates));
		if (savedLastUpdated) setLastUpdated(savedLastUpdated);
		if (storedFromCurrency) setFromCurrency(storedFromCurrency);
		if (storedToCurrency) setToCurrency(storedToCurrency);

		if (budgetList && parentBudgetList) {
			CalculateCardInfo();
		}
		// eslint-disable-next-line
	}, [budgetList, parentBudgetList]);

	const CalculateCardInfo = () => {
		let total_budget = 0;
		let total_spend = 0;

		if (parentBudgetList && parentBudgetList.length > 0) {
			parentBudgetList.forEach((parent) => {
				total_budget += Number(parent.amount);
				setCurrency(parent.currency);
			});
		}
		if (budgetList && budgetList.length > 0) {
			budgetList.forEach((budget) => {
				total_spend += Number(budget.totalSpend || 0);
			});
		}
		setTotalBudget(total_budget);
		setTotalSpend(total_spend);
	};

	const getCurrencyFlag = (currencyCode) => {
		return `https://flagcdn.com/w40/${currencyCode
			.substring(0, 2)
			.toLowerCase()}.png`;
	};

	const progress = totalBudget > 0 ? Math.min((totalSpend / totalBudget) * 100, 100) : 0;
	const gaugeData = [
		{
			name: "Used",
			value: progress,
			fill: progress < 80 ? "#22c55e" : progress < 100 ? "#facc15" : "#ef4444",
		},
	];

	return (
		<div className="flex flex-col bg-card h-full justify-between items-stretch pt-5 overflow-auto shadow-md">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-center px-4 gap-4">
				<div className="flex items-center gap-2">
					<UserButton />
					<div>
						<p>Welcome back</p>
						<h1 className="text-xl font-semibold break-words">
							{user?.fullName}!
						</h1>
					</div>
				</div>
				<div className="w-full sm:w-auto">
					{fromCurrency && toCurrency && rates[fromCurrency] && rates[toCurrency] ? (
						<>
							<div className="flex justify-center items-center gap-3">
								<div className="flex items-center gap-2">
									<img
										src={getCurrencyFlag(fromCurrency)}
										alt={`Flag of ${fromCurrency}`}
										className="w-6 h-4"
									/>
									<span className="font-semibold">{fromCurrency}</span>
								</div>
								<span className="text-lg">to</span>
								<div className="flex items-center gap-2">
									<img
										src={getCurrencyFlag(toCurrency)}
										alt={`Flag of ${toCurrency}`}
										className="w-6 h-4"
									/>
									<span className="font-semibold">{toCurrency}</span>
								</div>
							</div>
							<div className="flex flex-col">
								<p className="text-center text-md text-gray-500">
									Exchange Rate:{' '}
									<strong>
										{(rates[toCurrency] / rates[fromCurrency]).toFixed(2)}
									</strong>
								</p>
								<p className="text-center text-xs text-gray-500">
									Last Updated:{' '}
									<strong>
										{new Date(lastUpdated).toLocaleString('en-GB', {
											day: '2-digit',
											month: '2-digit',
											year: 'numeric',
											hour: '2-digit',
											minute: '2-digit',
											hour12: false,
										})}
									</strong>
								</p>
							</div>
						</>
					) : (
						<span>Loading...</span>
					)}
				</div>
			</div>

			{/* Main Content: Responsive columns */}
			<div className="flex flex-col lg:flex-row gap-6 w-full items-stretch justify-center py-6">
				{/* Advice Banner */}
				<div className="w-full lg:w-[60%] flex flex-col justify-center mb-6 lg:mb-0">
					<FinanceAIAdviceBanner />
				</div>
				{/* Gauge */}
				<div className="w-full lg:w-[40%] flex flex-col justify-center items-center ">

					<div className="w-full flex justify-center -mt-24">
						<RadialBarChart
							width={180}
							height={150}
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
					</div>
					<div className="text-center mt-2">
						<div className="text-lg font-bold">{progress.toFixed(0)}% Budget used</div>
						<div className="text-sm text-gray-500">
							{totalBudget - totalSpend > 0
								? `${(totalBudget - totalSpend).toLocaleString()} ${currency} remaining`
								: `Over budget by ${(totalSpend - totalBudget).toLocaleString()} ${currency}`}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Welcome;