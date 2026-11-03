import React, { useState, useEffect } from 'react';
import { login, clearError } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import './login.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('user@gmail.com');
    const [password, setPassword] = useState<string>('123');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated,navigate]);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        dispatch(login({ email, password }));
    }

    return (
        <div className="wrapper">
            <div className="card">
                <h2 className="title">BÁO GIÁO DỤC & THỜI ĐẠI</h2>
                <p className="subTitle">Đăng nhập trang quản trị bài viết</p>

                {error && (
                    <div className="errorBox">
                        {error}
                        <button onClick={() => dispatch(clearError())} className="closeBtn">×</button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="form">
                    <div>
                        <label className="label">Email biên tập viên:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            required
                        />
                    </div>

                    <div>
                        <label className="label">Mật khẩu:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn">
                        {loading ? 'Đang xử lý POST API...' : 'Đăng nhập'}
                    </button>
                </form>

                <div className="note">
                    <p><strong>Tài khoản test:</strong></p>
                    <p>Email: <code>bientapvien@giaoduc.edu.vn</code></p>
                    <p>Mật khẩu: <code>123</code></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
