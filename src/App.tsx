
import React, { useEffect } from 'react';

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import { fetchUserProfile } from './store/authSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import ChiTietSanPham from './pages/news-detail';
import Login from './component/Login';
import Dashboard from './pages/dashboard-test';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAppSelector(
        state => state.auth
    );

    if (loading) {
        return (
            <div style={{ padding: '20px' }}>
                Đang xác thực...
            </div>
        );
    }

    return isAuthenticated
        ? <>{children}</>
        : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
    const dispatch = useAppDispatch();

    const token = useAppSelector(
        state => state.auth.token
    );

    useEffect(() => {
        if (token) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, token]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />}/>

                <Route path="/bai-viet/:id" element={<ChiTietSanPham />} />

                <Route path="/login" element={<Login />}/>

                <Route path="/chuyen-muc/:slug" element={<CategoryPage />} />

                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>

                <Route path="*" element={<Navigate to="/" replace />}/>

            </Routes>
        </Router>
    );
};

export default App;
