import { useState } from 'react';

export default function StockForm({ refreshStocks }) {
  const [formData, setFormData] = useState({
    name: '',
    volume: '',
    avgPrice: '',
    marketPrice: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/stocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // alert(data.message);
        refreshStocks();
        setFormData({ name: '', volume: '', avgPrice: '', marketPrice: '' }); // Reset form
      } else {
        alert(data.error); // Show error if stock exists
      }
    } catch (error) {
      console.error('Error adding stock:', error);
      alert('Failed to add stock');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <input
        name="name"
        value={formData.name}
        placeholder="Stock Name"
        onChange={handleChange}
        required
        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
      />
      <input
        name="volume"
        value={formData.volume}
        placeholder="Volume"
        onChange={handleChange}
        required
        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
      />
      <input
        name="avgPrice"
        value={formData.avgPrice}
        placeholder="Average Price"
        onChange={handleChange}
        required
        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
      />
      <input
        name="marketPrice"
        value={formData.marketPrice}
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
