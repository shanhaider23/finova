'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addMonthly } from '@/redux/slices/monthlySlice';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';

import { predefinedCategories } from '@/lib/categories';
import { Calendar } from '@/components/ui/calendar';
import { useRef } from 'react';
import Papa from 'papaparse';

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,

} from '@/components/ui/command';

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUser } from '@clerk/nextjs';

function InputDetail() {
	const [amount, setAmount] = useState('');
	const [category, setCategory] = useState('');
	const [loading, setLoading] = useState(false);
	const [date, setDate] = useState('');
	const [type, setType] = useState('');
	const [name, setName] = useState('');
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const dispatch = useDispatch();
	const { user } = useUser();
	const fileInputRef = useRef(null);

	const filteredCategories = predefinedCategories.filter((item) => {
		if (type === 'income') {
			return (
				item.includes('Income') || // Include income-related categories
				item.includes('Salary') ||
				item.includes('Bonus') ||
				item.includes('Earnings')
			);
		} else if (type === 'expense') {
			return !item.includes('Income'); // Exclude income-related categories
		}
		return false; // Return an empty list if no type is selected
	});


	const handleInputDetail = async () => {
		const email = user?.primaryEmailAddress?.emailAddress;

		if (!date || !type || !name || !category || !amount) {
			toast.error('All fields are required.');

			return;
		}

		setLoading(true);

		try {
			// Dispatch the action to add the new data
			await dispatch(addMonthly({ date, type, name, category, amount, email }));

			// Re-fetch the updated data
			await dispatch(fetchMonthly(email));

			toast.success("Data successfully added!")
		} catch (error) {
			toast.error("Failed to add data.")
		} finally {
			setDate('');
			setType('');
			setCategory('');
			setAmount('');
			setName('');
			setLoading(false);
		}
	};

	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		if (!file) return;
		setLoading(true);
		const reader = new FileReader();

		reader.onload = (e) => {
			const content = e.target.result;

			if (file.name.endsWith('.csv')) {
				Papa.parse(content, {
					header: true,
					skipEmptyLines: true,
					complete: (result) => processFileData(result.data),
				});
			} else if (file.name.endsWith('.json')) {
				try {
					const jsonData = JSON.parse(content);
					processFileData(jsonData);
				} catch (error) {
					toast.error('Invalid JSON file.');
					setLoading(false);
				}
			}
		};

		reader.readAsText(file);
	};
	const processFileData = (data) => {
		if (!Array.isArray(data) || data.length === 0) {
			toast.error('Invalid data format.');
			setLoading(false);
			return;
		}

		const email = user?.primaryEmailAddress?.emailAddress;

		let hasError = false;

		data.forEach((item) => {
			const { date, type, name, category, amount } = item;
			if (!date || !type || !name || !category || !amount) {
				hasError = true; // Flag an error if any item is invalid
				return;
			}

			dispatch(addMonthly({ date, type, name, category, amount, email }));
		});

		if (hasError) {
			toast.error('Some items in the file were missing required fields.');
		} else {
			toast.success('Data successfully added!');
		}

		setLoading(false);
		setIsDialogOpen(false);
	};

	return (
		<div className="flex justify-between items-center gap-3">
			<Dialog>
				<DialogTrigger asChild>
					<div className=" cursor-pointer w-full ">
						<button
							className="round w-full h-12 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-green-500 hover:via-blue-600 hover:to-purple-700 transition-all duration-300 truncate"
							title="Add Income or Expense" // Tooltip for full text
						>
							Add
						</button>
					</div>
				</DialogTrigger>
				<DialogContent className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:max-w-sm bg-card max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="font-bold text-lg text-gray-800 dark:text-gray-200">
							Add Income or Expense
						</DialogTitle>
						<DialogDescription>
							<div>
								<div className="mt-2">
									<div className="flex flex-col gap-2 items-start justify-start">
										<h2 className="text-black font-bold my-1 dark:text-gray-300">
											Date
										</h2>
										<p className="flex justify-start gap-2 items-center">
											<CalendarIcon />
											{date ? format(date, 'PPP') : <span>Pick a date</span>}
										</p>
									</div>
									<Calendar
										mode="single"
										selected={date}
										onSelect={setDate}
										initialFocus
										className="ml-2"
									/>
								</div>
								<div className="mt-2 justify-center items-start flex gap-5 flex-col">
									<div className="mt-2">
										<Label className="text-md text-black font-bold my-1 dark:text-gray-300 ">
											Type
										</Label>

										<RadioGroup
											value={type}
											onValueChange={setType}
											className="mt-2"
										>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="income" id="income" />
												<Label htmlFor="income">Income</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="expense" id="expense" />
												<Label htmlFor="expense">Expense</Label>
											</div>
										</RadioGroup>
									</div>

									<div className="mt-2">
										<Label className="text-md text-black font-bold  dark:text-gray-300">
											Category
										</Label>
										<Input
											placeholder="Type Category"
											onChange={(e) => setCategory(e.target.value)}
											value={category}
											className="dark:bg-gray-700 dark:text-gray-200 bg-input"
										/>
										<Command className="bg-input border shadow-md md:min-w-[300px] h-[150px] overflow-y-hidden mt-1">
											<CommandInput placeholder="Type a command or search..." />
											<CommandList>
												<CommandEmpty>No results found.</CommandEmpty>
												<CommandGroup
													heading="Suggestions"
													className=" overflow-y-auto"
												>
													{filteredCategories.map((item, index) => (
														<CommandItem
															key={index}
															onSelect={() => setCategory(item)}
														>
															{item}
														</CommandItem>
													))}
												</CommandGroup>
											</CommandList>
										</Command>
									</div>
								</div>
								<div className="mt-2 justify-center items-start flex gap-5 flex-col">
									{' '}
									<div className="mt-2">
										<Label className="text-md text-black font-bold my-1 dark:text-gray-300">
											Name
										</Label>
										<Input
											placeholder="Dinning at..."
											onChange={(e) => setName(e.target.value)}
											value={name}
											className="dark:bg-gray-700 dark:text-gray-200 bg-input"
										/>
									</div>
									<div className="mt-2">
										<Label className="text-md text-black font-bold my-1 dark:text-gray-300">
											Amount
										</Label>
										<Input
											placeholder="e.g 5000"
											type="number"
											onChange={(e) => setAmount(e.target.value)}
											value={amount}
											className="dark:bg-gray-700 dark:text-gray-200 bg-input"
										/>
									</div>
								</div>
							</div>
						</DialogDescription>
						<DialogFooter className="sm:justify-start">
							<DialogClose asChild>
								<Button
									disabled={!(amount && category)}
									className="mt-5 w-full bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 capitalize"
									onClick={handleInputDetail}
								>
									{loading ? (
										<Loader className="animate-spin" />
									) : (
										`Add New ${type}`
									)}
								</Button>
							</DialogClose>
						</DialogFooter>
					</DialogHeader>
				</DialogContent>
			</Dialog>
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogTrigger asChild>
					<div className=" cursor-pointer w-full ">
						<button
							className="round w-full h-12 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-green-500 hover:via-blue-600 hover:to-purple-700 transition-all duration-300 truncate"
							onClick={() => setIsDialogOpen(true)}
							title="Upload CSV or JSON file" // Tooltip for full text
						>
							Upload
						</button>
					</div>
				</DialogTrigger>
				<DialogContent className="sm:max-w-sm bg-card">
					<DialogHeader>
						<DialogTitle className="font-bold text-lg text-gray-800 dark:text-gray-200">
							Upload Data
						</DialogTitle>
						<DialogDescription>
							<div className="mt-4">
								<label className="text-md text-black font-bold my-1 dark:text-gray-300">
									Select CSV or JSON File
								</label>
								<Input
									type="file"
									accept=".csv, .json"
									ref={fileInputRef}
									onChange={handleFileUpload}
									className="dark:bg-gray-700 dark:text-gray-200 mt-2"
									disabled={loading}
								/>
							</div>
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button
								className="mt-4 w-full bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700"
								disabled={loading}
							>
								{loading ? <Loader className="animate-spin" /> : 'Close'}
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default InputDetail;
