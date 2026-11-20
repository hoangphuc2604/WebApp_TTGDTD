import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../component/layout/Header";
import Footer from "../component/layout/Footer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchNews } from "../store/newsSlice";
import "./news-detail.css";

const fallbackImage = "https://via.placeholder.com/300x200?text=No+Image";

function ArticlePage() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { articles, loading } = useAppSelector((state) => state.news);
    const [fullHtml, setFullHtml] = useState<string>("");
    const [isFetchingFull, setIsFetchingFull] = useState(false);

    useEffect(() => {
        if (articles.length === 0) {
            dispatch(fetchNews());
        }
    }, [dispatch, articles.length]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const article = articles.find((a) => a.id === id);

    useEffect(() => {
        if (article && article.link){
            setIsFetchingFull(true);
            fetch(`http://localhost:5000/api/news/detail?url=${encodeURIComponent(article.link)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.fullContent){
                        setFullHtml(data.fullContent);
                    }
                    setIsFetchingFull(false);
                })
                .catch(() => setIsFetchingFull(false));
        }
    }, [article]);

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
                    <Link to="/" className="btn btn-danger">
                        ← Về trang chủ
                    </Link>
                </main>
                <Footer />
            </>
        );
    }

    const related = articles
        .filter((a) => a.category === article.category && a.id !== article.id)
        .slice(0, 4);

    const bodyHtml =
            fullHtml || article.content
            || `<p>${article.description || "Nội dung bài viết đang được cập nhật."}</p>`;

    return (
        <>
            <Header />
            <main className="container mt-4 mb-5 article-detail-page">
                <nav className="article-detail-breadcrumb">
                    <Link to="/">Trang chủ</Link>
                    <span> / </span>
                    <span>Bài viết</span>
                </nav>

                <div className="row">
                    <div className="col-md-8">
                        <article>
                            <h1 className="article-detail-title">{article.title}</h1>

                            <p className="article-detail-meta">
                                Tác giả: {article.author || "Ban Biên tập"}
                                {" • "}
                                {new Date(article.date).toLocaleDateString("vi-VN")}
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
                        </article>
                    </div>

                    <div className="col-md-4">
                        <aside className="article-related-sidebar">
                            <h4>Tin liên quan</h4>
                            {related.map((r) => (
                                <Link
                                    to={`/bai-viet/${r.id}`}
                                    key={r.id}
                                    className="article-related-item"
                                >
                                    <img
                                        src={r.thumbnail}
                                        alt={r.title}
                                        className="article-related-thumb"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = fallbackImage;
                                        }}
                                    />
                                    <span>{r.title}</span>
                                </Link>
                            ))}
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default ArticlePage;