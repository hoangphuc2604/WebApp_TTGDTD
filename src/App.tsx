import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {fetchUserProfile} from './store/authSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import Login from './component/Login';
import Dashboard from './pages/dashboard-test';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) =>{
    const {isAuthenticated, loading} = useAppSelector(state => state.auth);
    if(loading) return <div style={{ padding: '20px' }}>Đang xác thực...</div>;
    return isAuthenticated ? <>{children}</> : <Navigate to='/login' replace/>;
}
const App: React.FC =() =>{
    const dispatch = useAppDispatch();
    const token = useAppSelector(state => state.auth.token);
    useEffect(() => {
        if (token){
            dispatch(fetchUserProfile())
        }
    }, [dispatch, token]);
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}
export default App;