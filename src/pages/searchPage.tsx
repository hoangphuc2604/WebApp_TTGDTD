import React, {useEffect, useMemo, useState} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import Header from '../component/layout/Header';
import Footer from '../component/layout/Footer';
import { articles } from '../api/articleAPI';
import './searchPage.css';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store";
import {executeSearch, SortOrder} from "../store/articlesSlice";

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
        const set = new Set<String>();
        articles.forEach(article => {
            if(article.category &&  article.category.trim()) set.add(article.category.trim());
        })
        return Array.from(set);
    },[]);

}
export default SearchPage;