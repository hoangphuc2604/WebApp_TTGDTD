import React from 'react';
import { logout } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const DashboardTest: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    return (
        <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
            <h1>Hệ Thống Quản Trị - Báo Giáo Dục & Thời Đại</h1>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', maxWidth: '500px' }}>
                <h3>Thông tin người dùng (GET Profile):</h3>
                {user ? (
                    <>
                        <p><strong>Họ tên:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Chức vụ:</strong> {user.role}</p>
                        <button
                            onClick={() => dispatch(logout())}
                            style={{ padding: '8px 16px', backgroundColor: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Đăng xuất
                        </button>
                    </>
                ) : (
                    <p>Đang tải dữ liệu...</p>
                )}
            </div>
        </div>
    );
};

export default DashboardTest;