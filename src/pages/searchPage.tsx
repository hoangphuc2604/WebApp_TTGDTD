import React, {useEffect, useMemo, useState} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import Header from '../component/layout/Header';
import Footer from '../component/layout/Footer';
import { articles } from '../api/articleAPI';
import './searchPage.css';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store";
import {executeSearch, SortOrder} from "../store/articlesSlice";
import {i} from "vite/dist/node/chunks/moduleRunnerTransport";

function formatDate(date: string) {
    if(!date) return '';
    if(/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
        return date;
    }
    const parsedDate = new Date(date);
    if(isNaN(parsedDate.getTime())) {
        return date;
    } else {
        parsedDate.toLocaleDateString('vi-VN');
    }
}
function HighlightText({text,keywords}: {text: string, keywords: string}) {
    const clean = keywords.trim();
    if(!clean) return <>{text}</>;
    const escaped = clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
    return (
        <>
            {parts.map((part, i) => {
                if(part.toLowerCase() === clean.toLowerCase()){
                    return (
                        <mark key={i} className="gdtd-highlight">
                            {part}
                        </mark>
                    )
                } else {
                    return (
                        <React.Fragment key={i}>
                            {part}
                        </React.Fragment>
                    )
                }
            })}
        </>
    );
}
function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch<AppDispatch>();
    const {results, keywords, category, sortBy} = useSelector((state: RootState) => state.search);
    const urlKeywords = searchParams.get('q')||'';
    const [inputText, setInputText] = useState(urlKeywords);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const availableCategories = useMemo(()=>{
        const set = new Set<string>();
        articles.forEach(article => {
            if(article.category &&  article.category.trim()) set.add(article.category.trim());
        })
        return Array.from(set);
    },[]);
    useEffect(() => {
        setInputText(urlKeywords);
        dispatch(executeSearch({keywords: urlKeywords}));
        setCurrentPage(1);
    }, [urlKeywords, dispatch]);
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const text = inputText.trim();
        setSearchParams(text?{q:text}:{});
        dispatch(executeSearch({keywords: text}));
        setCurrentPage(1);
    }
    const handleCategoryChange = (newCategory: string) => {
        dispatch(executeSearch({category: newCategory}));
        setCurrentPage(1);
    }
    const handleSortChange = (newSort: SortOrder) => {
        dispatch(executeSearch({sortBy: newSort}));
        setCurrentPage(1);
    }
    const totalPages = Math.ceil(results.length / itemsPerPage);
    const currentItems = results.slice((currentPage-1) * itemsPerPage, currentPage * itemsPerPage);
    return (
        <>
            <Header />
            <main className="container mt-3 mb-5">
                <nav className="gdtd-breadcrumb mb-3">
                    <Link to="/">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <span className="text-muted">Tìm kiếm</span>
                </nav>
                <h1 className="gdtd-section-heading">Tìm kiếm</h1>
                <div className="row">
                    <div className="col-lg-8 pe-lg-4">
                        <div className="gdtd-search-box mb-3">
                            <form onSubmit={handleFormSubmit} className="row g-2">
                                <div className="col-md-5">
                                    <input type="text" className="form-control" placeholder="Nhập từ khóa tìm kiếm..." value={inputText} onChange={(newText) => setInputText(newText.target.value)} />
                                </div>
                                <div className="col-md-3">
                                    <select className="form-select" value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
                                        <option value="all">Tất cả</option>
                                        {availableCategories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <select className="form-select" value={sortBy} onChange={(e) => handleSortChange(e.target.value as SortOrder)}>
                                        <option value="newest">Mới nhất</option>
                                        <option value="oldest">Cũ nhất</option>
                                    </select>
                                </div>
                                <div className="col-md-2 d-grid">
                                    <button type="submit" className="btn gdtd-btn fw-semibold">
                                        Tìm kiếm
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-3 pd-2 border-bottom">
                            <span className="small text-muted">
                                Tìm thấy <strong className="gdtd-color">{results.length}</strong> bài viết
                                {keywords &&(
                                    <>
                                        {' '} vơi từ khóa <strong>"{keywords}"</strong>
                                    </>
                                )}
                            </span>
                        </div>
                        {currentItems.length===0?(
                            <div className="alert alert-light border text-center py-5 my-3">
                                <p className="mb-1 fw-semibold">Không tìm thấy bài viết nào phù hợp.</p>
                                <small className="text-muted">
                                    Vui lòng thử lại với từ khóa ngắn gọn hơn hoặc chọn chuyên mục khác.
                                </small>
                            </div>
                        ):(
                            <div>
                                {currentItems.map((item) => (
                                    <article key={item.id} className="gdtd-result-item">
                                        <a href={item.link||'#'} target="_blank" rel="noreferrer" className="gdtd-result-thumb-wrap">
                                            <img src={item.thumbnail} alt={item.title} className="gdtd-result-thumb" />
                                        </a>
                                        <div className="flex-grow-1">
                                            <a href={item.link} target="_blank" rel="noreferrer" className="gdtd-result-title">
                                                <HighlightText text={item.title} keywords={keywords} />
                                            </a>
                                            <div className="gdtd-result-meta">
                                                <span className="gdtd-result-category">
                                                    {item.category||'Giáo dục'}
                                                </span>
                                                <span>•</span>
                                                <span>{formatDate(item.date)}</span>
                                            </div>
                                            <p className="gdtd-result-sapo">
                                                <HighlightText text={item.description} keywords={keywords} />
                                            </p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                        {totalPages > 1 &&(
                            <nav className="mt-4">
                                <ul className="pagination justify-content-center gdtd-pagination">
                                    {Array.from({length: itemsPerPage}, (_, i) => i+1).map((page) =>(
                                        <li key={page} className={`page-item ${currentPage === page ? 'active':''}`}>
                                            <button className="page-link" onClick={() => {
                                                setCurrentPage(page);
                                                window.scrollTo({top:0,behavior:'smooth'});
                                            }}>
                                                {page}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}
                    </div>
                    <aside className="col-lg-4">
                        <div className="gdtd-sidebar-box">
                            <h2 className="gdtd-sidebar-heading">Tin đọc nhiều</h2>
                            <div>
                                {articles.slice(0,6).map((item, index) => (
                                    <div key={item.id} className="gdtd-most-read-item">
                                        <span className={`gdtd-rank-num ${index<3 ?'top-3':''}`}>
                                            {index+1}
                                        </span>
                                        <a href={item.link||'#'} target="_blank" rel="noreferrer" className="gdtd-most-read-link">
                                            {item.title}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
        </>
    )
}
export default SearchPage;