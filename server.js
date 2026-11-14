import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

const app = express();
app.use(cors());
app.get('/api/news', (req, res) => {
    try {
        const dbPath = path.resolve(dirName, './db.json');
        const rawData = fs.readFileSync(dbPath, 'utf-8');
        const articles = JSON.parse(rawData);
        res.status(200).json(articles);
    } catch (err) {
        res.status(500).json({message: 'Lỗi đọc file!', error: err.message});
    }
});

app.listen(5000, () =>{
    console.log('API server đang chạy!');
});