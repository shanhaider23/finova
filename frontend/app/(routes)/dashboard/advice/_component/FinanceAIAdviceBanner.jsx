'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';

export default function FinanceAIAdviceBanner() {
    const [aiAdvice, setAiAdvice] = useState("");
    const { user } = useUser();

    useEffect(() => {
        if (!user?.primaryEmailAddress?.emailAddress) return;

        const dummyAdvice = "Try to save at least 20% of your income this month.";
        const email = user.primaryEmailAddress.emailAddress;

        const fetchAdvice = async () => {
            try {
                const cachedData = JSON.parse(localStorage.getItem('financial_advice'));
                const currentDate = new Date().toISOString().split('T')[0];

                if (cachedData && cachedData.date === currentDate) {
                    const advice = cachedData.advice?.[0]?.suggestion?.financial_advice?.[0]?.suggestion?.[0]?.description;
                    setAiAdvice(advice || dummyAdvice);
                    return;
                }

                const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
                const response = await axios.get(`${apiBaseUrl}/api/financial-advice/`, {
                    params: { email },
                });
                const advice = response.data.financial_advice?.[0]?.suggestion?.financial_advice?.[0]?.suggestion?.[0]?.description;
                setAiAdvice(advice || dummyAdvice);

                localStorage.setItem('financial_advice', JSON.stringify({
                    date: currentDate,
                    advice: response.data.financial_advice,
                }));
            } catch {
                setAiAdvice(dummyAdvice);
            }
        };

        fetchAdvice();
    }, [user]);

    if (!aiAdvice) return null;

    return (
        <div className="p-3 my-2 rounded flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <span className="text-blue-900 dark:text-blue-100 font-medium">{aiAdvice}</span>
        </div>
    );
}