import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState, useCallback } from "react";
import Header from "../component/layout/Header";
import Footer from "../component/layout/Footer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchNews } from "../store/newsSlice";
import { menuItems } from "../component/layout/Header";
import "./news-detail.css";

const fallbackImage = "https://via.placeholder.com/300x200?text=No+Image";

function ArticlePage() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { articles, loading } = useAppSelector((state) => state.news);

    const [fullHtml, setFullHtml] = useState<string>("");
    const [isFetchingFull, setIsFetchingFull] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [commentText, setCommentText] = useState("");
    const [visibleCount, setVisibleCount] = useState(4);
    const [loadCount, setLoadCount] = useState(0);
    const [isScrollLoading, setIsScrollLoading] = useState(false);
    const [slideIndex, setSlideIndex] = useState(0);

    const formatDate = useCallback((dateStr?: string) => {
        if (!dateStr) return "Mới cập nhật";
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? "Mới cập nhật" : d.toLocaleDateString("vi-VN");
    }, []);

    useEffect(() => {
        if (articles.length === 0) {
            dispatch(fetchNews());
        }
    }, [dispatch, articles.length]);

    useEffect(() => {
        window.scrollTo(0, 0);
        setVisibleCount(4);
        setLoadCount(0);
        setSlideIndex(0);
        setFullHtml("");
        setTags([]);
        setIsScrollLoading(false);
    }, [id]);

    const article = articles.find((a) => a.id === id);

    useEffect(() => {
        if (!article || !article.link) return;

        const controller = new AbortController();
        const signal = controller.signal;

        setIsFetchingFull(true);
        fetch(`http://localhost:5000/api/news/detail?url=${encodeURIComponent(article.link)}`, { signal })
            .then((res) => {
                if (!res.ok) throw new Error("Lỗi mạng");
                return res.json();
            })
            .then((data) => {
                if (data.fullContent) {
                    setFullHtml(data.fullContent);
                }
                if(Array.isArray(data.tags)){
                    setTags(data.tags);
                }
                setIsFetchingFull(false);
            })
            .catch((err) => {
                if (err.name !== "AbortError") {
                    setIsFetchingFull(false);
                }
            });

        return () => {
            controller.abort();
        };
    }, [article]);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (loadCount >= 6 || isScrollLoading) return;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 400) {
                        setIsScrollLoading(true);
                        setTimeout(() => {
                            setVisibleCount((prev) => prev + 4);
                            setLoadCount((prev) => prev + 1);
                            setIsScrollLoading(false);
                        }, 400);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loadCount, isScrollLoading]);

    const parentCategory = menuItems.find((item) => item.path.includes(article?.category || ""));
    const categoryName = parentCategory ? parentCategory.label : "GIÁO DỤC";
    const subLinks = parentCategory?.children || [];

    const related = articles
        .filter((a) => a.category === article?.category && a.id !== article?.id)
        .slice(0, 4);

    const sameCategoryArticles = articles
        .filter((a) => a.category === article?.category && a.id !== article?.id)
        .slice(4, 13);

    const maxSlides = Math.ceil(sameCategoryArticles.length / 3) || 1;

    useEffect(() => {
        if (sameCategoryArticles.length === 0) return;

        const timer = setInterval(() => {
            setSlideIndex((prev) => (prev + 1) % maxSlides);
        }, 3500);

        return () => clearInterval(timer);
    }, [sameCategoryArticles.length, maxSlides]);

    if (loading && articles.length === 0) {
        return (
            <>
                <Header />
                <main className="container mt-4 mb-5" style={{ minHeight: "60vh" }}>
                    <h3 className="text-center">Đang tải bài viết...</h3>
                </main>
                <Footer />
            </>
        );
    }

    if (!article) {
        return (
            <>
                <Header />
                <main className="container mt-4 mb-5" style={{ minHeight: "60vh" }}>
                    <h3 className="mb-3">Không tìm thấy bài viết</h3>
                    <Link to="/" className="btn btn-danger">← Về trang chủ</Link>
                </main>
                <Footer />
            </>
        );
    }

    const availableArticles = articles.filter((a) => a.id !== article.id);
    const dontMissArticles = availableArticles.slice(0, visibleCount);

    const handleLoadMoreClick = () => {
        setVisibleCount((prev) => prev + 4);
    };

    const bodyHtml =
        fullHtml || article.content
        || `<p>${article.description || "Nội dung bài viết đang được cập nhật."}</p>`;

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Tính năng bình luận đang được phát triển!");
        setCommentText("");
    };

    const currentUrl = window.location.href;

    return (
        <>
            <Header />
            <main className="container mt-4 mb-5 article-detail-page">
                <div className="row">
                    <div className="col-lg-9 position-relative">
                        <div className="floating-social-bar">
                            <a href={`https://zalo.me/share?u=${currentUrl}`} target="_blank" rel="noreferrer" className="social-btn zalo">Zalo</a>
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`} target="_blank" rel="noreferrer" className="social-btn"><i className="fa-brands fa-facebook-f"></i></a>
                            <button onClick={() => window.print()} className="social-btn"><i className="fa-solid fa-print"></i></button>
                        </div>

                        <div className="article-category-header">
                            <h2 className="cat-title">{categoryName}</h2>
                            <div className="cat-sublinks">
                                {subLinks.map(sub => (
                                    <Link key={sub.path} to={sub.path}>{sub.label}</Link>
                                ))}
                            </div>
                        </div>

                        <article>
                            <h1 className="article-detail-title">{article.title}</h1>

                            <div className="article-meta-wrapper">
                                <span className="author">{article.author || "Hà Nguyễn"}</span>
                                <span className="date">{formatDate(article.date)} (GMT+7)</span>
                            </div>

                            <p className="article-sapo">
                                {article.description || "Nội dung bài viết đang được cập nhật."}
                            </p>

                            <img
                                src={article.thumbnail}
                                alt={article.title}
                                className="article-detail-thumbnail"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = fallbackImage;
                                }}
                            />

                            {isFetchingFull ? (
                                <p className="text-center text-muted my-4">Đang tải nội dung toàn bộ bài báo...</p>
                            ) : (
                                <div
                                    className="article-detail-body"
                                    dangerouslySetInnerHTML={{ __html: bodyHtml }}
                                />
                            )}

                            <div className="article-tags mt-4 mb-5">
                                <Link to={`/chuyen-muc/${article.category}`} className="tag-item">
                                    {parentCategory ? parentCategory.label : (article.category || "Giáo dục")}
                                </Link>
                                {tags
                                    .filter((tag) =>
                                        tag.toLowerCase() !== (article.category || "").toLowerCase() &&
                                        tag.toLowerCase() !== categoryName.toLowerCase()
                                    )
                                    .map((tag, index) => (
                                        <span key={index} className="tag-item">
                                            {tag}
                                        </span>
                                    ))}
                                {!isFetchingFull && tags.length === 0 && (
                                    <span className="tag-item">Tin tức</span>
                                )}
                            </div>

                            {related.length > 0 && (
                                <div className="box-tin-lien-quan mb-5">
                                    <h4 className="title-tin-lien-quan">TIN LIÊN QUAN</h4>
                                    <ul>
                                        {related.map((r) => (
                                            <li key={r.id}>
                                                <Link to={`/bai-viet/${r.id}`}>{r.title}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="comment-section mb-5">
                                <h4 className="comment-title">Bình luận</h4>
                                <form onSubmit={handleCommentSubmit}>
                                    <textarea
                                        className="form-control comment-input"
                                        rows={3}
                                        placeholder="* Ý kiến của bạn sẽ được biên tập trước khi đăng. Xin vui lòng gõ Tiếng Việt có dấu."
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                    ></textarea>
                                    <div className="text-end mt-2">
                                        <button type="submit" className="btn btn-danger">Gửi bình luận</button>
                                    </div>
                                </form>
                            </div>

                            {sameCategoryArticles.length > 0 && (
                                <div className="box-cung-chuyen-muc mb-5">
                                    <div className="cung-chuyen-muc-header">
                                        <h4>CÙNG CHUYÊN MỤC</h4>
                                        <div className="slider-dots">
                                            {Array.from({ length: maxSlides }).map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={`dot ${slideIndex === i ? "active" : ""}`}
                                                    onClick={() => setSlideIndex(i)}
                                                ></span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="cung-chuyen-muc-wrapper">
                                        <div
                                            className="cung-chuyen-muc-track"
                                            style={{ transform: `translateX(-${slideIndex * 100}%)` }}
                                        >
                                            {sameCategoryArticles.map((item) => (
                                                <div key={item.id} className="cung-chuyen-muc-item">
                                                    <Link to={`/bai-viet/${item.id}`}>
                                                        <img
                                                            src={item.thumbnail}
                                                            alt={item.title}
                                                            onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage; }}
                                                        />
                                                        <h5>{item.title}</h5>
                                                        <span className="time">{formatDate(item.date)}</span>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {dontMissArticles.length > 0 && (
                                <div className="box-dung-bo-lo mb-5">
                                    <h4 className="title-dung-bo-lo">ĐỪNG BỎ LỠ</h4>
                                    <div className="dung-bo-lo-list">
                                        {dontMissArticles.map((item) => (
                                            <div key={item.id} className="dung-bo-lo-item">
                                                <Link to={`/bai-viet/${item.id}`} className="dung-bo-lo-thumb">
                                                    <img
                                                        src={item.thumbnail}
                                                        alt={item.title}
                                                        onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage; }}
                                                    />
                                                </Link>
                                                <div className="dung-bo-lo-info">
                                                    <h5>
                                                        <Link to={`/bai-viet/${item.id}`}>{item.title}</Link>
                                                    </h5>
                                                    <span className="time">{formatDate(item.date)}</span>
                                                    <p>{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {isScrollLoading && (
                                        <div className="text-center py-3 my-2 text-danger fw-semibold small">
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Đang tải thêm bài viết...
                                        </div>
                                    )}

                                    {!isScrollLoading && loadCount >= 6 && visibleCount < availableArticles.length && (
                                        <div className="text-center mt-4">
                                            <button className="btn-load-more" onClick={handleLoadMoreClick}>
                                                Xem thêm
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </article>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default ArticlePage;