import { useState, useEffect } from 'react';
import StockForm from '../components/StockForm';
import StockList from '../components/StockList';

export default function Home() {
    const [stocks, setStocks] = useState([]);

    const fetchStocks = async () => {
        const res = await fetch('/api/stocks');
        const data = await res.json();
        setStocks(data);
    };

    useEffect(() => {
        fetchStocks();
    }, []);

    return (
        <div>
            <h1>Investment Tracker</h1>
            <StockForm refreshStocks={fetchStocks} />
            <StockList stocks={stocks} refreshStocks={fetchStocks} />
        </div>
    );
}
