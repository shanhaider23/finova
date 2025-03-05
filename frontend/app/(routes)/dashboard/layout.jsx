'use client';
import React, { useEffect } from 'react';

import { useUser } from '@clerk/nextjs';
import { Budgets } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { db } from '@/utils/dbConfig';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@/app/_component/Breadcrumb';

function DashboardLayout({ children }) {
	const { user } = useUser();
	const router = useRouter();
	useEffect(() => {
		checkUserBudgets();
	}, [user]);
	const checkUserBudgets = async () => {
		const result = await db
			.select()
			.from(Budgets)
			.where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress));
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
