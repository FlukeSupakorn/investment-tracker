import { useState } from 'react';

export default function StockForm({ refreshStocks }) {
    const [formData, setFormData] = useState({
        name: '',
        volume: '',
        avgPrice: '',
        marketPrice: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('/api/stocks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        refreshStocks();
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <input
                name="name"
                placeholder="Stock Name"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <input
                name="volume"
                placeholder="Volume"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <input
                name="avgPrice"
                placeholder="Average Price"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <input
                name="marketPrice"
                placeholder="Market Price"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
                Add Stock
            </button>
        </form>
    );
}
