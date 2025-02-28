import React from 'react';
import Link from 'next/link';

function BudgetItem({ budget, expensesList }) {
	const totalSpend = (expensesList || [])
		.filter((expense) => expense?.budgetId === budget?.id)
		.reduce((sum, expense) => sum + Number(expense?.amount || 0), 0);

	const progress = Math.min((totalSpend / budget.amount) * 100, 100);

	return (
		<Link href={`/dashboard/expenses/${budget.id}`}>
			<div className="flex flex-col justify-between items-center min-h-52 p-5 bg-card h-full hover:shadow-xl hover:scale-95 transition-all cursor-pointer">
				<div className="flex  justify-between w-full items-center flex-wrap-reverse gap-4">
					<div className="flex items-center gap-2">
						<div className="bg-slate-200 text-slate-600 p-3 rounded-full dark:bg-gray-700 dark:text-gray-300">
							{budget?.icon}
						</div>

						<div className="mt-5">
							<h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
								{budget.name}
							</h2>

							<p className="text-sm text-gray-500 dark:text-gray-400">
								{`${
									(
										expensesList?.filter(
											(expense) => expense.budgetId === budget.id
										) || []
									).length
								} 
                ${
									(
										expensesList?.filter(
											(expense) => expense.budgetId === budget.id
										) || []
									).length === 1
										? 'item'
										: 'items'
								}`}
							</p>
						</div>
					</div>
					<div>
						<h2 className="text-5xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
							{budget.amount}
							<p className="text-sm text-gray-500 dark:text-gray-400">
								{budget.currency}
							</p>
						</h2>
					</div>
				</div>
				<div className="w-full mb-2">
					<div className="text-gray-800 font-semibold flex items-center justify-between mt-5 dark:text-gray-200">
						<p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 flex-wrap">
							Spent:
							<span>
								{totalSpend} {budget.currency}
							</span>
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 flex-wrap">
							Remaining:
							<span>
								{budget.amount - (budget.totalSpend || 0)} {budget.currency}
							</span>
						</p>
					</div>

					<div>
						<div className="relative h-3 rounded-full bg-gray-200 dark:bg-gray-600">
							<div
								className="absolute top-0 left-0 h-3 rounded-full bg-blue-500 transition-all"
								style={{ width: `${progress}%` }}
							></div>
						</div>
						<p className="text-sm text-gray-600 mt-1 text-center dark:text-gray-300">
							{progress.toFixed(0)}% used
						</p>
					</div>
				</div>
			</div>
		</Link>
	);
}

export default BudgetItem;
