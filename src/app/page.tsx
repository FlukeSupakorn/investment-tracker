'use client';

import { useEffect, useState } from 'react';
import StockForm from './components/StockForm';
import StockList from './components/StockList';

interface Stock {
  id?: number; // Optional if not returned from the database
  name: string;
  volume: number;
  avgPrice: number;
  marketPrice: number;
  uPl: number;
  datetime: string;
}

export default function Home() {
  const [stocks, setStocks] = useState<Stock[]>([]); // Explicitly define the state type

  const fetchStocks = async () => {
    try {
      const res = await fetch('/api/stocks');
      const data = await res.json();
  
      if (Array.isArray(data)) {
        setStocks(data);
      } else {
        console.error('Unexpected response format:', data);
        setStocks([]);
      }
    } catch (error) {
      console.error('Error fetching stocks:', error);
      setStocks([]);
    }
  };  

  // Refresh stocks when an action is performed
  const refreshStocks = () => {
    fetchStocks();
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 gap-16 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full py-6 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-500 text-white text-center shadow-md">
        <h1 className="text-4xl font-bold">Investment Tracker</h1>
        <p className="text-lg mt-2">Track your stocks and investments effortlessly</p>
      </header>

      <main className="w-full max-w-4xl mx-auto py-8 px-6 bg-white shadow-md rounded-lg mt-8">
        {/* Stock Form */}
        <StockForm refreshStocks={fetchStocks} />
        {/* Divider */}
        <hr className="my-6 border-gray-300" />
        {/* Stock List */}
        <StockList stocks={stocks} refreshStocks={refreshStocks} />
      </main>
      <footer className="w-full py-4 bg-gray-200 text-gray-600 text-center mt-8">
        <p className="text-sm">
          © {new Date().getFullYear()} Investment Tracker. Built with 
          <a
            href="https://nextjs.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline ml-1"
          >
            Next.js
          </a>.
        </p>
      </footer>
    </div>
  );
}
