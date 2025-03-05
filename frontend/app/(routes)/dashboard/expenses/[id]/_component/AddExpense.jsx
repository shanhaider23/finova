'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addExpense } from '@/redux/slices/expenseSlice';

function AddExpense({ budgetId, refreshData }) {
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [category, setCategory] = useState('');
	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();

	const handleAddExpense = async () => {
		if (!name || !amount || !category) {
			toast.error('All fields are required.');
			return;
		}

		setLoading(true);

		dispatch(addExpense({ name, amount, budgetId, category }));

		await refreshData();
		setName('');
		setAmount('');
		setCategory('');
		setLoading(false);
	};

	return (
		<div className="p-5 bg-card">
			<h2 className="font-bold text-lg text-gray-800 dark:text-gray-200">
				Add Expense
			</h2>
			<div>
				<div className="mt-2">
					<h2 className="text-black font-bold my-1 dark:text-gray-300">
						Expense Name
					</h2>
					<Input
						placeholder="e.g home decor"
						onChange={(e) => setName(e.target.value)}
						value={name}
						className="bg-input"
					/>
				</div>
				<div className="mt-2">
					<h2 className="text-black font-bold my-1 dark:text-gray-300">
						Expense Amount
					</h2>
					<Input
						placeholder="e.g 5000"
						type="number"
						onChange={(e) => setAmount(e.target.value)}
						value={amount}
						className="bg-input"
					/>
				</div>
				<div className="mt-2">
					<h2 className="text-black font-bold my-1 dark:text-gray-300">
						Expense Category
					</h2>
					<Input
						placeholder="Food"
						onChange={(e) => setCategory(e.target.value)}
						value={category}
						className="bg-input"
					/>
				</div>
				<button
					disabled={!(name && amount && category)}
					className="mt-5 w-full btn-grad"
					onClick={handleAddExpense}
				>
					{loading ? <Loader className="animate-spin" /> : 'Add New Expense'}
				</button>
			</div>
		</div>
	);
}

export default AddExpense;
