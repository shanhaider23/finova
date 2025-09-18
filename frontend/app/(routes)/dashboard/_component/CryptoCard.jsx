"use client";
import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

const COINS = [
    { id: "bitcoin", name: "Bitcoin" },
    { id: "ethereum", name: "Ethereum" },
    { id: "solana", name: "Solana" },
    { id: "dogecoin", name: "Dogecoin" },
    { id: "cardano", name: "Cardano" },
    { id: "ripple", name: "XRP" },
];

const CURRENCIES = [
    { code: "usd", label: "USD" },
    { code: "eur", label: "EUR" },
    { code: "dkk", label: "DKK" },
    { code: "gbp", label: "GBP" },
    { code: "jpy", label: "JPY" },
    { code: "inr", label: "INR" },
    { code: "pkr", label: "PKR" },
];

const TIME_RANGES = [
    { value: 1, label: "1D" },
    { value: 7, label: "7D" },
    { value: 30, label: "30D" },
    { value: 90, label: "90D" },
    { value: 180, label: "180D" },
    { value: 365, label: "1Y" },
];

export default function CryptoCard() {
    const [currency, setCurrency] = useState("usd");
    const [coin, setCoin] = useState("bitcoin");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(30);
    const [chartData, setChartData] = useState([]);
    const [chartLoading, setChartLoading] = useState(true);

    // Fetch coin market data
    useEffect(() => {
        setLoading(true);
        fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${coin}&order=market_cap_desc&per_page=1&page=1&sparkline=false`
        )
            .then((res) => res.json())
            .then((json) => {
                setData(json[0]);
                setLoading(false);
            });
    }, [currency, coin]);

    // Fetch historical chart data
    useEffect(() => {
        setChartLoading(true);
        fetch(
            `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=${currency}&days=${days}`
        )
            .then((res) => res.json())
            .then((json) => {
                // json.prices: [ [timestamp, price], ... ]
                const formatted = (json.prices || []).map(([timestamp, price]) => ({
                    date: days <= 7
                        ? new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : new Date(timestamp).toLocaleDateString(),
                    price,
                }));
                setChartData(formatted);
                setChartLoading(false);
            });
    }, [coin, currency, days]);

    return (
        <div className="bg-card rounded-xl shadow-lg p-5 w-full h-[98%] ">
            <div className="flex gap-2 mb-3 w-full">
                <select
                    className="rounded px-2 py-1 border border-gray-300 dark:bg-gray-800 dark:text-gray-200"
                    value={coin}
                    onChange={(e) => setCoin(e.target.value)}
                >
                    {COINS.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
                <select
                    className="rounded px-2 py-1 border border-gray-300 dark:bg-gray-800 dark:text-gray-200"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                >
                    {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                            {c.label}
                        </option>
                    ))}
                </select>
                <select
                    className="rounded px-2 py-1 border border-gray-300 dark:bg-gray-800 dark:text-gray-200"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                >
                    {TIME_RANGES.map((t) => (
                        <option key={t.value} value={t.value}>
                            {t.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="w-full flex items-center gap-4">
                <div className="flex flex-col items-center ">

                    {loading ? (
                        <div className="text-gray-500">Loading...</div>
                    ) : data ? (
                        <>
                            <img src={data.image} alt={data.name} className="w-12 h-12 mb-2" />
                            <div className="text-lg font-bold mb-1">{data.name}</div>
                            <div className="text-2xl font-bold mb-1 text-center">
                                {data.current_price} {currency.toUpperCase()}
                            </div>
                            <div
                                className={`mb-2 font-semibold ${data.price_change_percentage_24h >= 0
                                    ? "text-green-600"
                                    : "text-red-500"
                                    }`}
                            >
                                {data.price_change_percentage_24h >= 0 ? "+" : ""}
                                {data.price_change_percentage_24h?.toFixed(2)}%
                            </div>
                            <div className="text-xs text-gray-500 mb-2 text-center">
                                Market Cap: {data.market_cap.toLocaleString()} {currency.toUpperCase()}
                            </div>
                        </>
                    ) : (
                        <div className="text-gray-500">No data</div>
                    )}
                </div>
                {/* Line Chart */}
                <div className="w-full h-40 mt-2">
                    {chartLoading ? (
                        <div className="text-gray-400 text-center">Loading chart...</div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="date" hide={chartData.length > 30} />
                                <YAxis
                                    domain={["auto", "auto"]}
                                    tickFormatter={v => v.toLocaleString()}
                                    width={40}
                                />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#22c55e"
                                    strokeWidth={2}
                                    dot={false}
                                    name="Price"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

        </div>
    );
}