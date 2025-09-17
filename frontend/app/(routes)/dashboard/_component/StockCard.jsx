"use client";
import { useEffect, useState } from "react";

export default function StockCard({ symbol }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`/api/stocks/${symbol}`)
            .then(res => res.json())
            .then(setData);
    }, [symbol]);

    if (!data) return <p>Loading...</p>;

    return (
        <div className="p-4 rounded-xl shadow bg-white">
            <h2 className="text-lg font-bold">{data.shortName} ({data.symbol})</h2>
            <p className="text-xl font-semibold">
                {data.regularMarketPrice} {data.currency}
            </p>
            <p className={data.regularMarketChange >= 0 ? "text-green-600" : "text-red-600"}>
                {data.regularMarketChange.toFixed(2)} ({data.regularMarketChangePercent.toFixed(2)}%)
            </p>
        </div>
    );
}
