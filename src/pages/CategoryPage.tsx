import { useParams, useLocation, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Header from "../component/layout/Header";
import Footer from "../component/layout/Footer";
import { menuItems } from "../component/layout/Header";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchNews } from "../store/newsSlice";
import "./CategoryPage.css";

function CategoryPage() {
    const { slug } = useParams<{ slug: string }>();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { articles, loading } = useAppSelector((state) => state.news);

    const [visibleCount, setVisibleCount] = useState(6);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (articles.length === 0) {
            dispatch(fetchNews());
        }
    }, [dispatch, articles.length]);

    const parentCategory = menuItems.find((item) => {
        if (item.path.includes(slug || "")) return true;
        if (item.children) {
            return item.children.some((child) => child.path.includes(slug || ""));
        }
        return false;
    });

    const categoryName = parentCategory ? parentCategory.label : "Danh mục";
    const subLinks = parentCategory?.children || [];

    const sortedArticles = [...articles].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (isNaN(dateA) || isNaN(dateB)) return 0;
        return dateB - dateA;
    });

    const validArticles = sortedArticles.filter((_, index) => index % 3 === 0);

    const displayedArticles = validArticles.slice(0, visibleCount);

    const featuredArticle = displayedArticles[0];
    const listArticles = displayedArticles.slice(1);
    const highlightArticles = validArticles.slice(0, 3);
    const featuredSidebarArticles = validArticles.slice(3, 6);

    const scrollTags = (direction: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: direction * 200, behavior: "smooth" });
        }
    };

    return (
        <>
            <Header />
            <main className="container category-page">
                <div className="category-events">
                    <i className="fa-solid fa-bolt event-icon"></i>
                    <span className="event-title">Sự kiện</span>
                    <div className="event-tags" ref={scrollRef}>
                        <span>#Tổng rà soát hệ thống văn bản quy phạm pháp luật</span>
                        <span>#Giáo dục nghề nghiệp 2026</span>
                        <span>#Kỳ thi tốt nghiệp THPT</span>
                        <span>#Tuyển sinh đại học</span>
                        <span>#Đổi mới giáo dục</span>
                    </div>
                    <div className="event-arrows">
                        <i className="fa-solid fa-caret-left" onClick={() => scrollTags(-1)}></i>
                        <i className="fa-solid fa-caret-right" onClick={() => scrollTags(1)}></i>
                    </div>
                </div>

                <div className="category-header">
                    <h1 className="category-title">{categoryName}</h1>
                    <div className="category-sublinks">
                        {subLinks.map((sub) => (
                            <Link
                                key={sub.path}
                                to={sub.path}
                                className={`sub-link ${location.pathname === sub.path ? "active" : ""}`}
                            >
                                {sub.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {loading && articles.length === 0 ? (
                    <h4 className="text-center mt-5" style={{ color: "red" }}>
                        Đang tải bài viết...
                    </h4>
                ) : (
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
                                    <p className="featured-desc">
                                        {featuredArticle.description || "Đang cập nhật nội dung..."}
                                    </p>
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

                            {visibleCount < validArticles.length && (
                                <div className="text-center mt-4 mb-5">
                                    <button
                                        className="btn-load-more"
                                        onClick={() => setVisibleCount(prev => prev + 5)}
                                    >
                                        Xem thêm
                                    </button>
                                </div>
                            )}
                        </div>

                        <aside className="category-sidebar">
                            <div className="sidebar-box">
                                <h3 className="sidebar-title">Tin tiêu điểm</h3>
                                {highlightArticles.map((article) => (
                                    <article key={article.id} className="sidebar-item">
                                        <Link to={`/bai-viet/${article.id}`}>
                                            <img src={article.thumbnail} alt={article.title} />
                                        </Link>
                                        <h4>
                                            <Link to={`/bai-viet/${article.id}`}>{article.title}</Link>
                                        </h4>
                                    </article>
                                ))}
                            </div>

                            <div className="sidebar-box sticky-box">
                                <h3 className="sidebar-title">Tin nổi bật</h3>
                                {featuredSidebarArticles.map((article) => (
                                    <article key={article.id} className="sidebar-item">
                                        <Link to={`/bai-viet/${article.id}`}>
                                            <img src={article.thumbnail} alt={article.title} />
                                        </Link>
                                        <h4>
                                            <Link to={`/bai-viet/${article.id}`}>{article.title}</Link>
                                        </h4>
                                    </article>
                                ))}
                            </div>
                        </aside>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}

export default CategoryPage;