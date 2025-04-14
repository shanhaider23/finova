import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

function Breadcrumbs() {
	const pathname = usePathname();
	const pathSegments = pathname.split('/').filter(Boolean);

	return (
		<div className="pl-5">
			<Breadcrumb>
				<BreadcrumbList className="flex items-center text-sm font-semibold">
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href="/" className="hover:underline">
								Home
							</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>

					{pathSegments.map((segment, index) => {
						const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
						const isLast = index === pathSegments.length - 1;
						const formattedSegment = segment
							.replace(/-/g, ' ')
							.replace(/\b\w/g, (c) => c.toUpperCase());

						return (
							<React.Fragment key={href}>
								<BreadcrumbSeparator className="mx-2">/</BreadcrumbSeparator>
								<BreadcrumbItem>
									{isLast ? (
										<BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
									) : (
										<BreadcrumbLink asChild>
											<Link href={href} className="hover:underline text-blue-500">
												{formattedSegment}
											</Link>
										</BreadcrumbLink>
									)}
								</BreadcrumbItem>
							</React.Fragment>
						);
					})}
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	);
}

export default Breadcrumbs;