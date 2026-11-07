import { useParams, Link } from "react-router-dom";
import Header from "../component/layout/Header";
import Footer from "../component/layout/Footer";
import { articles } from "../api/articleAPI";
import "./news-detail.css";

function ArticlePage() {
    const { id } = useParams<{ id: string }>();
    const article = articles.find((a) => a.id === id);

    if (!article) {
        return (
            <>
                <Header />
                <main
                    className="container mt-4 mb-5"
                    style={{ minHeight: "60vh" }}
                >
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
        .filter((a) => a.id !== article.id)
        .slice(0, 4);

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
                            <h1 className="article-detail-title">
                                {article.title}
                            </h1>

                            <p className="article-detail-meta">
                                Tác giả: {article.author || "Ban Biên tập"}
                                {" • "}
                                {new Date(article.date).toLocaleDateString(
                                    "vi-VN"
                                )}
                            </p>

                            <img
                                src={article.thumbnail}
                                alt={article.title}
                                className="article-detail-thumbnail"
                            />

                            <div className="article-detail-body">
                                {article.description ? (
                                    <p>{article.description}</p>
                                ) : (
                                    <p className="text-muted">
                                        Nội dung bài viết đang được cập nhật.
                                        Vui lòng đọc bài gốc bên dưới.
                                    </p>
                                )}
                            </div>

                            {article.link && (
                                <a
                                    href={article.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-danger mt-3"
                                >
                                    Đọc bài gốc trên giaoducthoidai.vn →
                                </a>
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