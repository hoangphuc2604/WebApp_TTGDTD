import { Link } from 'react-router-dom';
import React from "react";

import logo from '../../assets/images/logo.svg';

import './Footer.css';

const Footer = () => {
    return (
        <footer className="page-footer">
            <div className="footer-container">

                <div className="footer-col footer-brand-col">
                    <Link to="/" className="footer-brand">
                        <img src={logo} alt="Báo Giáo dục và Thời đại" />
                    </Link>
                    <p className="footer-brand-title">
                        BÁO GIÁO DỤC &amp; THỜI ĐẠI
                    </p>
                </div>

                <div className="footer-col footer-info-col">
                    <p className="footer-slogan">
                        CƠ QUAN CỦA BỘ GIÁO DỤC VÀ ĐÀO TẠO - DIỄN ĐÀN TOÀN
                        XÃ HỘI VÌ SỰ NGHIỆP GIÁO DỤC
                    </p>
                    <p>Cơ quan chủ quản: BỘ GIÁO DỤC VÀ ĐÀO TẠO</p>
                    <p>Số giấy phép 479/GP-BTTTT, cấp ngày 29/10/2020, ISSN 1859-2945.</p>
                    <p>Tổng Biên tập: Triệu Ngọc Lâm</p>
                    <p>Phó Tổng Biên tập: Dương Thanh Hương - Nguyễn Đức Tuân</p>
                    <p className="footer-note">
                        ® Ghi rõ nguồn "Báo Giáo dục &amp; Thời đại" khi phát hành
                        lại thông tin từ website.
                    </p>
                </div>

                <div className="footer-col footer-contact-col">
                    <h3 className="footer-heading">TRỤ SỞ CHÍNH</h3>
                    <p>Tòa soạn: 15 Hai Bà Trưng - P.Cửa Nam - Hà Nội.</p>
                    <p>
                        Điện thoại:{' '}
                        <a href="tel:+842439369800">024 3936 9800</a>
                    </p>
                    <p>
                        Hotline: <a href="tel:+84967335089">0967 335 089</a>
                    </p>
                    <p>
                        Email:{' '}
                        <a href="mailto:gdtddientu@gmail.com">
                            gdtddientu@gmail.com
                        </a>
                    </p>

                    <h3 className="footer-heading footer-heading--spaced">
                        LIÊN HỆ QUẢNG CÁO, TRUYỀN THÔNG VÀ ĐẶT BÁO
                    </h3>
                    <p>Phòng Truyền thông và Dự án</p>
                    <p>
                        Hotline: <a href="tel:+84886059988">0886 059 988</a>
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;