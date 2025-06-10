import AnnualReport from './-component/AnnualReport';



function AnnualDashboard({ monthlyList }) {
    return (
        <div >
            <div className="flex justify-center  flex-col gap-5">
                <h1 className="text-2xl font-bold">Annual Insights</h1>
                <AnnualReport monthlyList={monthlyList} />
            </div>
        </div>
    );
}

export default AnnualDashboard;