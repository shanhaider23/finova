'use client';
import React, { useEffect, useState } from 'react';
import CreateBudget from './CreateBudget';

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
					<div>Loading...</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
						{budgetList?.length > 0
							? budgetList.map((budget) => (
									<BudgetItem
										key={budget.id}
										budget={budget}
										expensesList={expensesList} // Pass expensesList here
									/>
							  ))
							: 'No budgets available'}
					</div>
				)}
			</div>
		</div>
	);
}

export default BudgetList;
