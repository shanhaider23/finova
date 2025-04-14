'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs'; // Import Clerk's useUser hook



export default function FinanceAIBot() {
	const [financialAdvice, setFinancialAdvice] = useState([]); // Store financial advice
	const [isLoading, setIsLoading] = useState(true); // Track loading state

	const { user } = useUser();
	// Dummy response to show in case of API failure
	const dummyResponse = [
		{
			month: new Date().toISOString(),
			suggestion: {
				financial_advice: [
					{
						suggestion: [
							{ title: "Save More", description: "Try to save at least 20% of your income this month." },
							{ title: "Invest Wisely", description: "Consider investing in low-risk mutual funds." },
							{ title: "Track Expenses", description: "Keep a close eye on your daily expenses." },
						],
					},
				],
			},
		},
	];

	// Fetch financial advice from the backend
	useEffect(() => {
		const email = user.primaryEmailAddress.emailAddress;
		const fetchFinancialAdvice = async () => {
			try {
				setIsLoading(true); // Start loading

				// Check if cached data exists
				const cachedData = JSON.parse(localStorage.getItem('financial_advice'));
				const currentDate = new Date().toISOString().split('T')[0]; // Get today's date (YYYY-MM-DD)

				if (cachedData && cachedData.date === currentDate) {
					// If cached data is available and it's from today, use it
					setFinancialAdvice(cachedData.advice);
					setIsLoading(false);
					return;
				}

				// Use the API base URL from environment variables
				const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
				const response = await axios.get(`${apiBaseUrl}/api/financial-advice/`, {
					params: { email },
				});


				// Cache the data with the current date
				localStorage.setItem('financial_advice', JSON.stringify({
					date: currentDate,
					advice: response.data.financial_advice,
				}));

				setFinancialAdvice(response.data.financial_advice); // Set the financial advice
			} catch (err) {
				console.error("API error:", err.message);

				// Simulate a delay and show dummy response
				setTimeout(() => {

					setFinancialAdvice(dummyResponse);
				}, 1000); // Delay of 2 seconds
			} finally {
				setIsLoading(false); // Stop loading
			}
		};

		fetchFinancialAdvice();
	}, []); // Empty dependency array to fetch data on mount

	return (
		<div className="p-5 w-full h-full">
			<h2 className="mb-5 text-2xl font-bold text-center">💬 Finance Advice</h2>

			{/* Show loading state */}
			{isLoading && (
				<div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-xl text-center">
					<span>Loading financial advice...</span>
				</div>
			)}

			{/* Show financial advice */}
			{!isLoading && financialAdvice.length > 0 && (
				<div className="space-y-4">
					{financialAdvice.map((monthAdvice, index) => (
						<div key={index} className="p-4 bg-gray-200 dark:bg-gray-700 rounded-xl">
							<h3 className="text-lg font-bold mb-2">
								📅 Advice for {new Date(monthAdvice.month).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
								})}
							</h3>
							<ul className="space-y-2">
								{monthAdvice.suggestion.financial_advice[0].suggestion.map((item, idx) => (
									<li key={idx} className="p-2 bg-white dark:bg-gray-800 rounded-lg">
										<h4 className="font-semibold">{item.title}</h4>
										<p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			)}

			{/* Show no advice message */}
			{/* {!isLoading && financialAdvice.length === 0 && (
				<div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-xl text-center">
					<span>No financial advice available.</span>
				</div>
			)} */}
		</div>
	);
}