import { NextResponse } from 'next/server';
import pool from '@/utils/db';

// GET: Fetch unique stocks with latest history
export async function GET() {
    try {
      const [rows]: any = await pool.query(
        `
        SELECT s.name, h.volume, h.avgPrice, h.marketPrice, h.uPl, h.datetime
        FROM stocks s
        JOIN (
          SELECT stock_id, MAX(datetime) AS latest_datetime
          FROM history
          GROUP BY stock_id
        ) latest ON s.stock_id = latest.stock_id
        JOIN history h ON latest.stock_id = h.stock_id AND latest.latest_datetime = h.datetime
        ORDER BY h.datetime DESC
        `
      );
      return NextResponse.json(rows || []);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      return NextResponse.json({ error: 'Failed to fetch stocks' }, { status: 500 });
    }
  }
  
  // POST: Add a new stock or return "already exists"
  export async function POST(req: Request) {
    try {
      const { name, volume, avgPrice, marketPrice } = await req.json();
      const [[existingStock]]: any = await pool.query('SELECT * FROM stocks WHERE name = ?', [name]);
  
      if (existingStock) {
        return NextResponse.json({ error: 'Stock name already exists' }, { status: 400 });
      }
  
      const uPl = ((marketPrice - avgPrice) / avgPrice) * 100;
      const datetime = new Date();
  
      // Add new stock and its first history entry
      const [result]: any = await pool.query('INSERT INTO stocks (name) VALUES (?)', [name]);
      const stock_id = result.insertId;
  
      await pool.query(
        'INSERT INTO history (datetime, stock_id, volume, avgPrice, marketPrice, uPl) VALUES (?, ?, ?, ?, ?, ?)',
        [datetime, stock_id, volume, avgPrice, marketPrice, uPl.toFixed(2)]
      );
  
      return NextResponse.json({ message: 'New stock added successfully' });
    } catch (error) {
      console.error('Error adding stock:', error);
      return NextResponse.json({ error: 'Failed to add stock' }, { status: 500 });
    }
  }

// PUT: Update an existing stock
export async function PUT(req: Request) {
    try {
        const { name, volume, avgPrice, marketPrice } = await req.json();
        const [[stock]]: any = await pool.query('SELECT * FROM stocks WHERE name = ?', [name]);

        if (!stock) {
            return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
        }

        const stock_id = stock.stock_id;
        const uPl = ((marketPrice - avgPrice) / avgPrice) * 100;
        const datetime = new Date();

        await pool.query(
            'INSERT INTO history (datetime, stock_id, volume, avgPrice, marketPrice, uPl) VALUES (?, ?, ?, ?, ?, ?)',
            [datetime, stock_id, volume, avgPrice, marketPrice, uPl.toFixed(2)]
        );

        return NextResponse.json({ message: 'Stock updated successfully' });
    } catch (error) {
        console.error('Error updating stock:', error);
        return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
    }
}

// DELETE: Remove a stock and all its history
export async function DELETE(req: Request) {
    try {
      const { name } = await req.json();
  
      // Find the stock by name
      const [[stock]]: any = await pool.query('SELECT * FROM stocks WHERE name = ?', [name]);
  
      if (!stock) {
        return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
      }
  
      const stock_id = stock.stock_id;
  
      // Delete from history table
      await pool.query('DELETE FROM history WHERE stock_id = ?', [stock_id]);
  
      // Delete from stocks table
      await pool.query('DELETE FROM stocks WHERE stock_id = ?', [stock_id]);
  
      return NextResponse.json({ message: 'Stock and its history removed successfully' });
    } catch (error) {
      console.error('Error deleting stock:', error);
      return NextResponse.json({ error: 'Failed to delete stock' }, { status: 500 });
    }
}
  
