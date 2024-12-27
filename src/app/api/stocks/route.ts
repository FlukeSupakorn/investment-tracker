import { NextResponse } from 'next/server';

let stocks: any[] = [];

export async function GET() {
  return NextResponse.json(stocks);
}

export async function POST(req: Request) {
  const { name, volume, avgPrice, marketPrice } = await req.json();
  const existingStock = stocks.find(stock => stock.name === name);
  if (existingStock) {
    return NextResponse.json({ error: 'Stock already exists' }, { status: 400 });
  }
  const uPl = ((marketPrice - avgPrice) / avgPrice) * 100;
  stocks.push({ name, volume, avgPrice, marketPrice, uPl: uPl.toFixed(2) });
  return NextResponse.json({ message: 'Stock added', stocks });
}

export async function PUT(req: Request) {
  const { name, volume, avgPrice, marketPrice } = await req.json();
  const stock = stocks.find(stock => stock.name === name);
  if (!stock) {
    return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
  }
  if (volume) stock.volume = volume;
  if (avgPrice) stock.avgPrice = avgPrice;
  if (marketPrice) stock.marketPrice = marketPrice;
  stock.uPl = ((stock.marketPrice - stock.avgPrice) / stock.avgPrice) * 100;
  return NextResponse.json({ message: 'Stock updated', stocks });
}

export async function DELETE(req: Request) {
  const { name } = await req.json();
  stocks = stocks.filter(stock => stock.name !== name);
  return NextResponse.json({ message: 'Stock removed', stocks });
}
