import Header from '../component/layout/Header';
import Footer from '../component/layout/Footer';
import { mockArticles } from '../api/articleAPI';
import './HomePage.css';

function HomePage() {
    return (
        <>
            <Header />
            <main className="container mt-4 mb-5 news-container">
                <h3 className="mb-4 fw-bold news-section-title">
                    TIN TỨC MỚI NHẤT
                </h3>
                <hr/>
                <div className="row">
                    {mockArticles.map((article) => (
                        <div className="col-md-4 mb-4" key={article.id}>
                            <div className="card h-100 shadow-sm article-card">
                                <img src={article.thumbnail}
                                     className="card-img-top article-thumbnail"
                                     alt={article.title}
                                />

                                <div className="card-body">
                                    <h5 className="card-title fw-bold article-title">{article.title}</h5>
                                    <p className="card-text text-muted mt-2 article-desc">{article.description}</p>
                                </div>

                                <div className="card-footer bg-white border-top text-muted d-flex justify-content-between article-meta">
                                    <span>Tác giả: {article.author}</span>
                                    <span>{article.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    );
}

export default HomePage;