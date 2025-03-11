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

const Charts = ({ headline, data, chartType }) => {
    return (
        <div className="h-[400px]">
            <h2 className="text-xl font-semibold mb-3">{headline}</h2>
            <ResponsiveContainer>
                {chartType === 'line' && (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="income" stroke="#52c41a" strokeWidth={2} name="Income" />
                        <Line type="monotone" dataKey="expense" stroke="#ff4d4f" strokeWidth={2} name="Expense" />
                    </LineChart>
                )}
                {chartType === 'bar' && (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="income" fill="#52c41a" name="Income" />
                        <Bar dataKey="expense" fill="#ff4d4f" name="Expense" />
                    </BarChart>
                )}
                {chartType === 'area' && (
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="cashFlow" stroke="#1890ff" fill="#1890ff" name="Cash Flow" />
                    </AreaChart>
                )}
            </ResponsiveContainer>
        </div>
    );
};

export default Charts;