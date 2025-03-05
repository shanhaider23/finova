'use client';
import React from 'react';
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';

// 🔮 Actual + Forecasting Data
const data = [
	{
		month: 'Jan',
		income: 5000,
		expense: 3000,
		cashFlow: 2000,
		isForecast: false,
	},
	{
		month: 'Feb',
		income: 4800,
		expense: 3200,
		cashFlow: 1600,
		isForecast: false,
	},
	{
		month: 'Mar',
		income: 5100,
		expense: 2900,
		cashFlow: 2200,
		isForecast: false,
	},
	{
		month: 'Apr',
		income: 5200,
		expense: 3100,
		cashFlow: 2100,
		isForecast: false,
	},
	{
		month: 'May',
		income: 5300,
		expense: 3050,
		cashFlow: 2250,
		isForecast: false,
	},
	// Forecasted Data
	{
		month: 'Jun',
		income: 5600,
		expense: 3250,
		cashFlow: 2350,
		isForecast: true,
	},
	{
		month: 'Jul',
		income: 5700,
		expense: 3300,
		cashFlow: 2400,
		isForecast: true,
	},
	{
		month: 'Aug',
		income: 5900,
		expense: 3450,
		cashFlow: 2450,
		isForecast: true,
	},
];

export default function FinancialForecastCharts() {
	return (
		<div className="p-5 space-y-12">
			<h1 className="text-3xl font-bold text-center">
				🔮 Financial Forecasting Dashboard
			</h1>

			{/* Line Chart */}
			<div className="h-[400px]">
				<h2 className="text-xl font-semibold mb-3">
					📈 Income & Expense (Actual vs Forecast)
				</h2>
				<ResponsiveContainer>
					<LineChart data={data}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="month" />
						<YAxis />
						<Tooltip />
						<Legend />

						{/* Actual Data */}
						<Line
							type="monotone"
							dataKey="income"
							data={data.filter((item) => !item.isForecast)}
							stroke="#52c41a"
							strokeWidth={2}
							name="Actual Income"
						/>
						<Line
							type="monotone"
							dataKey="expense"
							data={data.filter((item) => !item.isForecast)}
							stroke="#ff4d4f"
							strokeWidth={2}
							name="Actual Expense"
						/>

						{/* Forecasted Data */}
						<Line
							type="monotone"
							dataKey="income"
							data={data.filter((item) => item.isForecast)}
							stroke="#52c41a"
							strokeWidth={2}
							strokeDasharray="5 5"
							name="Forecasted Income"
						/>
						<Line
							type="monotone"
							dataKey="expense"
							data={data.filter((item) => item.isForecast)}
							stroke="#ff4d4f"
							strokeWidth={2}
							strokeDasharray="5 5"
							name="Forecasted Expense"
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>

			{/* Bar Chart */}
			<div className="h-[400px]">
				<h2 className="text-xl font-semibold mb-3">
					📊 Income vs Expense (Including Forecast)
				</h2>
				<ResponsiveContainer>
					<BarChart data={data}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="month" />
						<YAxis />
						<Tooltip />
						<Legend />
						<Bar dataKey="income" fill="#52c41a" name="Income" />
						<Bar dataKey="expense" fill="#ff4d4f" name="Expense" />
					</BarChart>
				</ResponsiveContainer>
			</div>

			{/* Area Chart */}
			<div className="h-[400px]">
				<h2 className="text-xl font-semibold mb-3">
					🌊 Cash Flow (Actual vs Forecast)
				</h2>
				<ResponsiveContainer>
					<AreaChart data={data}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="month" />
						<YAxis />
						<Tooltip />
						<Legend />
						<Area
							type="monotone"
							dataKey="cashFlow"
							stroke="#1890ff"
							fill="#1890ff"
							name="Cash Flow"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
