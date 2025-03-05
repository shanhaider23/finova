import { useDraggable } from '@dnd-kit/core';
import { CalendarDays } from 'lucide-react';

export default function TaskCard({ task }) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: task.id,
	});

	const style = transform
		? { transform: `translate(${transform.x}px, ${transform.y}px)` }
		: undefined;

	return (
		<div ref={setNodeRef} {...listeners} {...attributes} style={style}>
			{/* Title Section */}
			<h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
				{task.title}
			</h1>

			{/* Due Date Section */}
			<div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-2">
				<CalendarDays className="w-4 h-4 mr-2 text-blue-500" />
				<p>Due Date: {new Date(task.date).toLocaleDateString()}</p>
			</div>

			{/* Description */}
			<p className="text-gray-700 dark:text-gray-400 text-sm">
				{task.description || 'No additional details provided.'}
			</p>
		</div>
	);
}
