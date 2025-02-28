'use client';
import React, { useState } from 'react';
import CashFlow from './_component/CashFlow';
import MonthlyIncome from './_component/Income';
import MonthlyExpense from './_component/Expense';
import InputDetail from './_component/InputDetail';

function Monthly() {
	const [month, setMonth] = useState('');
	const [year, setYear] = useState('');

	return (
		<div className="m-5 overflow-hidden">
			<div className="flex justify-center items-start gap-5 flex-wrap md:flex-nowrap  h-full overflow-x-auto">
				<div className="w-full sm:w-[350px] min-w-[300px] self-start">
					<CashFlow
						month={month}
						setMonth={setMonth}
						year={year}
						setYear={setYear}
					/>
				</div>

				<div className="flex-grow w-full sm:w-auto flex flex-col gap-3">
					<div className="w-full">
						<InputDetail />
					</div>

					{/* Scrollable Section */}
					<div className="flex gap-5 items-start justify-center flex-wrap md:flex-nowrap overflow-y-auto max-h-[700px] ">
						{/* These components will be scrollable */}
						<div className="flex-1 min-w-[250px]">
							<MonthlyIncome month={month} year={year} />
						</div>
						<div className="flex-1 min-w-[250px]">
							<MonthlyExpense month={month} year={year} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Monthly;
