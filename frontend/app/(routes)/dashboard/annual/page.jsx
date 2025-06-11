'use client';
import { useSelector } from 'react-redux';
import AnnualReport from './-component/AnnualReport';

function AnnualDashboard() {
    const { list: monthlyList } = useSelector((state) => state.monthly);


    return (
        <div>
            <div className="flex justify-center flex-col gap-5 ">
                <AnnualReport monthlyList={monthlyList} />
            </div>
        </div>
    );
}

export default AnnualDashboard;