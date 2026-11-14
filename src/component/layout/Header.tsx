import {Link, NavLink, useNavigate} from "react-router-dom";
import React, {useState} from "react";
import logo from "../../assets/images/logo.svg";
import logoGDTD from "../../assets/images/gdtd.png";

import "./Header.css";

interface MenuChild {
    label: string;
    path: string;
}

interface MenuItem {
    label: string;
    path: string;
    children?: MenuChild[];
}

const menuItems: MenuItem[] = [
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
    {
        label: "Nhân ái",
        path: "/chuyen-muc/nhan-ai",
    },
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
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const handleSearch = (e : React.FormEvent) => {
        e.preventDefault();
        navigate(`/tim-kiem?q=${encodeURIComponent(searchTerm.trim())}`);
    }

    return (
        <>
            <header className="page-header">

                <div className="top-info">
                    <div className="top-container">

                        <div className="date">{currentDate}</div>

                        <div className="top-contact">

                            <div className="contact-item">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.19 18a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.09 3.18 2 2 0 0 1 4.08 1h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.7 2.79a2 2 0 0 1-.45 2.11L8.06 8.89a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.89.35 1.83.58 2.79.7A2 2 0 0 1 22 16.92Z" />
                                </svg>
                                <span>
                                    Đường dây nóng:
                                    <strong className="hotline">096.733.5089</strong>
                                </span>
                            </div>

                            <div className="contact-item">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="m22 7-10 7L2 7" />
                                </svg>
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

                                <form
                                    className="search-box"
                                    onSubmit={handleSearch}
                                >
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                        aria-label="Nhập nội dung tìm kiếm"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <button type="submit" aria-label="Tìm kiếm">
                                        <svg viewBox="0 0 24 24" aria-hidden="true">
                                            <circle cx="10.8" cy="10.8" r="7.2" />
                                            <path d="m16 16 5 5" />
                                        </svg>
                                    </button>
                                </form>

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
                        className={({ isActive }) =>
                            `home-button ${isActive ? "active" : ""}`
                        }
                        aria-label="Trang chủ"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="m3 10 9-7 9 7" />
                            <path d="M5 9v12h14V9" />
                            <path d="M9 21v-7h6v7" />
                        </svg>
                    </NavLink>

                    <div className="menu-list">
                        {menuItems.map((item) => (
                            <div
                                key={item.path}
                                className={`menu-item ${item.children ? "has-sub" : ""}`}
                            >
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `menu-link ${isActive ? "active" : ""}`
                                    }
                                >
                                    {item.label}
                                </NavLink>

                                {item.children && (
                                    <ul className="sub-menu">
                                        {item.children.map((child) => (
                                            <li key={child.path} className="sub-item">
                                                <NavLink
                                                    to={child.path}
                                                    className={({ isActive }) =>
                                                        `sub-link ${isActive ? "active" : ""}`
                                                    }
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