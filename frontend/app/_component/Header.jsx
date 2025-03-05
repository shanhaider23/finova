'use client';
import React from 'react';

import DashboardHeader from '../(routes)/dashboard/_component/DashboardHeader';

function Header() {
	return (
		<div className="sticky top-0 z-50">
			<DashboardHeader />
		</div>
	);
}

export default Header;
