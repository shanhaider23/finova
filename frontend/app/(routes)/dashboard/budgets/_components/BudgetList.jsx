'use client';
import React, { useEffect, useState } from 'react';
import CreateBudget from './CreateBudget';
import { Loader } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import BudgetItem from './BudgetItem';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBudgets } from '@/redux/slices/budgetSlice';
import { fetchExpenses } from '@/redux/slices/expenseSlice';

function BudgetList() {
	const { user } = useUser();
	const dispatch = useDispatch();
	const { list: budgetList, loading } = useSelector((state) => state.budgets);
	const { list: expensesList } = useSelector((state) => state.expenses); // assuming you fetch expenses

	useEffect(() => {
		if (user?.primaryEmailAddress?.emailAddress) {
			dispatch(fetchBudgets(user.primaryEmailAddress?.emailAddress));
			dispatch(fetchExpenses(user.primaryEmailAddress?.emailAddress)); // Fetch expenses
		}
	}, [user, dispatch]);

	return (
		<div className="mt-5 flex flex-col gap-5">
			<div>
				<CreateBudget />
			</div>
			<div className="pl-5">
				{loading ? (
					// Show a loader while data is being fetched
					<div className="flex justify-center items-center">
						<Loader className="animate-spin" size={50} />
					</div>
				) : budgetList?.length > 0 ? (
					// Show the budget list if data is available
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
						{budgetList.map((budget) => (
							<BudgetItem
								key={budget.id}
								budget={budget}
								expensesList={expensesList} // Pass expensesList here
							/>
						))}
					</div>
				) : (
					// Show "No budgets available" only when loading is false and the list is empty
					<p className="text-center text-gray-500">No budgets available at the moment</p>
				)}
			</div>
		</div>
	);
}

export default BudgetList;
