import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import { Loader } from 'lucide-react';
import moment from 'moment';
import {
	BarChart,
	Bar,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
} from 'recharts';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

const colors = scaleOrdinal(schemeCategory10).range();
const getPath = (x, y, width, height) => {
	return `M${x},${y + height} 
            C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} 
            ${x + width / 2}, ${y} 
            C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${
		y + height
	} 
            ${x + width}, ${y + height} Z`;
};

const TriangleBar = (props) => {
	const { fill, x, y, width, height } = props;
	return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

ChartJS.register(ArcElement, Tooltip, Legend);

function PiChart({ expensesList }) {
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [data, setData] = useState([]);

	// Detect dark or light mode
	useEffect(() => {
		const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
		setIsDarkMode(darkModeQuery.matches);

		darkModeQuery.addEventListener('change', (e) => {
			setIsDarkMode(e.matches);
		});
	}, []);

	useEffect(() => {
		if (expensesList.length > 0) {
			const groupedData = expensesList.reduce((acc, expense) => {
				const month = moment(expense.createdAt, 'DD/MM/YYYY').format('MMM'); // Get the month abbreviation
				if (!acc[month]) {
					acc[month] = 0;
				}
				acc[month] += Number(expense.amount);
				return acc;
			}, {});

			const transformedData = Object.keys(groupedData).map((month) => ({
				name: month,
				uv: groupedData[month],
			}));

			setData(transformedData);
		}
	}, [expensesList]);

	if (expensesList.length === 0) {
		return (
			<div>
				<Loader />
			</div>
		);
	}

	return (
		<ResponsiveContainer width="100%" height={400}>
			<BarChart
				data={data}
				margin={{
					top: 20,
					right: 30,
					left: 20,
					bottom: 5,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis />
				<Bar
					dataKey="uv"
					fill="#8884d8"
					shape={<TriangleBar />}
					label={{ position: 'top' }}
				>
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={colors[index % 20]} />
					))}
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
}

export default PiChart;
