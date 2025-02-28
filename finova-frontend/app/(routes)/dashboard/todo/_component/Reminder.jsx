'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTask, deleteTasks } from '@/redux/slices/todoSlice';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { CheckCircle, Trash } from 'lucide-react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function ReminderBoard() {
	const dispatch = useDispatch();
	const { user } = useUser();
	const { list: tasks, loading, error } = useSelector((state) => state.tasks);
	const [selectedDate, setSelectedDate] = useState(new Date());

	useEffect(() => {
		if (user?.primaryEmailAddress?.emailAddress) {
			dispatch(fetchTasks(user.primaryEmailAddress.emailAddress));
		}
	}, [dispatch, user]);

	const handleMarkComplete = async (task) => {
		await dispatch(updateTask({ id: task.id, status: 'done' }));
		toast.success(`Task "${task.title}" marked as completed!`);
	};

	const handleDelete = async (task) => {
		const confirmDelete = window.confirm(
			`Are you sure you want to delete "${task.title}"?`
		);
		if (!confirmDelete) return;

		await dispatch(deleteTasks({ taskId: task.id }));
		toast.success('Task deleted successfully.');
	};

	const myEventsList = tasks.map((task) => ({
		id: task.id,
		title: task.title,
		start: new Date(task.date),
		end: new Date(task.date),
	}));

	return (
		<div className="flex flex-col lg:flex-row gap-5 p-5 bg-card shadow-lg">
			{/* Left side: Task List for selected date */}
			<div className="w-full lg:w-1/3">
				<h1 className="text-xl font-bold mb-4">
					Reminders for {format(selectedDate, 'PPP')}
				</h1>

				{tasks
					.filter(
						(task) =>
							format(new Date(task.date), 'PPP') === format(selectedDate, 'PPP')
					)
					.map((task) => (
						<div
							key={task.id}
							className="flex items-center justify-between p-3 border rounded-lg shadow-sm mb-2"
						>
							<span>{task.title}</span>
							<div className="flex gap-2">
								<button onClick={() => handleMarkComplete(task)}>
									<CheckCircle className="text-green-500 hover:text-green-700" />
								</button>
								<button onClick={() => handleDelete(task)}>
									<Trash className="text-red-500 hover:text-red-700" />
								</button>
							</div>
						</div>
					))}
			</div>

			{/* Right side: Calendar */}
			<div className="w-full lg:w-2/3">
				<Calendar
					localizer={localizer}
					events={myEventsList}
					startAccessor="start"
					endAccessor="end"
					style={{ height: 500 }}
					onSelectEvent={(event) => setSelectedDate(event.start)}
					views={['month', 'week', 'day']}
					defaultView="month"
					toolbar={true}
					popup={true}
					onNavigate={(date) => setSelectedDate(date)} // Ensure calendar updates when date is navigated
					date={selectedDate} // Pass the selectedDate to the Calendar component
				/>
			</div>
		</div>
	);
}
