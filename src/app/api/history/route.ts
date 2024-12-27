import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

let history: any[] = [];

export async function GET() {
  return NextResponse.json(history);
}

export async function POST(req: Request) {
  const { action, stockName, timestamp } = await req.json();
  history.push({ action, stockName, timestamp });
  return NextResponse.json({ message: 'History logged', history });
}

export async function POST_EXPORT(req: Request) {
  const worksheet = XLSX.utils.json_to_sheet(history);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'History');
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=history.xlsx',
    },
  });
}
