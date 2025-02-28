import React from 'react';

function Hero() {
	return (
		<div className="h-[91vh] flex justify-center items-center">
			<div className="text-center">
				<h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl pb-5">
					Manage Your Expense
					<span className="sm:block"> Control your Money </span>
				</h1>

				<p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
					Start creating your budget and save ton of money.
				</p>

				<div className="mt-8 flex flex-wrap justify-center gap-4">
					<a
						className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-gray-800 focus:outline-none focus:ring active:text-opacity-75 sm:w-auto dark:hover:text-white"
						href="/sign-in"
					>
						Get Started
					</a>
				</div>
			</div>
		</div>
	);
}

export default Hero;
