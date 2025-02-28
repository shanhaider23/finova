'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses } from '@/redux/slices/expenseSlice';
import { useUser } from '@clerk/nextjs';
import ExpenseListTable from './[id]/_component/ExpenseListTable';
import PiChart from './-component/PiChart';
import ShapeChart from './-component/ShapeChart';
import { Loader } from 'lucide-react';

function ExpenseComponent({ params }) {
	const dispatch = useDispatch();
	const { user } = useUser();

	// Get expenses state from Redux
	const {
		list: expenseList,
		loading,
		error,
	} = useSelector((state) => state.expenses);

	useEffect(() => {
		if (user?.primaryEmailAddress?.emailAddress) {
			dispatch(fetchExpenses(user.primaryEmailAddress.emailAddress));
		}
	}, [dispatch, user, params.id]);

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

	if (!expenseList || expenseList.length === 0) {
		return <div>No expenses found.</div>;
	}

	return (
		<div className="m-5">
			<div className="flex justify-center items-center flex-col gap-5">
				<div className="w-full grid grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 gap-5 ">
					<div className=" flex justify-center items-center shadow-lg bg-card p-5 ">
						<PiChart expensesList={expenseList} />
					</div>
					<div className="flex justify-center items-center shadow-lg bg-card p-5 ">
						<ShapeChart expensesList={expenseList} />
					</div>
				</div>
				<div className="w-full">
					<ExpenseListTable
						refreshData={() =>
							dispatch(fetchExpenses(user.primaryEmailAddress.emailAddress))
						}
					/>
				</div>
			</div>
		</div>
	);
}

export default ExpenseComponent;
