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


	return (
		<div className="m-5">
			<div className="flex justify-center items-center flex-col gap-5">
				{loading && (
					<div className="flex justify-center items-center">
						<Loader className="animate-spin" size={50} />
					</div>
				)}

				{!loading && error && (
					<div className="text-red-500 text-center">
						Error: {error}
					</div>
				)}

				{!loading && !error && (!expenseList || expenseList.length === 0) && (
					<div className="text-gray-500 text-center">
						No expenses found.
					</div>
				)}

				{!loading && !error && expenseList?.length > 0 && (
					<>
						<div className="w-full grid grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 gap-5">
							<div className="flex justify-center items-center shadow-lg bg-card p-5">
								<PiChart expensesList={expenseList} />
							</div>
							<div className="flex justify-center items-center shadow-lg bg-card p-5">
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
					</>
				)}
			</div>
		</div>
	);
}

export default ExpenseComponent;
