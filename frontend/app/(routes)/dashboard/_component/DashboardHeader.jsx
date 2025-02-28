import DarkModeToggle from '@/app/_component/DarkModeToggle';
import Image from 'next/image';
import React, { useState } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { NavItems } from '../../../config';

function DashboardHeader() {
	const { user } = useUser();
	const navItems = NavItems();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

	return (
		<div className="p-4 flex justify-between items-center gap-5 transition-all duration-300 relative mr-5">
			<div className="flex items-center gap-3">
				<button className="sm:hidden" onClick={toggleMobileMenu}>
					{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
				</button>
			</div>

			<div className="flex items-center gap-4">
				<UserButton />
				<DarkModeToggle />
			</div>

			{isMobileMenuOpen && (
				<div className="absolute top-full left-0 w-[350px] bg-menu bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md sm:hidden z-50">
					<div className="flex justify-start items-center gap-3 pl-5 pt-5  ">
						<Image src={'/logo.png'} alt="Logo" width={120} height={100} />
					</div>
					<ul className="flex flex-col p-4 space-y-2">
						{navItems.map((item, idx) => (
							<li key={idx}>
								<Link
									href={item.href}
									className=" p-3 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex justify-start items-center gap-3"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									{item.icon}
									{item.name}
								</Link>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

export default DashboardHeader;
