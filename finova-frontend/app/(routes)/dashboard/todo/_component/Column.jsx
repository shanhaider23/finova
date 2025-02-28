// Column.js

import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import { Trash, CalendarDays } from 'lucide-react'; // Correctly import CalendarDays
import { deleteTasks } from '@/redux/slices/todoSlice';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';

export default function Column({ column, tasks, refreshData }) {
	const dispatch = useDispatch();
	const { setNodeRef } = useDroppable({ id: column.id });
	const handleDelete = async (task) => {
		const confirmDelete = window.confirm(
			`Are you sure you want to delete "${task.title}"?`
		);
		if (!confirmDelete) return;

		await dispatch(deleteTasks({ taskId: task.id }));

		refreshData(); // Refresh tasks after deletion
	};

	return (
		<div className="flex flex-col shadow-lg bg-card p-4">
			<h1 className="mb-4 font-bold text-xl text-center">{column.title}</h1>
			<div ref={setNodeRef} className="flex flex-1 flex-col gap-4">
				{tasks.map((task) => (
					<div
						key={task.id}
						className="cursor-grab rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg p-4 transition-all flex flex-col"
					>
						<TaskCard key={task.id} task={task} refreshData={refreshData} />
						<button
							className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 transition self-end"
							onClick={() => handleDelete(task)} // Pass event to stop drag
						>
							<Trash size={18} />
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
