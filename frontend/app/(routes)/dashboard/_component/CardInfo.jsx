import React from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import LoadingSkeleton from '@/app/_component/LoadingSkeleton';

function CardInfo({ data, name, color, loading }) {
	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white dark:bg-gray-800 p-3 shadow-md round border border-gray-200 dark:border-gray-600">
					<p className="text-gray-700 dark:text-gray-200 font-semibold">
						{label}
					</p>
					<p className="text-blue-500 dark:text-blue-400">
						Amount: {payload[0].value.toLocaleString()}
					</p>
				</div>
			);
		}
		return null;
	};

	if (loading) {
		return (
			<div className="bg-card h-full flex justify-center items-center p-5 rounded-lg shadow-md">
				<LoadingSkeleton height={200} />
			</div>
		);
	}

	return (
		<div className="bg-card h-full flex justify-around items-center flex-col p-5 rounded-lg shadow-md">
			<h2 className="text-xl font-semibold mb-2 text-center">
				{name}
			</h2>
			<ResponsiveContainer width="100%" height={220}>
				<LineChart data={data}>
					<XAxis dataKey="month" />
					<Tooltip content={<CustomTooltip />} /> {/* Custom Tooltip Added */}
					<Line
						type="monotone"
						dataKey="amount"
						stroke={color}
						strokeWidth={3}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}

export default CardInfo;