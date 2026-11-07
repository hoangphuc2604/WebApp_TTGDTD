import axios from "axios";
import * as cheerio from "cheerio";
import fs from 'fs';
import {Article} from "./articleAPI";
import {i} from "vite/dist/node/chunks/moduleRunnerTransport";

async function scrapeNews() {
    try{
        const url = "https://giaoducthoidai.vn/";
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const articles: Article[] = [];
        $('.box-story, article, .story, .timeline-item').each((i, el) => {
            const title = $(el).find('.story__title, .title, h2, h3, .box-story__title').text().trim();
            let link = $(el).find('a').attr('href')||'';
            const thumbnail = $(el).find('img').attr('src')||$(el).find('img').attr('data-src')||'https://via.placeholder.com/300x200';
            const description = $(el).find('.story__summary, .box-story__sapo, .sapo, p').text().trim();

            if (link && title) {
                if (!link.startsWith('http')) {
                    link = 'https://giaoducthoidai.vn/'+link;
                }
                articles.push({
                    author: "",
                    category: "",
                    content: "",
                    date: new Date().toISOString(),
                    description,
                    link,
                    thumbnail,
                    title,
                    id: String(i+1)
                })
            }
        });
        fs.writeFileSync('db.json', JSON.stringify(articles));
        console.log('thành công');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Lỗi cào dữ liệu:', error.message);
        }
    }
}
scrapeNews();