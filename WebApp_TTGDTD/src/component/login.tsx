import React, { useState, useEffect } from 'react';
import { login, clearError } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('user@gmail.com');
    const [password, setPassword] = useState<string>('123');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useAppSelector((state: any) => state.auth);
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated,navigate]);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        // @ts-ignore
        dispatch(login({ email, password }));
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <h2 style={styles.title}>BÁO GIÁO DỤC & THỜI ĐẠI</h2>
                <p style={styles.subTitle}>Đăng nhập trang quản trị bài viết</p>

                {error && (
                    <div style={styles.errorBox}>
                        {error}
                        <button onClick={() => dispatch(clearError())} style={styles.closeBtn}>×</button>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div>
                        <label style={styles.label}>Email biên tập viên:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div>
                        <label style={styles.label}>Mật khẩu:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} style={styles.btn}>
                        {loading ? 'Đang xử lý POST API...' : 'Đăng nhập'}
                    </button>
                </form>

                <div style={styles.note}>
                    <p><strong>Tài khoản test:</strong></p>
                    <p>Email: <code>bientapvien@giaoduc.edu.vn</code></p>
                    <p>Mật khẩu: <code>123</code></p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    wrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f6f9' },
    card: { width: '360px', padding: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
    title: { color: '#b71c1c', textAlign: 'center', margin: '0 0 5px 0', fontSize: '20px' },
    subTitle: { textAlign: 'center', color: '#666', fontSize: '13px', marginBottom: '20px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    label: { display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold' },
    input: { width: '100%', padding: '8px 10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' },
    btn: { padding: '10px', backgroundColor: '#b71c1c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    errorBox: { backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '13px', display: 'flex', justifyContent: 'space-between' },
    closeBtn: { background: 'none', border: 'none', color: '#c62828', cursor: 'pointer', fontSize: '16px' },
    note: { marginTop: '20px', padding: '10px', backgroundColor: '#e8f5e9', fontSize: '12px', borderRadius: '4px' }
}as const;

export default Login;
