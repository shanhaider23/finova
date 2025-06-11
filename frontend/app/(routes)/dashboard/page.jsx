'use client';
import React, { useEffect, use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import CardInfo from './_component/CardInfo';
import BarChartDashboard from './_component/BarChart';
import BudgetItem from './budgets/_components/BudgetItem';
import ExpenseListTable from './expenses/[id]/_component/ExpenseListTable';
import { fetchBudgets } from '@/redux/slices/budgetSlice';
import { fetchExpenses } from '@/redux/slices/expenseSlice';
import { fetchMonthly } from '@/redux/slices/monthlySlice';
import { useSelector, useDispatch } from 'react-redux';
import Welcome from './_component/Welcome';
import PiChartDashboard from './_component/PiChartDashboard';
import axios from 'axios';
import AnnualDashboard from './annual/page';

function Dashboard({ params: paramsPromise }) {
	const [expenseForecast, setExpenseForecast] = useState([]);
	const [incomeForecast, setIncomeForecast] = useState([]);
	const params = use(paramsPromise);
	const { isSignedIn, user } = useUser();
	const router = useRouter();
	const dispatch = useDispatch();
	const { list: budgetList, loading } = useSelector((state) => state.budgets);
	const {
		list: expenseList,

		error,
	} = useSelector((state) => state.expenses);
	const { list: monthlyList } = useSelector((state) => state.monthly);


	useEffect(() => {
		if (!isSignedIn) {
			router.push('/sign-in');
		} else {
			dispatch(fetchBudgets(user.primaryEmailAddress?.emailAddress));
			dispatch(fetchExpenses(user.primaryEmailAddress.emailAddress));
			dispatch(fetchMonthly(user.primaryEmailAddress.emailAddress));
		}
	}, [isSignedIn, user, params.id]);
	const getMonthName = (dateStr) => {
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		const monthIndex = new Date(dateStr).getMonth();
		return months[monthIndex];
	};
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


	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(6,1fr)] grid-rows-[repeat(3,350px)] sm:grid-rows-[repeat(3,300px)] gap-5 pl-5 pr-5 pt-5">
			<div className="col-span-2">
				<Welcome budgetList={budgetList} />
			</div>
			<div className="col-span-3 md:col-span-1 lg:col-span-1">
				<CardInfo
					data={expenseForecast}
					name="Expense Forecast"
					color="#F63642"
				/>
			</div>
			<div className="col-span-3 md:col-span-1 lg:col-span-1">
				<CardInfo
					data={incomeForecast}
					name="Income Forecast"
					color="#98EC2D"
				/>
			</div>
			<div className="col-span-3 md:col-span-2 lg:col-span-2 row-span-2 gap-5 overflow-hidden">
				<PiChartDashboard monthlyList={monthlyList} />
			</div>


			<div className="col-span-4  gap-5">
				<BarChartDashboard budgetList={budgetList} />
			</div>

			<div className=" overflow-y-auto overflow-x-hidden col-span-3 pr-2">
				<div>
					<AnnualDashboard monthlyList={monthlyList} />
				</div>
				<div className='bg-card'>
					<h2 className="font-bold text-2xl p-4">Latest Expenses</h2>
					<ExpenseListTable />
				</div>
			</div>
			<div className="col-span-3 row-span-1 overflow-y-auto overflow-x-hidden  ">
				<div className='bg-card mr-2'>
					<h2 className="font-bold text-2xl p-4">Latest Budgets</h2>
					<div className="grid grid-cols-1 gap-5 pl-4 mr-0 sm:mr-5">
						{budgetList.map((budget, i) => (
							<BudgetItem budget={budget} key={i} expensesList={expenseList} />
						))}
					</div>
				</div>
			</div>

		</div>
	);
}

export default Dashboard;
