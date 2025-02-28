import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteExpense } from '@/redux/slices/expenseSlice';
import { Loader, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';

function ExpenseListTable({ budgetId, refreshData }) {
	const dispatch = useDispatch();
	const { user } = useUser();
	const expensesList = useSelector(
		(state) => state.expenses.list,
		(prev, next) => {
			return prev.length === next.length;
		}
	);

	const [loading, setLoading] = useState(true);

	// Simulate a 4-5 second loader
	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false);
		}, 2000);

		return () => clearTimeout(timer); // Cleanup timeout on unmount
	}, [expensesList]);

	const filteredExpenses = budgetId
		? expensesList.filter(
				(expense) => expense.budgetId === parseInt(budgetId, 10)
		  )
		: expensesList;

	const handleDelete = async (expense) => {
		const confirmDelete = window.confirm(
			`Are you sure you want to delete "${expense.name}"?`
		);
		if (!confirmDelete) return;

		if (user?.primaryEmailAddress?.emailAddress) {
			dispatch(
				deleteExpense({
					expenseId: expense.id,
					email: user.primaryEmailAddress.emailAddress,
				})
			).unwrap();
			refreshData();
		} else {
			toast.error('User not authenticated');
		}
	};

	return (
		<div className=" shadow-lg overflow-hidden bg-card">
			<div className="overflow-x-auto">
				{loading ? (
					<div className="flex justify-center items-center p-10">
						<Loader className="animate-spin" size={50} />
					</div>
				) : filteredExpenses.length > 0 ? (
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
								<th className="p-3 font-semibold min-w-[150px]">Name</th>
								<th className="p-3 font-semibold min-w-[100px]">Amount</th>
								<th className="p-3 font-semibold min-w-[100px]">Category</th>
								<th className="p-3 font-semibold min-w-[150px]">Date</th>
								<th className="p-3 font-semibold min-w-[100px] text-center">
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{filteredExpenses.map((expense) => (
								<tr
									key={expense.id}
									className="border-b last:border-none hover:bg-gray-100 dark:hover:bg-gray-600 transition"
								>
									<td className="p-3 text-gray-800 dark:text-gray-200">
										{expense.name}
									</td>
									<td className="p-3 text-gray-800 dark:text-gray-200">
										{expense.amount}
									</td>
									<td className="p-3 text-gray-800 dark:text-gray-200">
										{expense.category}
									</td>
									<td className="p-3 text-gray-800 dark:text-gray-200">
										{expense.createdAt}
									</td>
									<td className="p-3 text-center">
										<button
											className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 transition"
											onClick={() => handleDelete(expense)}
										>
											<Trash size={18} />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<div className="text-center p-10 text-gray-500 dark:text-gray-400">
						No expenses available
					</div>
				)}
			</div>
		</div>
	);
}

export default ExpenseListTable;
