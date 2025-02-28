import { usePathname } from 'next/navigation';

import {
	Settings,
	Currency,
	LayoutGrid,
	PiggyBank,
	ReceiptText,
	Calendar,
	ListTodo,
	Brain,
	BotMessageSquare,
} from 'lucide-react';

export const NavItems = () => {
	const pathname = usePathname();

	function isNavItemActive(pathname) {
		return pathname;
	}

	return [
		{
			id: 1,
			name: 'Dashboard',
			href: '/dashboard',
			icon: <LayoutGrid size={20} />,
			active: isNavItemActive(pathname, '/dashboard'),
			position: 'top',
		},
		{
			id: 2,
			name: 'Budgets',
			href: '/dashboard/budgets',
			icon: <PiggyBank size={20} />,
			active: isNavItemActive(pathname, '/dashboard/budgets'),
			position: 'top',
		},
		{
			id: 3,
			name: 'Expenses',
			href: '/dashboard/expenses',
			icon: <ReceiptText size={20} />,
			active: isNavItemActive(pathname, '/dashboard/expenses'),
			position: 'top',
		},
		{
			id: 4,
			name: 'Currency Converter',
			href: '/dashboard/currency',
			icon: <Currency size={20} />,
			active: isNavItemActive(pathname, '/dashboard/currency'),
			position: 'top',
		},
		{
			id: 5,
			name: 'Monthly Budget',
			href: '/dashboard/monthly',
			icon: <Calendar size={20} />,
			active: isNavItemActive(pathname, '/dashboard/monthly'),
			position: 'top',
		},
		{
			id: 6,
			name: 'Reminder',
			href: '/dashboard/todo',
			icon: <ListTodo size={20} />,
			active: isNavItemActive(pathname, '/dashboard/todo'),
			position: 'top',
		},
		{
			id: 7,
			name: 'Financial Forecasting',
			href: '/dashboard/forecasting',
			icon: <Brain size={20} />,
			active: isNavItemActive(pathname, '/dashboard/forecasting'),
			position: 'top',
		},
		{
			id: 8,
			name: 'AI Advice',
			href: '/dashboard/advice',
			icon: <BotMessageSquare size={20} />,
			active: isNavItemActive(pathname, '/dashboard/advice'),
			position: 'top',
		},
		{
			name: 'Settings',
			href: '/dashboard/settings',
			icon: <Settings size={20} />,
			active: isNavItemActive(pathname, '/dashboard/settings'),
			position: 'bottom',
		},
	];
};
