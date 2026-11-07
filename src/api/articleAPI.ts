import dbJson from "../../db.json";

export interface Article {
    id: string;
    title: string;
    thumbnail: string;
    description: string;
    content: string;
    author: string;
    date: string;
    link: string;
    category: string;
}
export const articles: Article[] = (dbJson as Article[]).filter(
    (a) => a.thumbnail && !a.thumbnail.startsWith("data:")
);