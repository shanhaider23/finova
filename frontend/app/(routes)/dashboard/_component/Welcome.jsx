import { UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

function Welcome({ budgetList }) {
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

		if (savedRates) {
			setRates(JSON.parse(savedRates));
		}
		if (savedLastUpdated) {
			setLastUpdated(savedLastUpdated);
		}
		if (storedFromCurrency) setFromCurrency(storedFromCurrency);
		if (storedToCurrency) setToCurrency(storedToCurrency);

		if (budgetList) {
			CalculateCardInfo();
		}
	}, [budgetList]);

	const CalculateCardInfo = () => {
		let total_budget = 0;
		let total_spend = 0;
		budgetList.forEach((budget) => {
			setCurrency(budget.currency);
			total_budget += Number(budget.amount);
			total_spend += budget.totalSpend;
		});
		setTotalBudget(total_budget);
		setTotalSpend(total_spend);
	};
	const getCurrencyFlag = (currencyCode) => {
		return `https://flagcdn.com/w40/${currencyCode
			.substring(0, 2)
			.toLowerCase()}.png`;
	};
	const progress = Math.min((totalSpend / totalBudget) * 100, 100);
	return (
		<div className="flex flex-col bg-card h-full justify-between items-stretch pt-5 overflow-auto shadow-md">
			<div className="flex justify-between items-center pl-5 pr-5 flex-wrap gap-2">
				<div className="flex justify-center items-center gap-2 ">
					<UserButton />
					<div>
						<p>Welcome back</p>
						<h1 className=" text-xl font-semibold  break-words">
							{user?.fullName}!
						</h1>
					</div>
				</div>
				<div>
					{fromCurrency &&
						toCurrency &&
						rates[fromCurrency] &&
						rates[toCurrency] ? (
						<>
							<div className="flex justify-start sm:justify-center items-center gap-3">
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

							<div className="flex flex-col ">
								<p className="text-left sm:text-center  text-md text-gray-500">
									Exchange Rate:{' '}
									<strong>
										{(rates[toCurrency] / rates[fromCurrency]).toFixed(2)}
									</strong>
								</p>

								{/* Last Updated */}
								<p className="text-center  text-xs text-gray-500">
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

			<div className="flex justify-between items-center pl-0 sm:pl-5 pr-5  ">
				<div className="flex flex-col items-stretch justify-between">
					{budgetList ? (
						<div className="flex justify-between items-stretch ">
							<div className="flex flex-col border-r-2 ml-5 mt-5 mb-5 pr-1 sm:pr-5 ">
								<div className="flex justify-center items-center gap-2">
									<h1 className="text-3xl text-gray-900 dark:text-gray-100 pb-2">
										{totalBudget}
									</h1>
									<p className="text-lg">{currency}</p>
								</div>
								<h2 className="text-gray-700 dark:text-gray-200 font-semibold lg:text-lg sm:text-sm">
									Total Budget
								</h2>
							</div>

							<div className="flex flex-col  m-5">
								<div className="flex justify-center items-center gap-2">
									<h2 className="text-3xl text-gray-900 dark:text-gray-100 pb-2">
										{totalSpend}
									</h2>
									<p className="text-lg">{currency}</p>
								</div>
								<h2 className="text-gray-700 dark:text-gray-200 font-semibold lg:text-lg sm:text-sm">
									Total Spend
								</h2>
							</div>
						</div>
					) : (
						<div className="flex gap-6 w-full">
							{[1, 2, 3].map((item, i) => (
								<div
									key={i}
									className="h-[120px] w-full bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg"
								></div>
							))}
						</div>
					)}

					<div className="ml-5 mr-5">
						<div className="relative h-3 rounded-full bg-gray-200 dark:bg-gray-600">
							<div
								className="absolute top-0 left-0 h-3 rounded-full bg-green-500 transition-all"
								style={{ width: `${progress}%` }}
							></div>
						</div>
						<p className="text-sm text-gray-600 mt-1 text-center dark:text-gray-300">
							{progress.toFixed(0)}% used
						</p>
					</div>
				</div>

				<div className="hidden sm:block">
					<Image
						src="/welcome.png"
						alt="Logo"
						width={250}
						height={200}
					/>
				</div>
			</div>
		</div>
	);
}

export default Welcome;
