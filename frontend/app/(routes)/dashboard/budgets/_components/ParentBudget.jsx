'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchParentBudgets,
    createParentBudget,
    deleteParentBudget,
} from '@/redux/slices/budgetSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { fetchBudgets } from '@/redux/slices/budgetSlice';
import { fetchExpenses } from '@/redux/slices/expenseSlice';
import BudgetItem from './BudgetItem';
import { Trash } from 'lucide-react';
import CreateBudget from './CreateBudget';
import BarChartDashboard from '../../_component/BarChart';
import { PlusCircle } from 'lucide-react';

function ParentBudget() {
    const dispatch = useDispatch();
    const { parentBudgets, parentBudgetsLoading, list: allBudgets } = useSelector((state) => state.budgets);
    const { list: expensesList } = useSelector((state) => state.expenses);
    const { list: budgetList, loading } = useSelector((state) => state.budgets);
    const { user } = useUser();
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('');

    useEffect(() => {
        if (user?.primaryEmailAddress?.emailAddress) {
            dispatch(fetchParentBudgets(user.primaryEmailAddress.emailAddress));
            dispatch(fetchBudgets(user.primaryEmailAddress.emailAddress));
            dispatch(fetchExpenses(user.primaryEmailAddress.emailAddress));
        }
    }, [user, dispatch]);

    const handleAdd = () => {
        if (!name || !amount) return;
        dispatch(
            createParentBudget({
                name,
                amount,
                currency,
                email: user.primaryEmailAddress.emailAddress,
            })
        );
        setName('');
        setAmount('');
    };
    const getChildren = (parentId) =>
        allBudgets.filter(b => b.parent === parentId);

    // Helper to calculate spend for a budget
    const getBudgetSpend = (budgetId) =>
        (expensesList || [])
            .filter(exp => exp.budget === budgetId)
            .reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
    const handleDelete = (id) => {
        dispatch(deleteParentBudget(id));
    };
    const getChildrenTotals = (parentId) => {
        const children = getChildren(parentId);
        let totalSpend = 0;
        let totalAmount = 0;
        let currency = '';
        children.forEach(child => {
            totalSpend += getBudgetSpend(child.id);
            totalAmount += Number(child.amount);
            currency = child.currency || currency;
        });
        return { totalSpend, totalAmount, currency };
    };

    return (
        <div >
            <div className='pl-4'>
                <h2 className="font-bold text-xl mb-4">Budgets</h2>
                <div className="flex flex-col gap-3 mb-6 p-6 bg-gradient-to-r from-blue-50 via-blue-100 to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-xl shadow-lg border border-blue-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-blue-700 dark:text-blue-200 mb-2 tracking-wide">
                        Create New Budget
                    </h2>
                    <div className="flex flex-wrap gap-3 items-end">
                        <Input
                            placeholder="Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-44 bg-white dark:bg-gray-800 dark:text-gray-200 border border-blue-200 dark:border-gray-700 shadow-sm"
                        />
                        <Input
                            placeholder="Amount"
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="w-32 bg-white dark:bg-gray-800 dark:text-gray-200 border border-blue-200 dark:border-gray-700 shadow-sm"
                        />
                        <Input
                            placeholder="Currency"
                            value={currency}
                            onChange={e => setCurrency(e.target.value)}
                            className="w-28 bg-white dark:bg-gray-800 dark:text-gray-200 border border-blue-200 dark:border-gray-700 shadow-sm"
                        />
                        <Button
                            onClick={handleAdd}
                            disabled={parentBudgetsLoading || !name || !amount}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow hover:from-green-500 hover:via-blue-600 hover:to-purple-700 transition-all duration-300"
                        >
                            {parentBudgetsLoading ? (
                                <Loader className="animate-spin" />
                            ) : (
                                <>
                                    <PlusCircle className="w-5 h-5" />
                                    Add
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
            <div className="ml-4 " >
                {parentBudgetsLoading ? (
                    <Loader className="animate-spin mx-auto" />
                ) : parentBudgets.length === 0 ? (
                    <p className="text-gray-500">No parent budgets found.</p>
                ) : (
                    <ul className="flex flex-col gap-4">
                        {parentBudgets.map((pb) => {
                            const { totalSpend, totalAmount, currency } = getChildrenTotals(pb.id);
                            const parentProgress = totalAmount > 0 ? Math.min((totalSpend / totalAmount) * 100, 100) : 0;
                            return (
                                <li key={pb.id} className="mb-6 bg-card p-4  rounded shadow">
                                    <h1 className='font-bold text-xl'>{pb.name}</h1>
                                    <div className="flex items-center justify-between border-b py-2">


                                        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">{pb.amount} {pb.currency}</h2>

                                        <button className="bg-red-500 flex gap-2 p-2 rounded" variant="destructive" onClick={() => handleDelete(pb.id)}>
                                            <Trash />
                                            Delete
                                        </button>
                                    </div>
                                    {/* Parent total spent/remaining for all children */}
                                    <div className="w-full mb-2 mt-2">
                                        <div className="text-gray-800 font-semibold flex items-center justify-between dark:text-gray-200">
                                            <p className="text-xl text-gray-500 dark:text-gray-400 flex items-center gap-1 flex-wrap">
                                                Spent:
                                                <span>
                                                    {totalSpend} {currency}
                                                </span>
                                            </p>
                                            <p className="text-xl text-gray-500 dark:text-gray-400 flex items-center gap-1 flex-wrap">
                                                Remaining:
                                                <span>
                                                    {totalAmount - totalSpend} {currency}
                                                </span>
                                            </p>
                                        </div>
                                        {/* Parent progress bar */}
                                        <div>
                                            <div className="relative h-3 rounded-full bg-gray-200 dark:bg-gray-600 mt-2">
                                                <div
                                                    className="absolute top-0 left-0 h-3 rounded-full bg-green-500 transition-all"
                                                    style={{ width: `${parentProgress}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1 text-center dark:text-gray-300">
                                                {parentProgress.toFixed(0)}% used
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        {/* Pass only child budgets for this parent */}
                                        <BarChartDashboard budgetList={getChildren(pb.id)} />
                                    </div>
                                    <div>
                                        <CreateBudget parentId={pb.id} />
                                    </div>
                                    {/* Child Budgets */}
                                    <div className="">
                                        {getChildren(pb.id).length === 0 ? (
                                            <p className="text-gray-400 text-sm mt-2">No child budgets.</p>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                                                {getChildren(pb.id).map(child => (
                                                    <BudgetItem
                                                        key={child.id}
                                                        budget={child}
                                                        expensesList={expensesList}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default ParentBudget;