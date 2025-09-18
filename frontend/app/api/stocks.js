import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { symbol } = req.query;
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

    if (!symbol) {
        return res.status(400).json({ error: "Missing symbol" });
    }

    try {
        // Alpha Vantage TIME_SERIES_INTRADAY endpoint (or use GLOBAL_QUOTE for latest)
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
        const response = await fetch(url);
        const json = await response.json();
        console.log(json);
        if (!json["Global Quote"]) {
            return res.status(404).json({ error: "Stock not found" });
        }

        const quote = json["Global Quote"];
        res.status(200).json({
            symbol: quote["01. symbol"],
            regularMarketPrice: parseFloat(quote["05. price"]),
            regularMarketChange: parseFloat(quote["09. change"]),
            regularMarketChangePercent: parseFloat(quote["10. change percent"]),
            currency: "USD", // Alpha Vantage does not return currency, so you may want to hardcode or fetch elsewhere
            shortName: symbol, // You can enhance this with another API if you want the full company name
        });
    } catch (error) {
        const err = error
        console.error(err)
        res.status(500).json({ err: "Failed to fetch stock data" });
    }
}