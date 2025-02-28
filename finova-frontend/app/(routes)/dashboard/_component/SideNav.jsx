'use client';

import { Fragment, useEffect, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { NavItems } from '../../../config';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import TransitionLink from '@/app/_component/TransitionLink';

export default function SideNav({ isSidebarExpanded, setIsSidebarExpanded }) {
	const { isSignedIn } = useUser();
	const navItems = NavItems();
	const path = usePathname();

	const toggleSidebar = () => {
		setIsSidebarExpanded(!isSidebarExpanded);
		if (typeof window !== 'undefined') {
			window.localStorage.setItem(
				'sidebarExpanded',
				JSON.stringify(!isSidebarExpanded)
			);
		}
	};

	return (
		<div className="z-[999] h-full">
			{isSignedIn && (
				<div className="pr-4 z-[999] h-full">
					<div
						className={cn(
							isSidebarExpanded ? 'w-[255px]' : 'w-[68px]',
							'border-r bg-sidebar transition-all duration-300 ease-in-out transform',
							'hidden sm:flex h-full border-gray-200 dark:border-gray-700 shadow-lg',
							'sm:translate-x-0', // Always visible on `sm` and above
							isSidebarExpanded ? 'translate-x-0' : '-translate-x-full' // Slide in/out on mobile
						)}
					>
						<aside className="flex h-full flex-col w-full break-words px-4 overflow-x-hidden columns-1">
							{/* Top */}
							<div className="mt-4 relative pb-4">
								<div className="hidden sm:flex items-center   ">
									<Link href={'/dashboard'}>
										{isSidebarExpanded ? (
											<Image
												src={'/logo.png'}
												alt="Logo"
												width={150}
												height={80}
												className="mb-4"
											/>
										) : (
											<Image
												src={'/logo-sm.png'}
												alt="Logo"
												width={150}
												height={80}
												className="mb-4"
											/>
										)}
									</Link>
								</div>
								<div className="flex flex-col space-y-1">
									{navItems.map((item, idx) => {
										if (item.position === 'top') {
											return (
												<Fragment key={idx}>
													<div className="space-y-1">
														<SideNavItem
															label={item.name}
															icon={item.icon}
															path={item.href}
															active={item.active}
															isSidebarExpanded={isSidebarExpanded}
														/>
													</div>
												</Fragment>
											);
										}
									})}
								</div>
							</div>
							{/* Bottom */}
							<div className="sticky bottom-0 mt-auto whitespace-nowrap mb-4 transition duration-200 block">
								{navItems.map((item, idx) => {
									if (item.position === 'bottom') {
										return (
											<Fragment key={idx}>
												<div className="space-y-1">
													<SideNavItem
														label={item.name}
														icon={item.icon}
														path={item.href}
														active={item.active}
														isSidebarExpanded={isSidebarExpanded}
													/>
												</div>
											</Fragment>
										);
									}
								})}
							</div>
						</aside>
						<div className="mt-[calc(calc(90vh)-40px)] relative">
							<button
								type="button"
								className="absolute bottom-32 right-[-12px] flex h-6 w-6 items-center justify-center border border-muted-foreground/20 rounded-full bg-accent shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out bg-slate-800  dark:bg-sky-900"
								onClick={toggleSidebar}
							>
								{isSidebarExpanded ? (
									<ChevronLeft size={16} className="stroke-slate-50" />
								) : (
									<ChevronRight size={16} className="stroke-slate-50" />
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export const SideNavItem = ({
	label,
	icon,
	path,
	active,
	isSidebarExpanded,
}) => {
	return (
		<>
			{isSidebarExpanded ? (
				<TransitionLink href={path}>
					<h2
						className={`flex gap-2 items-center text-gray-900 font-medium p-5 cursor-pointer round hover:text-primary hover:bg-blue-100 mb-2 transition-all dark:hover:bg-blue-600 dark:text-gray-300 dark:hover:text-white ${
							path === active &&
							' bg-blue-100 dark:bg-blue-600 text-black dark:text-white round'
						}`}
					>
						{icon}
						{label}
					</h2>
				</TransitionLink>
			) : (
				<TooltipProvider delayDuration={70}>
					<Tooltip className="z-50">
						<TooltipTrigger>
							<Link href={path}>
								<h2
									className={`flex gap-2  items-center text-gray-500 font-medium p-2 cursor-pointer round  hover:text-primary hover:bg-blue-100 mb-2 transition-all dark:hover:bg-blue-600 dark:text-gray-300 dark:hover:text-white ${
										path === active &&
										' bg-blue-100 dark:bg-blue-600 text-black dark:text-white'
									}`}
								>
									{icon}
								</h2>
							</Link>
						</TooltipTrigger>
						<TooltipContent
							side="top"
							className="px-3 py-1.5 text-xs z-[999] round bg-card text-gray-900 dark:text-white  "
							sideOffset={10}
						>
							<h2 className="z-[999]">{label}</h2>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}
		</>
	);
};
