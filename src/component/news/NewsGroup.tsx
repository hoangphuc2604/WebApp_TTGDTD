import { Link } from "react-router-dom";
import type { Article } from "../../api/articleAPI";
import "./NewsGroup.css";

interface NewsGroupProps {
    articles: Article[];
    heading?: string;
    subLinks?: { label: string; path: string }[];
}

function NewsGroup({ articles, heading, subLinks }: NewsGroupProps) {
    if (articles.length === 0) return null;
    const featured = articles[0];
    const secondary = articles.slice(1, 5);

    return (
        <section className="story-group">
            {heading && (
                <header className="story-group__header">
                <h2 className="story-group__title">
                <Link to="/">{heading}</Link>
                    </h2>
    {subLinks && subLinks.length > 0 && (
        <ul className="story-group__sublinks">
            {subLinks.map((s) => (
                    <li key={s.path}>
                    <Link to={s.path}>{s.label}</Link>
                        </li>
                ))}
            </ul>
    )}
    </header>
)}

    <div className="story-group__grid">
    <article className="story-featured">
    <Link to={`/bai-viet/${featured.id}`} className="story-featured__thumb">
    <img src={featured.thumbnail} alt={featured.title} loading="lazy" />
        </Link>
        <h3 className="story-featured__title">
    <Link to={`/bai-viet/${featured.id}`}>{featured.title}</Link>
    </h3>
    <time className="story-featured__time">
        {new Date(featured.date).toLocaleString("vi-VN")}
        </time>
    {featured.description && (
        <p className="story-featured__summary">{featured.description}</p>
    )}
    </article>

    <div className="story-secondary">
        {secondary.map((a) => (
                <article key={a.id} className="story-compact">
            <Link to={`/bai-viet/${a.id}`} className="story-compact__thumb">
    <img src={a.thumbnail} alt={a.title} loading="lazy" />
        </Link>
        <div className="story-compact__body">
    <h4 className="story-compact__title">
    <Link to={`/bai-viet/${a.id}`}>{a.title}</Link>
    </h4>
    <time className="story-compact__time">
        {new Date(a.date).toLocaleString("vi-VN")}
        </time>
        </div>
        </article>
))}
    </div>
    </div>
    </section>
);
}

export default NewsGroup;