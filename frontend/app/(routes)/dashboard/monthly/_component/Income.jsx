'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	fetchMonthly,
	deleteMonthly,
	updateMonthly,
} from '@/redux/slices/monthlySlice';
import { useUser } from '@clerk/nextjs';
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Tooltip,
	Legend,
} from 'recharts';
import { Loader, Trash2, PenBox, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

function MonthlyIncome({ month, year }) {
	const dispatch = useDispatch();
	const [editId, setEditId] = useState(null);
	const [editValues, setEditValues] = useState({
		category: '',
		amount: '',
		name: '',
	});
	const { user } = useUser();

	const {
		list: monthlyList,
		loading,
		error,
	} = useSelector((state) => state.monthly);

	useEffect(() => {
		if (user?.primaryEmailAddress?.emailAddress) {
			dispatch(fetchMonthly(user.primaryEmailAddress.emailAddress));
		}
	}, [dispatch, user, month]);

	const filteredList = monthlyList.filter((item) => {
		const itemMonth = new Date(item.date)
			.toLocaleString('default', { month: 'long' })
			.toLowerCase();
		const itemYear = new Date(item.date).getFullYear().toString();
		return (
			item.type === 'income' &&
			(!month || itemMonth === month) &&
			(!year || itemYear === year)
		);
	});

	const incomeData = filteredList.map((item) => ({
		name: item.name,
		value: parseFloat(item.amount),
	}));
	const handleEdit = (item) => {
		setEditId(item.id);
		setEditValues({
			category: item.category,
			amount: item.amount,
			name: item.name,
		});
	};

	const handleUpdate = async (id) => {
		const email = user?.primaryEmailAddress?.emailAddress;

		await dispatch(
			updateMonthly({
				id,
				category: editValues.category,
				amount: editValues.amount,
				name: editValues.name,
			})
		);

		// Re-fetch the updated data
		await dispatch(fetchMonthly(email));

		setEditId(null);
	};

	const handleCancel = () => {
		setEditId(null);
	};

	const handleDelete = async (id) => {
		const email = user?.primaryEmailAddress?.emailAddress;

		if (window.confirm('Are you sure you want to delete this record?')) {
			await dispatch(deleteMonthly({ monthlyId: id }));

			// Re-fetch the updated data
			await dispatch(fetchMonthly(email));
		}
	};
	const COLORS = [
		'#0088FE',
		'#00C49F',
		'#FFBB28',
		'#FF8042',
		'#FF5733',
		'#C70039',
	];

	return (
		<div className=" w-full p-5 shadow-lg bg-card">
			<div className="grid grid-cols-1 gap-5">
				<div className="flex flex-col justify-center items-stretch gap-5">
					<div>
						<div className="w-full text-left border-collapse">
							<div className=" flex justify-center items-center text-2xl ">
								<h1>Income</h1>
							</div>
							<div>
								<ResponsiveContainer width="100%" height={400}>
									<PieChart>
										<Pie
											data={incomeData}
											cx="50%"
											cy="50%"
											labelLine={false}
											outerRadius={100}
											fill="#8884d8"
											dataKey="value"
											label={({ name, value }) => `${name}: ${value}`}
										>
											{incomeData.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={COLORS[index % COLORS.length]}
												/>
											))}
										</Pie>
										<Tooltip />
									</PieChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>
					<div className="bg-white dark:bg-gray-800 round shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
						<div className="overflow-x-auto">
							{loading ? (
								<div className="flex justify-center items-center p-10">
									<Loader className="animate-spin" size={50} />
								</div>
							) : filteredList.length > 0 ? (
								<table className="w-full text-center border border-gray-200 dark:border-gray-700">
									<thead>
										<tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
											<th className="p-2 font-semibold min-w-[80px]">Edit</th>
											<th className="p-2 font-semibold min-w-[100px] text-center">
												Category
											</th>
											<th className="p-2 font-semibold min-w-[100px]">Name</th>
											<th className="p-2 font-semibold min-w-[100px]">
												Amount
											</th>
											<th className="p-2 font-semibold min-w-[80px]">Delete</th>
										</tr>
									</thead>
									<tbody>
										{filteredList.map((item, index) => (
											<tr
												key={item.id}
												className="border border-gray-200 dark:border-gray-700 last:border-none hover:bg-gray-100 dark:hover:bg-gray-600 transition"
											>
												<td className="p-3 text-gray-800 dark:text-gray-200 text-center border border-gray-200 dark:border-gray-700">
													<button
														onClick={() => handleEdit(item)}
														className="bg-transparent"
													>
														<PenBox
															size={15}
															strokeWidth={2.75}
															className="text-blue-500"
														/>
													</button>
												</td>
												{editId === item.id ? (
													<td className="p-3 text-gray-800 dark:text-gray-200 text-center border border-gray-200 dark:border-gray-700">
														<div className="flex justify-center items-center">
															<Input
																type="text"
																value={editValues.category}
																onChange={(e) =>
																	setEditValues({
																		...editValues,
																		category: e.target.value,
																	})
																}
															/>
															<div>
																<button onClick={() => handleUpdate(item.id)}>
																	<Check size={15} />
																</button>
																<button onClick={handleCancel}>
																	<X size={15} />
																</button>
															</div>
														</div>
													</td>
												) : (
													<td className="p-3 text-gray-800 dark:text-gray-200 text-center border border-gray-200 dark:border-gray-700">
														{item.category}
													</td>
												)}
												{editId === item.id ? (
													<td className="p-3 text-gray-800 dark:text-gray-200 text-center border border-gray-200 dark:border-gray-700">
														<div className="flex justify-center items-center">
															<Input
																type="text"
																value={editValues.name}
																onChange={(e) =>
																	setEditValues({
																		...editValues,
																		name: e.target.value,
																	})
																}
															/>
															<div>
																<button onClick={() => handleUpdate(item.id)}>
																	<Check size={15} />
																</button>
																<button onClick={handleCancel}>
																	<X size={15} />
																</button>
															</div>
														</div>
													</td>
												) : (
													<td className="p-3 text-gray-800 dark:text-gray-200 text-center border border-gray-200 dark:border-gray-700">
														{item.name}
													</td>
												)}
												{editId === item.id ? (
													<td className="p-3 text-gray-800 dark:text-gray-200 text-center border border-gray-200 dark:border-gray-700">
														<div className="flex justify-center items-center">
															<Input
																type="number"
																value={editValues.amount}
																onChange={(e) =>
																	setEditValues({
																		...editValues,
																		amount: e.target.value,
																	})
																}
															/>
															<div>
																<div>
																	<button onClick={() => handleUpdate(item.id)}>
																		<Check size={15} />
																	</button>
																	<button onClick={handleCancel}>
																		<X size={15} />
																	</button>
																</div>
															</div>
														</div>
													</td>
												) : (
													<td className="p-3 text-gray-800 dark:text-gray-200 text-center border border-gray-200 dark:border-gray-700">
														<p
															style={{
																color: COLORS[index % COLORS.length],
															}}
														>
															{item.amount}
														</p>
													</td>
												)}

												<td className="p-3 text-gray-800 dark:text-gray-200 text-center border border-gray-200 dark:border-gray-700">
													<button
														onClick={() => handleDelete(item.id)}
														className="bg-transparent "
													>
														<Trash2
															size={15}
															strokeWidth={2.75}
															className="text-red-500"
														/>
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							) : (
								<div className="text-center p-10 text-gray-500 dark:text-gray-400">
									No records available
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MonthlyIncome;
