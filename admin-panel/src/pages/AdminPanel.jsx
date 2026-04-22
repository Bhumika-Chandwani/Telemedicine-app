import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import './AdminPanel.css';

export default function AdminPanel() {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentTime, setCurrentTime] = useState(new Date());

    // Checking admin role
    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'admin') {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour >= 5 && hour < 12) return 'Good Morning ☀️';
        if (hour >= 12 && hour < 17) return 'Good Afternoon 🌤️';
        return 'Good Evening 🌙';
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>Admin Panel</h2>
                </div>
                <nav className="sidebar-nav">
                    <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <span className="icon">📊</span> Dashboard
                    </NavLink>
                    <NavLink to="/admin/users" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <span className="icon">👥</span> Patients
                    </NavLink>
                    <NavLink to="/admin/doctors" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <span className="icon">🩺</span> Doctors
                    </NavLink>
                </nav>
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <span className="icon">🚪</span> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* Top Bar */}
                <header className="admin-topbar">
                    <div className="greeting">
                        <h3>{getGreeting()}</h3>
                    </div>
                    <div className="time-display">
                        <span className="date">{currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span className="time">{currentTime.toLocaleTimeString()}</span>
                    </div>
                </header>

                {/* Page Content */}
                <div className="admin-content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
