'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PenBox } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useUser } from '@clerk/nextjs';
import { Input } from '@/components/ui/input';
import { eq } from 'drizzle-orm';
import { toast } from 'sonner';
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
import { useDispatch } from 'react-redux';
import { editBudget } from '@/redux/slices/budgetSlice';

function EditBudget({ budgetInfo, refreshData }) {
	const dispatch = useDispatch();
	const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon);
	const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
	const [name, setName] = useState(budgetInfo?.name);
	const [amount, setAmount] = useState(budgetInfo?.amount);
	const [currency, setCurrency] = useState(budgetInfo?.currency);

	const { user } = useUser();

	const onEditBudget = async () => {
		dispatch(
			editBudget({
				budgetId: budgetInfo.id,
				name,
				amount,
				emojiIcon,
				currency,
				created_by: budgetInfo.created_by,

			})
		);
		refreshData();
	};

	return (
		<div>
			<Dialog>
				<DialogTrigger asChild>
					<button className="btn-edit flex gap-2">
						<PenBox /> Edit
					</button>
				</DialogTrigger>
				<DialogContent className="bg-card">
					<DialogHeader>
						<DialogTitle>Update Budget</DialogTitle>
						<DialogDescription>
							<div className="mt-5">
								<button
									variant="outline"
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
										defaultValue={budgetInfo?.name}
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
										defaultValue={budgetInfo?.amount}
										className="bg-input"
									/>
								</div>
								<div className="mt-2">
									<h2 className="text-black font-bold my-1 dark:text-gray-300">
										Currency
									</h2>
									<select
										value={currency}
										onChange={(e) => setCurrency(e.target.value)}
										defaultValue={budgetInfo?.currency}
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
									className="btn-grad w-full mt-4"
									onClick={onEditBudget}
								>
									Update Budget
								</button>
							</DialogClose>
						</DialogFooter>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default EditBudget;
