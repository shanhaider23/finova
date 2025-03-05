'use client';
import React, { useState, useEffect } from 'react';

export default function FinanceAIBot() {
	const [question, setQuestion] = useState('');
	const [response, setResponse] = useState('');
	const [isTyping, setIsTyping] = useState(false); // Track typing state

	// Fake AI logic with a typing delay simulation
	const handleAskQuestion = () => {
		if (!question) return;

		setIsTyping(true); // Start typing animation

		setTimeout(() => {
			if (question.toLowerCase().includes('save')) {
				setResponse(
					'💡 Tip: Try saving at least 20% of your income every month for future goals.'
				);
			} else if (question.toLowerCase().includes('invest')) {
				setResponse(
					'📊 Suggestion: Diversify your investments between stocks, bonds, and real estate.'
				);
			} else if (question.toLowerCase().includes('expense')) {
				setResponse(
					'🔍 Advice: Track your monthly expenses and categorize them to find saving opportunities.'
				);
			} else if (question.toLowerCase().includes('forecast')) {
				setResponse(
					'🔮 Insight: Based on your spending trends, next month might see a 10% increase in expenses.'
				);
			} else {
				setResponse(
					'🤖 Sorry, I am just a demo bot. Ask about savings, investments, expenses, or forecasts!'
				);
			}
			setIsTyping(false); // Stop typing animation
		}, 1500); // Simulate delay (1.5s)

		setQuestion('');
	};

	return (
		<div className="p-5 max-w-lg mx-auto bg-card rounded-2xl shadow-lg space-y-4">
			<h2 className="text-2xl font-bold text-center">
				💬 Finance Assistant (Demo)
			</h2>

			<input
				type="text"
				value={question}
				onChange={(e) => setQuestion(e.target.value)}
				placeholder="Ask me anything about finance..."
				className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input"
			/>

			<button
				onClick={handleAskQuestion}
				className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition"
			>
				Ask
			</button>

			{isTyping ? (
				<div className="p-4 mt-4 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center">
					<div className="dot-pulse mr-2" /> {/* Typing Animation */}
					<span>Typing...</span>
				</div>
			) : (
				response && (
					<div className="p-4 mt-4 bg-gray-200 dark:bg-gray-700 rounded-xl">
						<p>{response}</p>
					</div>
				)
			)}
		</div>
	);
}
