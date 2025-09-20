'use client';
import React, { useMemo, useState, useEffect } from 'react';
import BarChartAnnual from './BarChartAnnual';
import LoadingSkeleton from '@/app/_component/LoadingSkeleton';

function formatCurrency(amount) {
    return `${amount.toLocaleString()}`;
}

function getMonthName(monthIdx) {
    return [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ][monthIdx];
}

function AnnualReport({ monthlyList, loading }) {
    monthlyList = monthlyList || [];


    // Get all years in the data
    const years = Array.from(new Set(monthlyList.map(item => new Date(item.date).getFullYear())));
    const [selectedYear, setSelectedYear] = useState(years[0]);
    useEffect(() => {
        if (years.length > 0 && !years.includes(selectedYear)) {
            setSelectedYear(years[0]);
        }
    }, [years.join(','), selectedYear]);




    // Process data for the selected year
    const {
        months,
        categories,
        categoryMonthTotals,
        categoryTotals,
        monthIncomes,
        totalIncome,
        totalExpense,
        categoryPercentData,
        savings
    } = useMemo(() => {
        // Filter data for the selected year
        const yearData = monthlyList.filter(item => new Date(item.date).getFullYear() === selectedYear);

        // Get all months present in the year
        const monthsSet = new Set(yearData.map(item => new Date(item.date).getMonth()));
        const months = Array.from(monthsSet).sort((a, b) => a - b);

        // Get all categories (expenses only)
        const categoriesSet = new Set(yearData.filter(i => i.type === 'expense').map(i => i.category));
        const categories = Array.from(categoriesSet);

        // Calculate total income per month
        const monthIncomes = {};
        months.forEach(m => {
            monthIncomes[m] = yearData
                .filter(i => i.type === 'income' && new Date(i.date).getMonth() === m)
                .reduce((sum, i) => sum + i.amount, 0);
        });

        // Aggregate expenses by category and month
        const categoryMonthTotals = {};
        categories.forEach(cat => {
            categoryMonthTotals[cat] = {};
            months.forEach(m => {
                categoryMonthTotals[cat][m] = yearData
                    .filter(i => i.type === 'expense' && i.category === cat && new Date(i.date).getMonth() === m)
                    .reduce((sum, i) => sum + i.amount, 0);
            });
        });

        // Totals per category for the year
        const categoryTotals = {};
        categories.forEach(cat => {
            categoryTotals[cat] = Object.values(categoryMonthTotals[cat]).reduce((a, b) => a + b, 0);
        });

        // Total income and expense for the year
        const totalIncome = yearData.filter(i => i.type === 'income').reduce((sum, i) => sum + i.amount, 0);
        const totalExpense = yearData.filter(i => i.type === 'expense').reduce((sum, i) => sum + i.amount, 0);
        const savings = totalIncome - totalExpense;
        const categoryPercentData = categories.map(cat => ({
            category: cat,
            percent: totalIncome ? Math.round((categoryTotals[cat] / totalIncome) * 100) : 0,
        }));

        return {
            months,
            categories,
            categoryMonthTotals,
            categoryTotals,
            monthIncomes,
            totalIncome,
            totalExpense,
            categoryPercentData,
            savings
        };
    }, [monthlyList, selectedYear]);

    if (loading) {
        return (
            <div className="bg-card h-full flex justify-center items-center p-5 rounded-lg shadow-md">
                <LoadingSkeleton height={200} />
            </div>
        );
    }

    return (
        <div className=" shadow-lg overflow-hidden bg-card  mb-4 ">
            <h1 className="text-2xl font-bold p-4">Annual Insights</h1>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between p-4 gap-2">
                <div >
                    <label htmlFor="year-select" className="mr-2 font-semibold">Year:</label>
                    <select
                        id="year-select"
                        value={selectedYear}
                        onChange={e => setSelectedYear(Number(e.target.value))}
                        className="border rounded px-2 py-1 bg-card"
                    >
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                    <span className='text-green-500'>Income: <b>{formatCurrency(totalIncome)}</b></span>
                    <span className='text-red-500'>Expense: <b>{formatCurrency(totalExpense)}</b></span>
                    <span className='text-blue-500'>Savings: <b>{formatCurrency(savings)}</b></span>
                </div>
            </div>
            <div>
                <BarChartAnnual data={categoryPercentData} loading={loading} />
            </div>
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                            <th className="p-3 font-semibold min-w-[150px]">Category</th>
                            {months.map(m => (
                                <th key={m} className="p-3 font-semibold min-w-[80px]">{getMonthName(m)}</th>
                            ))}
                            <th className="p-3 font-semibold min-w-[50px]">Total</th>
                            <th className="p-3 font-semibold min-w-[80px]">Year %</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat} className="border-b last:border-none hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                <td className="p-3 text-gray-800 dark:text-gray-200">{cat}</td>
                                {months.map(m => {
                                    const val = categoryMonthTotals[cat][m] || 0;
                                    const monthIncome = monthIncomes[m] || 0;
                                    const percent = monthIncome ? Math.round((val / monthIncome) * 100) : 0;
                                    return (
                                        <td key={m} className="p-3 text-gray-800 dark:text-gray-200">
                                            {val > 0
                                                ? `${formatCurrency(val)} / ${percent}%`
                                                : '-'}
                                        </td>
                                    );
                                })}
                                <td className="p-3 text-gray-800 dark:text-gray-200">{formatCurrency(categoryTotals[cat])}</td>
                                <td className="p-3 text-gray-800 dark:text-gray-200">
                                    {totalIncome ? Math.round((categoryTotals[cat] / totalIncome) * 100) : 0}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Download as CSV */}
            <div className="mt-4 flex justify-center p-4">
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => {
                        // CSV export logic
                        const csvRows = [];
                        const header = ['Category', ...months.map(getMonthName), 'Total', 'Year %'];
                        csvRows.push(header.join(','));
                        categories.forEach(cat => {
                            const row = [
                                cat,
                                ...months.map(m => {
                                    const val = categoryMonthTotals[cat][m] || 0;
                                    const monthIncome = monthIncomes[m] || 0;
                                    const percent = monthIncome ? Math.round((val / monthIncome) * 100) : 0;
                                    return val > 0 ? `${val} / ${percent}%` : '-';
                                }),
                                categoryTotals[cat],
                                totalIncome ? Math.round((categoryTotals[cat] / totalIncome) * 100) : 0
                            ];
                            csvRows.push(row.join(','));
                        });
                        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", `annual_report_${selectedYear}.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }}
                >
                    Download as CSV
                </button>
            </div>
        </div>
    );
}

export default AnnualReport;