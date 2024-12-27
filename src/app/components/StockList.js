export default function StockList({ stocks, refreshStocks }) {
    const handleDelete = async (name) => {
        await fetch('/api/stocks', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        refreshStocks();
    };

    return (
        <div>
            <h3>Stocks</h3>
            <ul className="w-full flex flex-col gap-4">
            {stocks.map((stock) => (
                <li
                key={stock.name}
                className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-md shadow-sm"
                >
                <div>
                    <h3 className="text-lg font-semibold">{stock.name}</h3>
                    <p className="text-sm text-gray-500">
                    Volume: {stock.volume}, U.PL: {stock.uPl}%
                    </p>
                </div>
                <button
                    onClick={() => handleDelete(stock.name)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                    Remove
                </button>
                </li>
            ))}
            </ul>
        </div>
    );
}
