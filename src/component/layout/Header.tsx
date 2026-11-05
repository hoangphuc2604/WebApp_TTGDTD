
import { Link, NavLink } from "react-router-dom";

import logo from "../../assets/images/logo.svg";
import logoGDTD from "../../assets/images/gdtd.png";

import "./Header.css";

const menuItems = [
    { label: "Giáo dục", path: "/chuyen-muc/giao-duc" },
    { label: "Thời sự", path: "/chuyen-muc/thoi-su" },
    { label: "Giáo dục pháp luật", path: "/chuyen-muc/giao-duc-phap-luat" },
    { label: "Kết nối", path: "/chuyen-muc/ket-noi" },
    { label: "Trao đổi", path: "/chuyen-muc/trao-doi" },
    { label: "Học đường", path: "/chuyen-muc/hoc-duong" },
    { label: "Nhân ái", path: "/chuyen-muc/nhan-ai" },
    { label: "Thế giới", path: "/chuyen-muc/the-gioi" },
    { label: "Sức khỏe", path: "/chuyen-muc/suc-khoe" },
    { label: "Media", path: "/chuyen-muc/media" },
    { label: "Văn hóa", path: "/chuyen-muc/van-hoa" },
    { label: "Thể thao", path: "/chuyen-muc/the-thao" }
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
        timeZone: "Asia/Ho_Chi_Minh"
    }).format(new Date());

    return (
        <header className="page-header">

            {/* Thanh thông tin phía trên */}
            <div className="top-info">
                <div className="top-container">

                    <div className="date">
                        {currentDate}
                    </div>

                    <div className="top-contact">

                        <div className="contact-item">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.19 18a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.09 3.18 2 2 0 0 1 4.08 1h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.7 2.79a2 2 0 0 1-.45 2.11L8.06 8.89a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.89.35 1.83.58 2.79.7A2 2 0 0 1 22 16.92Z" />
                            </svg>

                            <span>
                                Đường dây nóng:
                                <strong className="hotline">
                                    096.733.5089
                                </strong>
                            </span>
                        </div>

                        <div className="contact-item">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="m22 7-10 7L2 7" />
                            </svg>

                            <span>
                                Email:
                                <a href="mailto:gdtddientu@gmail.com">
                                    gdtddientu@gmail.com
                                </a>
                            </span>
                        </div>

                    </div>
                </div>
            </div>

            {/* Khu vực logo và tìm kiếm */}
            <div className="brand-area">
                <div className="container">
                    <div className="main-header">

                        {/* Logo chính bên trái */}
                        <Link to="/" className="logo">
                            <img
                                src={logo}
                                alt="Giáo dục và Thời đại"
                            />
                        </Link>

                        {/* Khu vực tìm kiếm và logo phụ */}
                        <div className="brand-right">

                            <form
                                className="search-box"
                                onSubmit={(event) => event.preventDefault()}
                            >
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    aria-label="Nhập nội dung tìm kiếm"
                                />

                                <button type="submit" aria-label="Tìm kiếm">
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <circle cx="10.8" cy="10.8" r="7.2" />
                                        <path d="m16 16 5 5" />
                                    </svg>
                                </button>
                            </form>

                            {/* Logo Giáo dục Thủ đô bên phải */}
                            <a href="#" className="logo-gdtd">
                                <img
                                    src={logoGDTD}
                                    alt="Giáo dục Thủ đô"
                                />
                            </a>

                        </div>
                    </div>
                </div>
            </div>

            {/* Thanh điều hướng */}
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
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `menu-item ${isActive ? "active" : ""}`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>

                </div>
            </nav>

        </header>
    );
}

export default Header;
