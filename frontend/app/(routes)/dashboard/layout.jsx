'use client';
import React, { useEffect } from 'react';

import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@/app/_component/Breadcrumb';

function DashboardLayout({ children }) {
	const { user } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (user) {
			checkUserBudgets();
		}
	}, [user]);

	const checkUserBudgets = async () => {
		try {
			// Use environment variable for API base URL
			const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

			// Fetch budgets from Django backend
			const response = await axios.get(`${apiBaseUrl}/api/budgets/`, {
				params: { email: user?.primaryEmailAddress?.emailAddress },
			});

			// Handle the response (e.g., redirect if no budgets exist)
			if (response.data.length === 0) {
				router.push('/dashboard/setup'); // Redirect to setup page if no budgets exist
			}
		} catch (error) {
			console.error('Error fetching budgets:', error);
		}
	};

	return (
		<>
			<div>
				<Breadcrumbs />
			</div>
			{children}
		</>
	);
}

export default DashboardLayout;