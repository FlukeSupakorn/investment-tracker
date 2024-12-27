import { useState } from 'react';

export default function StockList({ stocks, refreshStocks }) {
  const [selectedStock, setSelectedStock] = useState(null);
  const [formData, setFormData] = useState({
    volume: '',
    avgPrice: '',
    marketPrice: '',
  });

  const handleDelete = async (name) => {
    try {
      await fetch('/api/stocks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      refreshStocks();
    } catch (error) {
      console.error('Error deleting stock:', error);
    }
  };

  const handleStockClick = (stock) => {
    setSelectedStock(stock);
    setFormData({
      volume: stock.volume,
      avgPrice: stock.avgPrice,
      marketPrice: stock.marketPrice,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedStock) return;

    try {
      await fetch('/api/stocks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedStock.name,
          volume: formData.volume,
          avgPrice: formData.avgPrice,
          marketPrice: formData.marketPrice,
        }),
      });

      refreshStocks();
      setSelectedStock(null);
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  return (
    <div>
      <h3>Stocks</h3>
      <ul className="w-full flex flex-col gap-4">
        {stocks.map((stock) => (
          <li
            key={stock.name}
            onClick={() => handleStockClick(stock)}
            className={`w-full flex justify-between items-center p-4 rounded-md shadow-sm cursor-pointer ${
              selectedStock?.name === stock.name ? 'bg-blue-100' : 'bg-gray-50'
            }`}
          >
            <div>
              <h3 className="text-lg font-semibold">{stock.name}</h3>
              <p className="text-sm text-gray-500">
                Volume: {stock.volume}, Avg Price: {stock.avgPrice}, Market Price: {stock.marketPrice}, U.PL: {stock.uPl}%
              </p>
              <p className="text-xs text-gray-400">Last updated: {new Date(stock.datetime).toLocaleString()}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(stock.name);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {selectedStock && (
        <form onSubmit={handleUpdate} className="mt-6 p-4 bg-white shadow-md rounded-md">
          <h3 className="text-lg font-bold">Update Stock: {selectedStock.name}</h3>
          <div className="mt-4 flex flex-col gap-4">
            <input
              type="number"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
              placeholder="Volume"
              className="w-full p-2 border rounded-md"
            />
            <input
              type="number"
              name="avgPrice"
              value={formData.avgPrice}
              onChange={handleChange}
              placeholder="Average Price"
              className="w-full p-2 border rounded-md"
            />
            <input
              type="number"
              name="marketPrice"
              value={formData.marketPrice}
              onChange={handleChange}
              placeholder="Market Price"
              className="w-full p-2 border rounded-md"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
