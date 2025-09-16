'use client';
import React, { useState } from 'react';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import EmojiPicker from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/utils/dbConfig';
import { Budgets } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { createBudget } from '@/redux/slices/budgetSlice';
import { PlusCircle } from 'lucide-react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

function CreateBudget({ refreshData }) {
	const dispatch = useDispatch();
	const [emojiIcon, setEmojiIcon] = useState('Emoji');
	const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [currency, setCurrency] = useState('DKK');

	const { user } = useUser();
	const onCreateBudget = async () => {
		const email = user?.primaryEmailAddress?.emailAddress;

		if (!name || !amount || !currency || !email) {
			toast.error('All fields are required, including email.');
			return;
		}

		dispatch(createBudget({ name, amount, currency, email, emojiIcon }));
		setName('');
		setAmount('');
		setCurrency('');
	};

	return (
		<div>
			<Dialog>
				<DialogTrigger asChild>
					<div className=" cursor-pointer flex justify-end ">
						<button
							className="flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white font-semibold shadow hover:from-green-500 hover:via-blue-600 hover:to-purple-700 transition-all duration-300"
						>
							<PlusCircle className="w-5 h-5" />
							Create Child Budget
						</button>
					</div>
				</DialogTrigger>
				<DialogContent className="bg-card">
					<DialogHeader>
						<DialogTitle className="font-bold text-lg text-gray-800 dark:text-gray-200">
							Create New Budget
						</DialogTitle>
						<DialogDescription>
							<div className="mt-5">
								<button
									onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
									size="lg"
									className="btn-grad"
								>
									{emojiIcon}
								</button>
								<div className="absolute z-20">
									<EmojiPicker
										open={openEmojiPicker}
										onEmojiClick={(e) => {
											setEmojiIcon(e.emoji);
											setOpenEmojiPicker(false);
										}}
									/>
								</div>
								<div className="mt-2">
									<h2 className="text-black font-bold my-1 dark:text-gray-300">
										Budget Name
									</h2>
									<Input
										placeholder="e.g home decor"
										onChange={(e) => setName(e.target.value)}
										className="bg-input"
									/>
								</div>
								<div className="mt-2">
									<h2 className="text-black font-bold my-1 dark:text-gray-300">
										Budget Amount
									</h2>
									<Input
										placeholder="e.g 5000 Dkk"
										type="number"
										onChange={(e) => setAmount(e.target.value)}
										className="bg-input"
									/>
								</div>
								<div className="mt-5">
									<select
										value={currency}
										onChange={(e) => setCurrency(e.target.value)}
										className="w-full p-2 border rounded-md bg-input"
									>
										<option value="kr">🇩🇰 Danish Krone (kr)</option>
										<option value="₨">🇵🇰 Pakistani Rupee (₨)</option>
										<option value="$">🇺🇸 US Dollar ($)</option>
										<option value="€">🇪🇺 Euro (€)</option>
										<option value="£">🇬🇧 British Pound (£)</option>
										<option value="₹">🇮🇳 Indian Rupee (₹)</option>
									</select>
								</div>
							</div>
						</DialogDescription>
						<DialogFooter className="sm:justify-start">
							<DialogClose asChild>
								<button
									disabled={!(name && amount)}
									className="mt-5 w-full btn-grad"
									onClick={onCreateBudget}
								>
									Create Budget
								</button>
							</DialogClose>
						</DialogFooter>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default CreateBudget;
