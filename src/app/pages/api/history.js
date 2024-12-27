import * as XLSX from 'xlsx';

let history = [];

export default function handler(req, res) {
    if (req.method === 'GET') {
        res.status(200).json(history);
    } else if (req.method === 'POST') {
        const { action, stockName, timestamp } = req.body;
        history.push({ action, stockName, timestamp });
        res.status(201).json({ message: 'History logged', history });
    } else if (req.method === 'POST' && req.query.export === 'excel') {
        const worksheet = XLSX.utils.json_to_sheet(history);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'History');
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        res.setHeader('Content-Disposition', 'attachment; filename=history.xlsx');
        res.send(buffer);
    }
}
