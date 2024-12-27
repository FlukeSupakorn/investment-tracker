import { NextResponse } from 'next/server';
import pool from '@/utils/db';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    const [rows]: any = await pool.query(
      `SELECT s.name AS stock_name, h.volume, h.avgPrice, h.marketPrice, h.uPl, h.datetime 
       FROM history h
       JOIN stocks s ON h.stock_id = s.stock_id
       ORDER BY s.name, h.datetime`
    );

    // Convert rows to Excel workbook
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'History');

    // Write workbook to buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Respond with the file
    return new Response(buffer, {
      headers: {
        'Content-Disposition': 'attachment; filename="history.xlsx"',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (error) {
    console.error('Error exporting history:', error);
    return NextResponse.json({ error: 'Failed to export history' }, { status: 500 });
  }
}