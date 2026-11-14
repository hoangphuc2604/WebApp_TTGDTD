import { useParams, Link } from "react-router-dom";
import Header from "../component/layout/Header";
import Footer from "../component/layout/Footer";
import { articles } from "../api/articleAPI";
import { menuItems } from "../component/layout/Header";
import "./CategoryPage.css";

function CategoryPage() {
    const { slug } = useParams<{ slug: string }>();

    const parentCategory = menuItems.find((item) => {
        if (item.path.includes(slug || "")) return true;
        if (item.children) {
            return item.children.some((child) => child.path.includes(slug || ""));
        }
        return false;
    });

    const categoryName = parentCategory ? parentCategory.label : "Danh mục";
    const subLinks = parentCategory?.children || [];

    const safeArticles = articles || [];
    const filteredArticles = safeArticles.filter((_, index) => index % 3 === 0);

    const featuredArticle = filteredArticles[0];
    const listArticles = filteredArticles.slice(1, 6);
    const highlightArticles = filteredArticles.slice(1, 4);

    return (
        <>
            <Header />
            <main className="container category-page">
                <div className="category-events">
                    <i className="fa-solid fa-bolt event-icon"></i>
                    <span className="event-title">Sự kiện</span>
                    <div className="event-tags">
                        <span>#Tổng rà soát hệ thống văn bản quy phạm pháp luật</span>
                        <span>#Giáo dục nghề nghiệp 2026</span>
                        <span>#Tổng rà soát...</span>
                    </div>
                    <div className="event-arrows">
                        <i className="fa-solid fa-caret-left"></i>
                        <i className="fa-solid fa-caret-right"></i>
                    </div>
                </div>

                <div className="category-header">
                    <h1 className="category-title">{categoryName}</h1>
                    <div className="category-sublinks">
                        {subLinks.map((sub) => (
                            <Link key={sub.path} to={sub.path} className="sub-link">
                                {sub.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="category-content">
                    <div className="category-main">
                        {featuredArticle && (
                            <article className="featured-article">
                                <Link to={`/bai-viet/${featuredArticle.id}`}>
                                    <img src={featuredArticle.thumbnail} alt={featuredArticle.title} />
                                </Link>
                                <h2 className="featured-title">
                                    <Link to={`/bai-viet/${featuredArticle.id}`}>
                                        {featuredArticle.title}
                                    </Link>
                                </h2>
                                <time>{new Date(featuredArticle.date).toLocaleString("vi-VN")}</time>
                                <p className="featured-desc">{featuredArticle.description || "Đang cập nhật nội dung..."}</p>
                            </article>
                        )}

                        <div className="category-list">
                            {listArticles.map((article) => (
                                <article key={article.id} className="list-item">
                                    <Link to={`/bai-viet/${article.id}`} className="list-thumb">
                                        <img src={article.thumbnail} alt={article.title} />
                                    </Link>
                                    <div className="list-info">
                                        <h3>
                                            <Link to={`/bai-viet/${article.id}`}>{article.title}</Link>
                                        </h3>
                                        <time>{new Date(article.date).toLocaleString("vi-VN")}</time>
                                        <p>{article.description || "Đang cập nhật nội dung..."}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    <aside className="category-sidebar">
                        <div className="sidebar-box">
                            <h3 className="sidebar-title">Tin tiêu điểm</h3>
                            {listArticles.slice(0, 2).map((article) => (
                                <article key={article.id} className="sidebar-item">
                                    <Link to={`/bai-viet/${article.id}`}>
                                        <img src={article.thumbnail} alt={article.title} />
                                    </Link>
                                    <h4><Link to={`/bai-viet/${article.id}`}>{article.title}</Link></h4>
                                </article>
                            ))}
                        </div>

                        <div className="sidebar-box">
                            <h3 className="sidebar-title">Tin nổi bật</h3>
                            {highlightArticles.map((article) => (
                                <article key={article.id} className="sidebar-item">
                                    <Link to={`/bai-viet/${article.id}`}>
                                        <img src={article.thumbnail} alt={article.title} />
                                    </Link>
                                    <h4><Link to={`/bai-viet/${article.id}`}>{article.title}</Link></h4>
                                </article>
                            ))}
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default CategoryPage;