'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTask } from '@/redux/slices/todoSlice';
import Column from './Column';
import AddTodo from './AddTodo';
import { useUser } from '@clerk/nextjs';
import Reminder from './Reminder';
import '../../../../_styles/calender.css';

const COLUMNS = [{ id: 'done', title: 'Done' }];

export default function TodoBoard() {
	const dispatch = useDispatch();
	const { user } = useUser();
	const [refreshKey, setRefreshKey] = useState(0);
	const { list: tasks, loading, error } = useSelector((state) => state.tasks);

	useEffect(() => {
		if (user?.primaryEmailAddress?.emailAddress) {
			dispatch(fetchTasks(user.primaryEmailAddress.emailAddress));
		}
	}, [dispatch, user]);
	const refreshData = () => {
		dispatch(fetchTasks());
		setRefreshKey((prevKey) => prevKey + 1);
	};
	function handleDragEnd(event) {
		const { active, over } = event;
		if (!over) return;

		const taskId = active.id;
		const newStatus = over.id;

		dispatch(updateTask({ id: taskId, status: newStatus }));
	}

	return (
		<div className="w-full pl-5 pr-5">
			<div className="w-full flex justify-end items-center pb-5">
				<AddTodo refreshData={refreshData} />
			</div>

			<div className="flex flex-wrap md:flex-nowrap items-stretch justify-center gap-5 ">
				<div className="flex-grow">
					<Reminder />
				</div>
				<div className="h-full w-full sm:min-w-[300px] sm:max-w-[350px]">
					{COLUMNS.map((column) => (
						<Column
							key={column.id}
							column={column}
							refreshData={refreshData}
							tasks={tasks.filter((task) => task.status === column.id)}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
