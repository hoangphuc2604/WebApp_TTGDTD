import {Link, NavLink, useNavigate} from "react-router-dom";
import React, {useState, useEffect, useRef, useMemo, useCallback} from "react";
import logo from "../../assets/images/logo.svg";
import logoGDTD from "../../assets/images/gdtd.png";
import "./Header.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchNews } from "../../store/newsSlice";

export interface MenuChild {
    label: string;
    path: string;
}

export interface MenuItem {
    label: string;
    path: string;
    children?: MenuChild[];
}

export const menuItems: MenuItem[] = [
    {
        label: "Giáo dục",
        path: "/chuyen-muc/giao-duc",
        children: [
            { label: "Chính sách", path: "/chuyen-muc/chinh-sach" },
            { label: "Địa phương", path: "/chuyen-muc/dia-phuong" },
            { label: "Đào tạo - Tuyển sinh", path: "/chuyen-muc/tuyen-sinh-du-hoc" },
            { label: "Bốn phương", path: "/chuyen-muc/giao-duc-bon-phuong" },
            { label: "Giáo dục 24h", path: "/chuyen-muc/giao-duc-24h" },
        ],
    },
    {
        label: "Thời sự",
        path: "/chuyen-muc/thoi-su",
        children: [
            { label: "Giáo dục Đô thị", path: "/chuyen-muc/giao-duc-do-thi" },
            { label: "Xã hội", path: "/chuyen-muc/thoi-su-xa-hoi" },
            { label: "Chính trị", path: "/chuyen-muc/chinh-tri" },
            { label: "Kinh tế", path: "/chuyen-muc/kinh-te" },
        ],
    },
    {
        label: "Giáo dục pháp luật",
        path: "/chuyen-muc/giao-duc-phap-luat",
        children: [
            { label: "An ninh", path: "/chuyen-muc/an-ninh" },
            { label: "Pháp đình", path: "/chuyen-muc/phap-dinh" },
            { label: "Bạn đọc - Điều tra", path: "/chuyen-muc/goc-nhin" },
        ],
    },
    {
        label: "Kết nối",
        path: "/chuyen-muc/ket-noi",
        children: [
            { label: "Công đoàn", path: "/chuyen-muc/cong-doan" },
            { label: "Đồng hành", path: "/chuyen-muc/dong-hanh" },
            { label: "Khoa học - Công nghệ", path: "/chuyen-muc/khoa-hoc" },
        ],
    },
    {
        label: "Trao đổi",
        path: "/chuyen-muc/trao-doi",
        children: [
            { label: "Phương pháp", path: "/chuyen-muc/phuong-phap" },
            { label: "Góc chuyên gia", path: "/chuyen-muc/goc-chuyen-gia" },
        ],
    },
    {
        label: "Học đường",
        path: "/chuyen-muc/hoc-duong",
        children: [
            { label: "Kỹ năng", path: "/chuyen-muc/ky-nang-song" },
            { label: "Du học", path: "/chuyen-muc/du-hoc" },
            { label: "Gương mặt", path: "/chuyen-muc/guong-mat" },
            { label: "Thể chất", path: "/chuyen-muc/the-chat" },
        ],
    },
    { label: "Nhân ái", path: "/chuyen-muc/nhan-ai" },
    {
        label: "Thế giới",
        path: "/chuyen-muc/the-gioi",
        children: [
            { label: "Giáo dục Quốc phòng", path: "/chuyen-muc/giao-duc-quoc-phong" },
            { label: "Thế giới đó đây", path: "/chuyen-muc/the-gioi-do-day" },
            { label: "Chuyện lạ", path: "/chuyen-muc/chuyen-la" },
        ],
    },
    {
        label: "Sức khỏe",
        path: "/chuyen-muc/suc-khoe",
        children: [
            { label: "Khoẻ đẹp", path: "/chuyen-muc/khoe-dep" },
            { label: "Gia đình", path: "/chuyen-muc/gia-dinh" },
            { label: "Đẩy lùi Covid-19", path: "/chuyen-muc/day-lui-covid" },
        ],
    },
    {
        label: "Media",
        path: "/chuyen-muc/media",
        children: [
            { label: "Infographic", path: "/chuyen-muc/infographic-media" },
            { label: "Video", path: "/chuyen-muc/video" },
            { label: "Nóng 247", path: "/chuyen-muc/247-nong" },
            { label: "Tiêu điểm", path: "/chuyen-muc/tieu-diem" },
        ],
    },
    {
        label: "Văn hóa",
        path: "/chuyen-muc/van-hoa",
        children: [
            { label: "Sáng tác", path: "/chuyen-muc/sang-tac" },
            { label: "Đời sống văn hoá", path: "/chuyen-muc/doi-song-van-hoa" },
            { label: "Sao", path: "/chuyen-muc/the-gioi-sao" },
        ],
    },
    {
        label: "Thể thao",
        path: "/chuyen-muc/the-thao",
        children: [
            { label: "Thể thao học đường", path: "/chuyen-muc/the-thao-hoc-duong" },
        ],
    },
];

function Header() {
    const currentDate = new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: "Asia/Ho_Chi_Minh",
    }).format(new Date());
    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const { articles } = useAppSelector((state) => state.news);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (articles.length === 0) {
            dispatch(fetchNews());
        }
    }, [articles.length, dispatch]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const { matchedTags, matchedArticles } = useMemo(() => {
        const kw = searchQuery.trim().toLowerCase();
        if (kw.length < 2){
            return {matchedTags: [], matchedArticles: []};
        }
        const tagSet = new Set<string>();
        const foundArticles = [];
        for (const article of articles) {
            if (Array.isArray(article.tags)) {
                for (const tag of article.tags) {
                    if(tag.toLowerCase().includes(kw)){
                        tagSet.add(tag);
                    }
                }
            }
            if (foundArticles.length < 5){
                const inTitle = article.title?.toLowerCase().includes(kw);
                const inDesc = article.description?.toLowerCase().includes(kw);
                const inTags = article.tags?.some((t) => t.toLowerCase().includes(kw));

                if (inTitle || inDesc || inTags) {
                    foundArticles.push(article);
                }
            }
        }
        return {
            matchedTags: Array.from(tagSet).slice(0,4),
            matchedArticles: foundArticles,
        };
    }, [searchQuery, articles]);
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        setShowSuggestions(false);
        navigate(trimmed ? `/tim-kiem?q=${encodeURIComponent(trimmed)}` : "/tim-kiem");
    };

    return (
        <>
            <header className="page-header">
                <div className="top-info">
                    <div className="top-container">
                        <div className="date">{currentDate}</div>
                        <div className="top-contact">
                            <div className="contact-item">
                                {/* Thay icon điện thoại */}
                                <i className="fa-solid fa-phone contact-icon"></i>
                                <span>
                                    Đường dây nóng:
                                    <strong className="hotline">096.733.5089</strong>
                                </span>
                            </div>
                            <div className="contact-item">
                                {/* Thay icon email */}
                                <i className="fa-solid fa-envelope contact-icon"></i>
                                <span>
                                    Email:
                                    <a href="mailto:gdtddientu@gmail.com">gdtddientu@gmail.com</a>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="brand-area">
                    <div className="container">
                        <div className="main-header">
                            <Link to="/" className="logo">
                                <img src={logo} alt="Giáo dục và Thời đại" />
                            </Link>
                            <div className="brand-right">

                                <div ref={searchBoxRef} className="header-search-wrapper">
                                    <form className="search-box" onSubmit={handleSearchSubmit}>
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm..."
                                            aria-label="Nhập nội dung tìm kiếm"
                                            value={searchQuery}
                                            onFocus={() => setShowSuggestions(true)}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setShowSuggestions(true);
                                            }}
                                        />
                                        <button type="submit" aria-label="Tìm kiếm">
                                            <i className="fa-solid fa-magnifying-glass"></i>
                                        </button>
                                    </form>

                                    {showSuggestions && searchQuery.trim().length >= 2 && (
                                        <div className="search-autocomplete-dropdown">
                                            {matchedTags.length > 0 && (
                                                <div className="autocomplete-section border-bottom">
                                                    <div className="autocomplete-label">Từ khóa nổi bật</div>
                                                    <div className="d-flex flex-wrap gap-1 px-3 pb-2">
                                                        {matchedTags.map((tag, idx) => (
                                                            <Link
                                                                key={idx}
                                                                to={`/tim-kiem?q=${encodeURIComponent(tag)}`}
                                                                className="autocomplete-tag-pill"
                                                                onClick={() => {
                                                                    setSearchQuery(tag);
                                                                    setShowSuggestions(false);
                                                                }}
                                                            >
                                                                #{tag}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {matchedArticles.length > 0 ? (
                                                <div className="autocomplete-section">
                                                    <div className="autocomplete-label">Bài viết gợi ý</div>
                                                    {matchedArticles.map((item) => (
                                                        <Link
                                                            key={item.id}
                                                            to={`/bai-viet/${item.id}`}
                                                            className="autocomplete-article-item"
                                                            onClick={() => setShowSuggestions(false)}
                                                        >
                                                            <img
                                                                src={item.thumbnail}
                                                                alt={item.title}
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src =
                                                                        "https://via.placeholder.com/300x200?text=No+Image";
                                                                }}
                                                            />
                                                            <div className="autocomplete-article-info">
                                                                <div className="autocomplete-article-title">{item.title}</div>
                                                                <small className="text-muted">{item.category}</small>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            ) : (
                                                matchedTags.length === 0 && (
                                                    <div className="p-3 text-center text-muted small">
                                                        Không có gợi ý nhanh cho "{searchQuery}"
                                                    </div>
                                                )
                                            )}

                                            <Link
                                                to={`/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}`}
                                                className="autocomplete-view-all"
                                                onClick={() => setShowSuggestions(false)}
                                            >
                                                Xem tất cả kết quả cho <strong>"{searchQuery.trim()}"</strong> →
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                <a href="#" className="logo-gdtd">
                                    <img src={logoGDTD} alt="Giáo dục Thủ đô" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <nav className="main-navigation">
                <div className="nav-container">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) => `home-button ${isActive ? "active" : ""}`}
                        aria-label="Trang chủ"
                    >
                        {/* Thay icon ngôi nhà */}
                        <i className="fa-solid fa-house"></i>
                    </NavLink>

                    <div className="menu-list">
                        {menuItems.map((item) => (
                            <div
                                key={item.path}
                                className={`menu-item ${item.children ? "has-sub" : ""}`}
                            >
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => `menu-link ${isActive ? "active" : ""}`}
                                >
                                    {item.label}
                                </NavLink>

                                {item.children && (
                                    <ul className="sub-menu">
                                        {item.children.map((child) => (
                                            <li key={child.path} className="sub-item">
                                                <NavLink
                                                    to={child.path}
                                                    className={({ isActive }) => `sub-link ${isActive ? "active" : ""}`}
                                                >
                                                    {child.label}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Header;