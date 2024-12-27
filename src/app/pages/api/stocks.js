let stocks = [];

export default function handler(req, res) {
    if (req.method === 'GET') {
        res.status(200).json(stocks);
    } else if (req.method === 'POST') {
        const { name, volume, avgPrice, marketPrice } = req.body;
        const existingStock = stocks.find(stock => stock.name === name);
        if (existingStock) {
            return res.status(400).json({ error: 'Stock already exists' });
        }
        const uPl = ((marketPrice - avgPrice) / avgPrice) * 100;
        stocks.push({ name, volume, avgPrice, marketPrice, uPl: uPl.toFixed(2) });
        res.status(201).json({ message: 'Stock added', stocks });
    } else if (req.method === 'PUT') {
        const { name, volume, avgPrice, marketPrice } = req.body;
        const stock = stocks.find(stock => stock.name === name);
        if (!stock) {
            return res.status(404).json({ error: 'Stock not found' });
        }
        if (volume) stock.volume = volume;
        if (avgPrice) stock.avgPrice = avgPrice;
        if (marketPrice) stock.marketPrice = marketPrice;
        stock.uPl = ((stock.marketPrice - stock.avgPrice) / stock.avgPrice) * 100;
        res.status(200).json({ message: 'Stock updated', stocks });
    } else if (req.method === 'DELETE') {
        const { name } = req.body;
        stocks = stocks.filter(stock => stock.name !== name);
        res.status(200).json({ message: 'Stock removed', stocks });
    }
}
