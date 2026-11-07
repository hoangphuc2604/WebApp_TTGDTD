import Header from '../component/layout/Header';
import Footer from '../component/layout/Footer';
import { mockArticles } from '../api/articleAPI';

function HomePage() {
    return (
        <>
            <Header />
            <main className="container mt-4" style={{ minHeight: '60vh' }}>
                <h3>TIN TỨC MỚI NHẤT</h3>
                <hr/>
                {mockArticles.map((article) => (
                    <div key={article.id} style={{marginBottom: '20px'}}>
                        <h5>{article.title}</h5>
                        <p>{article.description}</p>
                    </div>
                ))}
            </main>
            <Footer />
        </>
    );
}

export default HomePage;