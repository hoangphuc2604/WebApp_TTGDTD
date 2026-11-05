
import React, { useEffect } from 'react';

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import { fetchUserProfile } from './store/authSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';

import Login from './component/Login';
import Dashboard from './pages/dashboard-test';
import HomePage from './pages/HomePage';

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

                {/* Trang chủ */}
                <Route
                    path="/"
                    element={<HomePage />}
                />

                {/* Trang đăng nhập */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Trang quản trị */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Đường dẫn không tồn tại */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>
        </Router>
    );
};

export default App;
