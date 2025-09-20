'use client';
import React, { useEffect, use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import CardInfo from './_component/CardInfo';
import FinancialHealthScore from './_component/FinancialHealthScore';
import { fetchBudgets } from '@/redux/slices/budgetSlice';
import { fetchExpenses } from '@/redux/slices/expenseSlice';
import { fetchMonthly } from '@/redux/slices/monthlySlice';
import { fetchParentBudgets } from '@/redux/slices/budgetSlice';
import { useSelector, useDispatch } from 'react-redux';
import Welcome from './_component/Welcome';
import PiChartDashboard from './_component/PiChartDashboard';
import axios from 'axios';
import AnnualDashboard from './annual/page';
import CashFlowGauge from './_component/CashFlowGauge';
import SpendingLeaderboard from './_component/SpendingLeaderboard';
import NetWorthChart from './_component/NetWorthChart';
import IncomeVsExpenses from './_component/IncomeVsExpenses';
import StockCard from './_component/StockCard';
import CryptoCard from './_component/CryptoCard';

function Dashboard({ params: paramsPromise }) {
	const [expenseForecast, setExpenseForecast] = useState([]);
	const [incomeForecast, setIncomeForecast] = useState([]);
	const params = use(paramsPromise);
	const { isSignedIn, user } = useUser();
	const router = useRouter();
	const dispatch = useDispatch();
	const {
		list: expenseList,

		error,
	} = useSelector((state) => state.expenses);
	const { list: monthlyList } = useSelector((state) => state.monthly);
	const { list: budgetList, parentBudgets: parentBudgetList, loading } = useSelector((state) => state.budgets);

	const isLoading = loading || !user || !monthlyList || !budgetList || !expenseList;

	useEffect(() => {
		if (!isSignedIn) {
			router.push('/sign-in');
		} else {
			dispatch(fetchBudgets(user.primaryEmailAddress?.emailAddress));
			dispatch(fetchExpenses(user.primaryEmailAddress.emailAddress));
			dispatch(fetchMonthly(user.primaryEmailAddress.emailAddress));
			dispatch(fetchParentBudgets(user.primaryEmailAddress?.emailAddress));
		}
	}, [isSignedIn, user, params.id]);
	const getMonthName = (dateStr) => {
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		const monthIndex = new Date(dateStr).getMonth();
		return months[monthIndex];
	};

	const totalIncome = monthlyList.filter(x => x.type === "income").reduce((sum, x) => sum + x.amount, 0);
	const totalExpense = monthlyList.filter(x => x.type === "expense").reduce((sum, x) => sum + x.amount, 0);
	const spending = totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;
	const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

	const totalDebtPayments = monthlyList
		.filter(x => x.category.toLowerCase().includes("bank fee") || x.category.toLowerCase().includes("loan"))
		.reduce((sum, x) => sum + x.amount, 0);
	const debtRatio = totalIncome > 0 ? Math.round((totalDebtPayments / totalIncome) * 100) : 0;

	// Net worth growth
	const byMonth = {};
	monthlyList.forEach(x => {
		const month = x.date.slice(0, 7); // "YYYY-MM"
		if (!byMonth[month]) byMonth[month] = { income: 0, expense: 0 };
		if (x.type === "income") byMonth[month].income += x.amount;
		if (x.type === "expense") byMonth[month].expense += x.amount;
	});
	const months = Object.keys(byMonth).sort();
	let netWorthGrowth = 0;
	if (months.length >= 2) {
		const first = byMonth[months[0]];
		const last = byMonth[months[months.length - 1]];
		const firstSavings = first.income - first.expense;
		const lastSavings = last.income - last.expense;
		netWorthGrowth = firstSavings !== 0 ? Math.round(((lastSavings - firstSavings) / Math.abs(firstSavings)) * 100) : 0;
	}
	useEffect(() => {

		const fetchData = async () => {
			try {
				const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
				if (!user || !user.primaryEmailAddress?.emailAddress) {
					console.error("User email is not available");
					return;
				}

				const email = user.primaryEmailAddress.emailAddress;

				const [incomeResponse, expenseResponse] = await Promise.all([
					axios.get(`${apiBaseUrl}/api/forecast-income/`, {
						params: { email }, // Pass email as a query parameter
					}),
					axios.get(`${apiBaseUrl}/api/forecast-expenses/`, {
						params: { email }, // Pass email as a query parameter
					}),

				]);

				if (!incomeResponse.data.next_six_month_income_prediction ||
					!Array.isArray(incomeResponse.data.next_six_month_income_prediction)) {
					console.error("Error: incomeResponse.data.next_six_month_income_prediction is not an array", incomeResponse.data);
					return;
				}

				if (!expenseResponse.data.next_six_months_expense_forecast ||
					!Array.isArray(expenseResponse.data.next_six_months_expense_forecast)) {
					console.error("Error: expenseResponse.data.next_six_months_expense_forecast is not an array", expenseResponse.data);
					return;
				}

				const incomeData = incomeResponse.data.next_six_month_income_prediction.map(item => ({
					month: getMonthName(item.month),
					amount: item.predicted_income,


				}));

				const expenseData = expenseResponse.data.next_six_months_expense_forecast.map(item => ({
					month: getMonthName(item.month),
					amount: item.predicted_expense,


				}));

				setIncomeForecast(incomeData)
				setExpenseForecast(expenseData)

			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, []);

	const companies = [
		{ name: "Apple", symbol: "AAPL" },
		{ name: "Microsoft", symbol: "MSFT" },
		{ name: "Amazon", symbol: "AMZN" },
		{ name: "Google", symbol: "GOOGL" },
		{ name: "Meta", symbol: "META" },
		{ name: "Tesla", symbol: "TSLA" },
		{ name: "Nvidia", symbol: "NVDA" },
		{ name: "Netflix", symbol: "NFLX" },
		{ name: "Visa", symbol: "V" },
	];


	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 auto-rows-[minmax(250px,auto)] gap-y-8 gap-x-5 px-2 sm:px-4 pt-5">
			<div className="lg:col-span-2 col-span-1">
				<Welcome budgetList={budgetList} parentBudgetList={parentBudgetList} loading={isLoading} />
			</div>
			<div className="lg:col-span-1 col-span-1">
				<CardInfo
					data={expenseForecast}
					name="Expense Forecast"
					color="#F63642"
					loading={isLoading}
				/>
			</div>
			<div className="lg:col-span-1 col-span-1">
				<CardInfo
					data={incomeForecast}
					name="Income Forecast"
					color="#98EC2D"
					loading={isLoading}
				/>
			</div>
			<div className="lg:col-span-2 col-span-1">
				<IncomeVsExpenses data={monthlyList} loading={isLoading} />
			</div>
			<div className="lg:col-span-2 col-span-1">
				<FinancialHealthScore
					spending={spending}
					savingsRate={savingsRate}
					debtRatio={debtRatio}
					netWorthGrowth={netWorthGrowth}
					loading={isLoading}
				/>
			</div>
			<div className="lg:col-span-2 col-span-1">
				<NetWorthChart data={monthlyList} loading={isLoading} />
			</div>
			<div className="lg:col-span-1 col-span-1 flex flex-col h-full">
				<CashFlowGauge monthlyList={monthlyList} loading={isLoading} />
			</div>
			<div className="lg:col-span-1 col-span-1 flex flex-col h-full">
				<SpendingLeaderboard expenses={expenseList} loading={isLoading} />
			</div>
			<div className="lg:col-span-2 col-span-1">
				<CryptoCard loading={isLoading} />
			</div>
			<div className="lg:col-span-2 col-span-1">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
					{companies.map(company => (
						<div key={company.symbol}>
							<StockCard symbol={company.symbol} name={company.name} loading={isLoading} />
						</div>
					))}
				</div>
			</div>
			<div className="lg:col-span-2 col-span-1 row-span-2 gap-5 overflow-hidden">
				<PiChartDashboard monthlyList={monthlyList} loading={isLoading} />
			</div>
			<div className="lg:col-span-4 col-span-1 row-span-2 overflow-y-auto overflow-x-hidden pr-2">
				<AnnualDashboard monthlyList={monthlyList} loading={isLoading} />
			</div>
		</div>
	);
}

export default Dashboard;
