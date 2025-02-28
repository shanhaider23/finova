import React from 'react';
import Link from 'next/link';
import { Linkedin, Github, BriefcaseBusiness } from 'lucide-react';

function Footer() {
	return (
		<div className="pl-4 pr-4 pt-2 pb-2 sticky bottom-0 flex justify-between items-center gap-5  transition-all duration-300 ">
			<div className="flex gap-4 text-gray-800 dark:text-white text-sm">
				<Link
					href="https://www.linkedin.com/in/shan-e-haider-bukhari/"
					target="_blank"
					className="flex items-center gap-2 hover:text-blue-500"
				>
					<Linkedin size={20} />
				</Link>
				<Link
					href="https://github.com/shanhaider23"
					target="_blank"
					className="flex items-center gap-2 hover:text-gray-600"
				>
					<Github size={20} />
				</Link>
				<Link
					href="https://shanehaider.dk"
					target="_blank"
					className="flex items-center gap-2 hover:text-gray-600"
				>
					<BriefcaseBusiness size={20} />
				</Link>
			</div>

			<div className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs md:text-sm flex justify-center gap-0 sm:gap-5 items-center flex-wrap">
				<a
					href="https://shanehaider.dk"
					target="_blank"
					className="text-center"
				>
					Design and Developed by Shan-e-Haider Bukhari
				</a>
				<p className="text-center">
					&copy; {new Date().getFullYear()} All rights reserved.
				</p>
			</div>
		</div>
	);
}

export default Footer;
