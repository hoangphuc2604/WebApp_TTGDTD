import express from 'express';
import cors from 'cors';
import Parser from 'rss-parser';

const app = express();
app.use(cors());

const parser = new Parser({ timeout: 20000 });

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const RSS_FEEDS = [
    { url: 'https://giaoducthoidai.vn/rss/home.rss', category: 'tin-moi-nhat' },
    { url: 'https://giaoducthoidai.vn/rss/giao-duc.rss', category: 'giao-duc' },
    { url: 'https://giaoducthoidai.vn/rss/chinh-sach-27.rss', category: 'chinh-sach' },
    { url: 'https://giaoducthoidai.vn/rss/dia-phuong-78.rss', category: 'dia-phuong' },
    { url: 'https://giaoducthoidai.vn/rss/thoi-su.rss', category: 'thoi-su' },
    { url: 'https://giaoducthoidai.vn/rss/phap-luat-phap-luat.rss', category: 'giao-duc-phap-luat' },
    { url: 'https://giaoducthoidai.vn/rss/ket-noi.rss', category: 'ket-noi' },
    { url: 'https://giaoducthoidai.vn/rss/trao-doi.rss', category: 'trao-doi' },
    { url: 'https://giaoducthoidai.vn/rss/hoc-duong.rss', category: 'hoc-duong' },
    { url: 'https://giaoducthoidai.vn/rss/nhan-ai.rss', category: 'nhan-ai' },
    { url: 'https://giaoducthoidai.vn/rss/the-gioi.rss', category: 'the-gioi' },
    { url: 'https://giaoducthoidai.vn/rss/suc-khoe.rss', category: 'suc-khoe' },
    { url: 'https://giaoducthoidai.vn/rss/van-hoa.rss', category: 'van-hoa' },
    { url: 'https://giaoducthoidai.vn/rss/the-thao.rss', category: 'the-thao' },
];

async function fetchAndParseRss(feed) {
    const response = await fetch(feed.url, {
        headers: {
            'User-Agent': USER_AGENT,
            'Accept': 'application/rss+xml, application/xml, text/xml, */*',
            'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const xml = await response.text();

    if (!xml || xml.trim().length === 0) {
        throw new Error('Response rỗng');
    }

    if (xml.trim().startsWith('<!DOCTYPE html') || xml.trim().startsWith('<html')) {
        throw new Error('Nhận về HTML thay vì RSS (có thể bị chặn)');
    }

    const parsed = await parser.parseString(xml);
    return parsed;
}

function mapItemToArticle(item, feed, index) {
    let thumbnail = item.enclosure?.url || '';

    if (!thumbnail && item.content) {
        const match = item.content.match(/src="([^"]+)"/);
        if (match) thumbnail = match[1];
    }

    if (!thumbnail && item['content:encoded']) {
        const match = item['content:encoded'].match(/src="([^"]+)"/);
        if (match) thumbnail = match[1];
    }

    return {
        id: `${feed.category}-${index}`,
        title: item.title || '',
        thumbnail: thumbnail || 'https://via.placeholder.com/300x200?text=No+Image',
        description: item.contentSnippet || item.content || '',
        content: item.content || item['content:encoded'] || '',
        author: item.creator || item.author || 'Ban Biên Tập',
        date: item.pubDate || item.isoDate || new Date().toISOString(),
        link: item.link || '',
        category: feed.category,
    };
}

app.get('/api/news', async (req, res) => {
    const debug = req.query.debug === '1';
    const diagnostics = [];

    try {
        const fetchPromises = RSS_FEEDS.map(async (feed) => {
            try {
                const parsed = await fetchAndParseRss(feed);
                const items = (parsed.items || []).map((item, index) =>
                    mapItemToArticle(item, feed, index)
                );
                diagnostics.push({
                    feed: feed.category,
                    url: feed.url,
                    status: 'OK',
                    count: items.length,
                });

                return items;
            } catch (e) {
                diagnostics.push({
                    feed: feed.category,
                    url: feed.url,
                    status: 'FAIL',
                    error: e.message,
                });
                return [];
            }
        });

        const results = await Promise.all(fetchPromises);
        let allArticles = [];
        results.forEach((items) => {
            allArticles = [...allArticles, ...items];
        });

        allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (debug) {
            return res.status(200).json({
                total: allArticles.length,
                diagnostics,
                sample: allArticles.slice(0, 2),
            });
        }

        res.status(200).json(allArticles);
    } catch (err) {
        console.error('[API ERROR]', err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
});

app.listen(5000, () => {
    console.log('API RSS Server đang chạy tại http://localhost:5000');
});