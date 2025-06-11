'use client';
import React, { useState, useEffect } from 'react';
import {
    Bar,
    BarChart,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

function BarChartAnnual({ data }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
    }, []);

    const budgetBarColor = isDarkMode ? '#3ABE34' : '#66FFCA';
    const spendBarColor = isDarkMode ? '#F84233' : '#58D1FF';
    const overBarColor = '#FF0000';



    return (
        <div className="shadow-lg bg-card h-full hover:shadow-xl p-5">
            <ResponsiveContainer width={'100%'} height={300}>
                <ResponsiveContainer width={'100%'} height={300}>
                    <BarChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 5,
                            left: 5,
                            bottom: 60,
                        }}
                        barCategoryGap="20%"
                    >
                        <XAxis
                            dataKey="category" // <-- Fix here
                            stroke={isDarkMode ? '#ddd' : '#8884d8'}
                            interval={0}
                            textAnchor="end"
                            angle={-25}
                        />
                        <YAxis
                            stroke={isDarkMode ? '#ddd' : '#8884d8'}
                            unit="%"
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: isDarkMode ? '#222' : '#fff',
                                color: isDarkMode ? '#fff' : '#222',
                                borderRadius: '8px',
                                border: 'none'
                            }}
                        />
                        <Legend
                            wrapperStyle={{ color: isDarkMode ? '#ddd' : '#8884d8' }}
                            layout="horizontal"
                            verticalAlign="top"
                            align="center"
                        />
                        <Bar dataKey="percent" fill={spendBarColor} name="Yearly percentage" />
                    </BarChart>
                </ResponsiveContainer>
            </ResponsiveContainer>
        </div>
    );
}

export default BarChartAnnual;
