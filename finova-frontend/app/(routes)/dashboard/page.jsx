'use client';
import React, { useEffect, use } from 'react';
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

function Dashboard({ params: paramsPromise }) {
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

	const expenseForecast = [
		{ name: 'Jan', amount: 1500 },
		{ name: 'Feb', amount: 4200 },
		{ name: 'Mar', amount: 6900 },
		{ name: 'Apr', amount: 3400 },
		{ name: 'May', amount: 4700 },
		{ name: 'Jun', amount: 8300 },
		{ name: 'Jul', amount: 7400 },
	];

	const incomeForecast = [
		{ name: 'Jan', amount: 2000 },
		{ name: 'Feb', amount: 6200 },
		{ name: 'Mar', amount: 6100 },
		{ name: 'Apr', amount: 3000 },
		{ name: 'May', amount: 7500 },
		{ name: 'Jun', amount: 6400 },
		{ name: 'Jul', amount: 9600 },
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(6,1fr)] grid-rows-[repeat(3,350px)] sm:grid-rows-[repeat(3,300px)] gap-5 pl-5 pr-5 pt-5">
			<div className="col-span-3">
				<Welcome budgetList={budgetList} />
			</div>
			<div className="col-span-3 md:col-span-1 lg:col-span-1">
				<CardInfo
					data={expenseForecast}
					name="Expense Forecast"
					color="#F63642"
				/>
			</div>
			<div className="col-span-3 md:col-span-2 lg:col-span-2 row-span-2 gap-5 overflow-hidden">
				<PiChartDashboard monthlyList={monthlyList} />
			</div>
			<div className="col-span-3 md:col-span-1 lg:col-span-1">
				<CardInfo
					data={incomeForecast}
					name="Income Forecast"
					color="#98EC2D"
				/>
			</div>

			<div className="col-span-3  gap-5">
				<BarChartDashboard budgetList={budgetList} />
			</div>
			<div className=" overflow-y-auto overflow-x-hidden col-span-3">
				<h2 className="font-bold text-2xl mb-4">Latest Expenses</h2>
				<ExpenseListTable />
			</div>
			<div className="col-span-3 row-span-1 overflow-y-auto overflow-x-hidden ">
				<h2 className="font-bold text-2xl mb-4">Latest Budgets</h2>
				<div className="grid grid-cols-1 gap-5 mr-0 sm:mr-5">
					{budgetList.map((budget, i) => (
						<BudgetItem budget={budget} key={i} expensesList={expenseList} />
					))}
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
