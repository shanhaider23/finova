'use client';
import React, { useEffect, useState } from 'react';
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

export function LineCharts({ currenciesHistory }) {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (currenciesHistory && currenciesHistory.length > 0) {
			setIsLoading(false);
		}
	}, [currenciesHistory]);

	return (
		<div className="p-4 shadow-lg bg-card mt-5">
			<h1 className="mb-5 text-2xl">Last five years history</h1>

			{isLoading ? (
				<p>Loading chart data...</p>
			) : (
				<ResponsiveContainer width="100%" height={400}>
					<LineChart
						width={500}
						height={300}
						data={currenciesHistory}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" />
						<YAxis />
						<Tooltip />
						<Legend />
						{/* Lines for different currencies */}
						<Line
							type="monotone"
							dataKey="PKR"
							stroke="#008000"
							activeDot={{ r: 8 }}
						/>
						<Line type="monotone" dataKey="USD" stroke="#3c3b6e" />
						<Line type="monotone" dataKey="EUR" stroke="#0033a0" />
						<Line type="monotone" dataKey="GBP" stroke="#003478" />
						<Line type="monotone" dataKey="INR" stroke="#ff9933" />
						<Line type="monotone" dataKey="CAD" stroke="#ff0000" />
						<Line type="monotone" dataKey="TRY" stroke="#E30A17" />
						<Line type="monotone" dataKey="SAR" stroke="#006c2b" />
					</LineChart>
				</ResponsiveContainer>
			)}
		</div>
	);
}
