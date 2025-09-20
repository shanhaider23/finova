'use client';
import { useSelector } from 'react-redux';
import AnnualReport from './-component/AnnualReport';

function AnnualDashboard({ monthlyList, loading }) {


    return (
        <div>
            <div className="flex justify-center flex-col gap-5 ">
                <AnnualReport monthlyList={monthlyList} loading={loading} />
            </div>
        </div>
    );
}

export default AnnualDashboard;