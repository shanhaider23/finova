'use client';
import React, { useEffect, useState } from 'react';
import CreateBudget from './CreateBudget';
import { Loader } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import BudgetItem from './BudgetItem';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBudgets } from '@/redux/slices/budgetSlice';
import { fetchExpenses } from '@/redux/slices/expenseSlice';
import ParentBudget from './ParentBudget';

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

				<ParentBudget />
			</div>
			<div>
				<CreateBudget />
			</div>

		</div>
	);
}

export default BudgetList;
