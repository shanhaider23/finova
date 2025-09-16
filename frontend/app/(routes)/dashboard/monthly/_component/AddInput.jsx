'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { addMonthly } from '@/redux/slices/monthlySlice';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import { PlusCircle } from 'lucide-react';
function QuickCategoryInput({ category, type = "expense" }) {
    const [amount, setAmount] = useState('');
    const [cumulative, setCumulative] = useState(0);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { user } = useUser();

    const handleAdd = async () => {
        if (!amount) {
            toast.error('Please enter an amount.');
            return;
        }
        setLoading(true);
        const email = user?.primaryEmailAddress?.emailAddress;
        await dispatch(addMonthly({
            date: new Date().toISOString(),
            type,
            name: category,
            category,
            amount: Number(amount), // Only add the new amount
            email
        }));
        toast.success('Amount added!');
        setCumulative(cumulative + Number(amount)); // Update local total
        setAmount('');
        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAdd();
        }
    };

    return (
        <div className="flex items-center gap-4 my-2">
            <div className="min-w-[80px] w-[80px] font-semibold text-gray-700 dark:text-gray-200">{category}</div>
            <Input
                type="number"

                value={amount}
                onChange={e => setAmount(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-20 dark:bg-gray-700 dark:text-gray-200 bg-input"
                disabled={loading}
            />
            <Button
                onClick={handleAdd}
                disabled={loading || !amount}
                className="ml-2 p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                size="icon"
            >
                <PlusCircle size={20} />
            </Button>
            <span className="text-xs text-gray-500 ml-2">Total: {cumulative}</span>
        </div>
    );
}

export default QuickCategoryInput;