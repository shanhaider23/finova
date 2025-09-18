"use client";
import React, { useEffect, useState } from "react";

export default function StockCard({ symbol = "AAPL", name = "Apple Inc." }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

    useEffect(() => {
        if (!symbol) return;
        setLoading(true);
        setError(null);

        // Direct fetch from Alpha Vantage
        fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`)
            .then(res => res.json())
            .then(json => {
                if (json["Note"]) {
                    setError("Alpha Vantage rate limit exceeded. Please try again later.");
                    setData(null);
                } else if (json["Error Message"]) {
                    setError(json["Error Message"]);
                    setData(null);
                } else if (!json["Global Quote"]) {
                    setError("Stock not found");
                    setData(null);
                } else {
                    const quote = json["Global Quote"];
                    setData({
                        symbol: quote["01. symbol"],
                        regularMarketPrice: parseFloat(quote["05. price"]),
                        regularMarketChange: parseFloat(quote["09. change"]),
                        regularMarketChangePercent: quote["10. change percent"],
                        currency: "USD",
                        shortName: symbol,
                    });
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to fetch stock data");
                setLoading(false);
            });
    }, [symbol]);

    return (
        <div className="bg-card rounded-xl shadow-lg p-5 w-full h-full flex flex-col items-center">
            <h2 className="text-lg font-bold text-blue-700 dark:text-blue-200 tracking-wide">
                {name}

            </h2>
            {loading ? (
                <div className="text-gray-500">Loading...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : data ? (
                <div className="flex flex-col items-center  mt-4">
                    <div className="text-xl font-bold mb-1 text-center">
                        {data.regularMarketPrice} {data.currency}
                    </div>
                    <div className={`font-semibold ${data.regularMarketChange >= 0 ? "text-green-600" : "text-red-500"} text-center`}>
                        {data.regularMarketChange >= 0 ? "+" : ""}
                        {data.regularMarketChange} ({data.regularMarketChangePercent})
                    </div>

                </div>
            ) : (
                <div className="text-gray-500">No data</div>
            )}
        </div>
    );
}