import Header from '../component/layout/Header';
import Footer from '../component/layout/Footer';

function HomePage() {
    return (
        <>
            <Header />
            <main
                className="container mt-4"
                style={{ minHeight: '60vh' }}
            >
            </main>
            <Footer />
        </>
    );
}

export default HomePage;