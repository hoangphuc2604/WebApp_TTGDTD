import React from "react";
import {Link} from "react-router-dom";
import type {Article} from "../../api/articleAPI";
import "./HeroSection.css";

interface HeroSectionProps {
    articles: Article[];
}
const Trending_Topics = [
    "Xây dựng Luật Nhà giáo",
    "Đưa nghị quyết Đại hội XIV vào cuộc sống",
    "Chuyển đổi số trong giáo dục",
    "Tuyển sinh Đại học 2026"
];
function formatRealtime(date:string) {
    const diffMs = Date.now() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if(diffMins < 1) {
        return "Vừa xong";
    } else if (diffMins < 60) {
        return `${diffMins} phút trước`;
    }
    const diffHours = Math.floor(diffMins / 60);
    if(diffHours < 24) {
        return `${diffHours} giờ trước`;
    }
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ngày trước`;
}
function HeroSection ({articles}: HeroSectionProps) {
    if(articles.length === 0) {
        return null;
    }
    const mainArticles = articles[0];
    const subArticles = articles.slice(1,5);
    return (
        <section className="gdtd-hero-wrapper">
            <div className="gdtd-event-bar">
                <span className="gdtd-event-label">⚡ Sự kiện</span>
                <div className="gdtd-event-tags">
                    {Trending_Topics.map((topic,index) => (
                        <Link key={index} to={`/tim-kiem?q=${encodeURIComponent(topic)}`} className="gdtd-tag">
                            #{topic}
                        </Link>
                    ))}
                </div>
            </div>
            <div className="gdtd-hero-top">
                <Link to={`/bai-viet/${mainArticles.id}`} className="gdtd-main-thumb">
                    <img src={mainArticles.thumbnail} alt={mainArticles.title} />
                </Link>
                <div className="gdtd-main-info">
                    <Link to={`/bai-viet/${mainArticles.id}`} className="gdtd-main-title">
                        {mainArticles.title}
                    </Link>
                    <time className="gdtd-main-time">
                        {formatRealtime(mainArticles.date)}
                    </time>
                    {mainArticles.description && (
                        <p className="gdtd-main-description">{mainArticles.description}</p>
                    )}
                </div>
            </div>
            <div className="gdtd-hero-bottom">
                {subArticles.map((subArticle) => (
                    <article key={subArticle.id} className="gdtd-sub-card">
                        <Link to={`/bai-viet/${subArticle.id}`} className="gdtd-sub-thumb">
                            <img src={subArticle.thumbnail} alt={subArticle.title} />
                        </Link>
                        <Link to={`/bai-viet/${subArticle.id}`} className="gdtd-sub-title">
                            {subArticle.title}
                        </Link>
                    </article>
                ))}
            </div>
        </section>
    )
}
export default HeroSection;