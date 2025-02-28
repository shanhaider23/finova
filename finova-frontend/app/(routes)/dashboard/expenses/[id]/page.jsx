'use client';
import React, { useEffect, use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses } from '@/redux/slices/expenseSlice';
import { deleteBudget, fetchBudgets } from '@/redux/slices/budgetSlice';
import { useUser } from '@clerk/nextjs';
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from './_component/AddExpense';
import ExpenseListTable from './_component/ExpenseListTable';
import EditBudget from './_component/EditBudget';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

function ExpensesScreen({ params: paramsPromise }) {
	const params = use(paramsPromise);
	const dispatch = useDispatch();
	const router = useRouter();
	const { user } = useUser();

	// Get Redux state
	const {
		list: expensesList,
		loading: expensesLoading,
		error: expensesError,
	} = useSelector((state) => state.expenses);

	const {
		list: budgetList,
		loading: budgetLoading,
		error: budgetError,
	} = useSelector((state) => state.budgets);

	const budgetInfo = budgetList.find(
		(budget) => budget.id === parseInt(params.id, 10)
	);

	useEffect(() => {
		if (user?.primaryEmailAddress?.emailAddress) {
			dispatch(fetchBudgets(user.primaryEmailAddress.emailAddress)).then(() => {
				dispatch(fetchExpenses(user.primaryEmailAddress.emailAddress));
			});
		}
	}, [dispatch, user, params.id]);
	const refreshData = () => {
		if (user?.primaryEmailAddress?.emailAddress) {
			dispatch(fetchBudgets(user.primaryEmailAddress.emailAddress));
			dispatch(fetchExpenses(user.primaryEmailAddress.emailAddress));
		}
	};

	const deleteBudgetHandler = () => {
		dispatch(
			deleteBudget({
				paramsId: params.id,
				email: user.primaryEmailAddress.emailAddress,
			})
		).then(() => router.replace('/dashboard/budgets'));
	};

	if (budgetLoading || expensesLoading) {
		return (
			<div className="text-center text-gray-600 dark:text-gray-300">
				Loading data...
			</div>
		);
	}

	if (budgetError || expensesError) {
		return (
			<div className="text-center text-red-500">
				Error: {budgetError || expensesError}
			</div>
		);
	}

	return (
		<div className="pl-5 pr-5">
			<div className="flex justify-end items-center">
				<div className="flex gap-2 items-center">
					<EditBudget budgetInfo={budgetInfo} refreshData={refreshData} />
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<button className="btn-delete flex gap-2" variant="destructive">
								<Trash />
								Delete
							</button>
						</AlertDialogTrigger>
						<AlertDialogContent className="bg-card">
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete
									your current budget along with your expenses.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter className="flex justify-center items-center">
								<AlertDialogCancel className="btn-edit">
									Cancel
								</AlertDialogCancel>
								<AlertDialogAction
									className="btn-delete"
									onClick={deleteBudgetHandler}
								>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-5">
				{budgetInfo ? (
					<BudgetItem budget={budgetInfo} expensesList={expensesList} />
				) : (
					<div className="h-[150px] w-full bg-slate-200 rounded-lg animate-pulse"></div>
				)}
				<AddExpense budgetId={params.id} refreshData={refreshData} />
			</div>

			<div className="mt-5">
				<h2 className="text-2xl font-bold mb-4">Latest Expenses</h2>
				<ExpenseListTable budgetId={params.id} refreshData={refreshData} />
			</div>
		</div>
	);
}

export default ExpensesScreen;
