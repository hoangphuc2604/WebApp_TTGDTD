import Header from '../component/layout/Header';
import Footer from '../component/layout/Footer';
import NewsGroup from "../component/news/NewsGroup";
import { articles } from '../api/articleAPI';
import './HomePage.css';

const GROUPS =[
    {
        heading: "Tin mới nhất",
        subLinks: [
            { label: "Giáo dục", path: "/chuyen-muc/giao-duc" },
            { label: "Thời sự", path: "/chuyen-muc/thoi-su" },
            { label: "Pháp luật", path: "/chuyen-muc/giao-duc-phap-luat" },
        ],
    },
    { heading: "Tin nổi bật" },
    { heading: "Đọc nhiều" },
    { heading: "Xem thêm" },
]
function chunk<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
    return result;
}
function HomePage() {
    const groups = chunk(articles, 5);

    return (
        <>
            <Header />
            <main className="container mt-4 mb-5 news-container">
                {groups.map((group, i) => {
                    const config = GROUPS[i] ?? {};
                    return (
                        <NewsGroup
                            key={i}
                            articles={group}
                            heading={config.heading}
                            subLinks={config.subLinks}
                        />
                    );
                })}
            </main>
            <Footer />
        </>
    );
}

export default HomePage;