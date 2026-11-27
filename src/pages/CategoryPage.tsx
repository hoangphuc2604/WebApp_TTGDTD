import { useLocation, Link, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useCallback } from "react";
import Header from "../component/layout/Header";
import Footer from "../component/layout/Footer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchNews } from "../store/newsSlice";
import { useCategoryData } from "../hook/useCategoryData";
import "./CategoryPage.css";

const fallbackImage = "https://via.placeholder.com/300x200?text=No+Image";

function CategoryPage() {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { loading, articles } = useAppSelector((state) => state.news);

    const [searchParams, setSearchParams] = useSearchParams();
    const limitParam = Number(searchParams.get("limit")) || 6;
    const visibleCount = limitParam;

    const { currentSlug, categoryName, parentLabel, subLinks, sortedArticles } =
        useCategoryData();

    const scrollRef = useRef<HTMLDivElement>(null);

    const formatDate = useCallback((dateStr?: string) => {
        if (!dateStr) return "Mới cập nhật";
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? "Mới cập nhật" : d.toLocaleDateString("vi-VN");
    }, []);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.currentTarget;
        if (target.src !== fallbackImage) {
            target.src = fallbackImage;
        }
    };

    useEffect(() => {
        if (articles.length === 0) {
            dispatch(fetchNews());
        }
    }, [dispatch, articles.length]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentSlug]);

    useEffect(() => {
        document.title = `${categoryName} - Báo Giáo dục & Thời đại`;
    }, [categoryName]);

    const displayedArticles = sortedArticles.slice(0, visibleCount);
    const featuredArticle = displayedArticles[0];
    const listArticles = displayedArticles.slice(1);
    const highlightArticles = sortedArticles.slice(0, 3);
    const featuredSidebarArticles = sortedArticles.slice(3, 6);

    const handleLoadMore = () => {
        setSearchParams({ limit: (visibleCount + 5).toString() });
    };

    const scrollTags = (direction: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: direction * 220, behavior: "smooth" });
        }
    };

    return (
        <>
            <Header />
            <main className="container category-page">
                <div className="category-breadcrumb">
                    <Link to="/">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    {parentLabel ? (
                        <>
                            <span className="text-muted">{parentLabel}</span>
                            <span className="mx-2">/</span>
                            <span className="text-muted">{categoryName}</span>
                        </>
                    ) : (
                        <span className="text-muted">{categoryName}</span>
                    )}
                </div>

                <div className="category-events">
                    <i className="fa-solid fa-bolt event-icon"></i>
                    <span className="event-title">Sự kiện</span>
                    <div className="event-tags" ref={scrollRef}>
                        {sortedArticles.slice(0, 5).map((article) => {
                            const shortTag = article.title.split(" ").slice(0, 2).join(" ");
                            return (
                                <Link key={article.id} to={`/tim-kiem?q=${encodeURIComponent(shortTag)}`}>#{shortTag}</Link>
                            );
                        })}
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
                    <h4 className="text-center mt-5" style={{ color: "#c31e40" }}>
                        Đang tải bài viết...
                    </h4>
                ) : sortedArticles.length === 0 ? (
                    <div className="empty-state">
                        <i className="fa-regular fa-folder-open"></i>
                        <h4>Chuyên mục này chưa có bài viết nào.</h4>
                        <p>Vui lòng quay lại sau hoặc khám phá các chuyên mục khác.</p>
                    </div>
                ) : (
                    <div className="category-content">
                        <div className="category-main">
                            {featuredArticle && (
                                <article className="featured-article">
                                    <Link to={`/bai-viet/${featuredArticle.id}`}>
                                        <img
                                            src={featuredArticle.thumbnail}
                                            alt={featuredArticle.title}
                                            onError={handleImageError}
                                        />
                                    </Link>
                                    <h2 className="featured-title">
                                        <Link to={`/bai-viet/${featuredArticle.id}`}>
                                            {featuredArticle.title}
                                        </Link>
                                    </h2>
                                    <time>{formatDate(featuredArticle.date)}</time>
                                    <p className="featured-desc">
                                        {featuredArticle.description || "Đang cập nhật nội dung..."}
                                    </p>
                                </article>
                            )}

                            <div className="category-list">
                                {listArticles.map((article) => (
                                    <article key={article.id} className="list-item">
                                        <Link to={`/bai-viet/${article.id}`} className="list-thumb">
                                            <img
                                                src={article.thumbnail}
                                                alt={article.title}
                                                onError={handleImageError}
                                            />
                                        </Link>
                                        <div className="list-info">
                                            <h3>
                                                <Link to={`/bai-viet/${article.id}`}>{article.title}</Link>
                                            </h3>
                                            <time>{formatDate(article.date)}</time>
                                            <p>{article.description || "Đang cập nhật nội dung..."}</p>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {visibleCount < sortedArticles.length && (
                                <div className="text-center mt-4 mb-5">
                                    <button className="btn-load-more" onClick={handleLoadMore}>
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
                                            <img
                                                src={article.thumbnail}
                                                alt={article.title}
                                                onError={handleImageError}
                                            />
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
                                            <img
                                                src={article.thumbnail}
                                                alt={article.title}
                                                onError={handleImageError}
                                            />
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