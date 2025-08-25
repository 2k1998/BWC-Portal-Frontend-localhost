// src/components/SidebarNavigation.jsx
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './SidebarNavigation.css';

const API_BASE_URL = 'http://127.0.0.1:8000';

function SidebarNavigation() {
    const { currentUser, logout } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const userRole = currentUser?.role;
    const isAdmin = userRole === "admin";
    const canSeeContacts = ['Pillar', 'Manager', 'Head', 'admin'].includes(userRole);
    const canManageProjects = ['admin', 'Manager', 'Head'].includes(userRole);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <Link to="/dashboard" className={isCollapsed ? 'sidebar-logo-collapsed' : 'sidebar-logo'}>
                    <span className="logo-icon">🏢</span>
                    {!isCollapsed && <span>BWC Portal</span>}
                </Link>
                <button 
                    className="collapse-toggle desktop-only"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? '→' : '←'}
                </button>
            </div>

            <div className="sidebar-user">
                <div className="user-avatar">
                    {currentUser?.profile_picture_url ? (
                        <img 
                            src={`${API_BASE_URL}${currentUser.profile_picture_url}`}
                            alt="Profile"
                        />
                    ) : (
                        <span>👤</span>
                    )}
                </div>
                {!isCollapsed && (
                    <div className="user-info">
                        <div className="user-name">{currentUser?.name || 'User'}</div>
                        <div className="user-role">{currentUser?.role || 'Member'}</div>
                    </div>
                )}
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                    <div className="menu-item-content">
                        <span className="menu-icon">📊</span>
                        {!isCollapsed && <span className="menu-label">{t('dashboard')}</span>}
                    </div>
                </NavLink>

                <NavLink to="/tasks" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                    <div className="menu-item-content">
                        <span className="menu-icon">📋</span>
                        {!isCollapsed && <span className="menu-label">{t('tasks')}</span>}
                    </div>
                </NavLink>

                {canManageProjects && (
                    <NavLink to="/projects" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                        <div className="menu-item-content">
                            <span className="menu-icon">💼</span>
                            {!isCollapsed && <span className="menu-label">{t('projects')}</span>}
                        </div>
                    </NavLink>
                )}

                <NavLink to="/companies" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                    <div className="menu-item-content">
                        <span className="menu-icon">🏢</span>
                        {!isCollapsed && <span className="menu-label">{t('companies')}</span>}
                    </div>
                </NavLink>

                {canSeeContacts && (
                    <React.Fragment>
                        <NavLink to="/contacts" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                            <div className="menu-item-content">
                                <span className="menu-icon">👥</span>
                                {!isCollapsed && <span className="menu-label">{t('contacts')}</span>}
                            </div>
                        </NavLink>

                        <NavLink to="/daily-calls" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                            <div className="menu-item-content">
                                <span className="menu-icon">📞</span>
                                {!isCollapsed && <span className="menu-label">{t('daily_calls')}</span>}
                            </div>
                        </NavLink>
                    </React.Fragment>
                )}

                <NavLink to="/groups" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                    <div className="menu-item-content">
                        <span className="menu-icon">👫</span>
                        {!isCollapsed && <span className="menu-label">{t('groups')}</span>}
                    </div>
                </NavLink>

                <NavLink to="/events" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                    <div className="menu-item-content">
                        <span className="menu-icon">📅</span>
                        {!isCollapsed && <span className="menu-label">{t('events')}</span>}
                    </div>
                </NavLink>

                <NavLink to="/documents" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                    <div className="menu-item-content">
                        <span className="menu-icon">📁</span>
                        {!isCollapsed && <span className="menu-label">{t('documents')}</span>}
                    </div>
                </NavLink>

                {isAdmin && (
                    <React.Fragment>
                        <NavLink to="/users" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                            <div className="menu-item-content">
                                <span className="menu-icon">👤</span>
                                {!isCollapsed && <span className="menu-label">{t('users')}</span>}
                            </div>
                        </NavLink>

                        <NavLink to="/reports" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                            <div className="menu-item-content">
                                <span className="menu-icon">📈</span>
                                {!isCollapsed && <span className="menu-label">{t('reports')}</span>}
                            </div>
                        </NavLink>

                        <NavLink to="/admin-panel" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                            <div className="menu-item-content">
                                <span className="menu-icon">⚙️</span>
                                {!isCollapsed && <span className="menu-label">{t('admin_panel')}</span>}
                            </div>
                        </NavLink>

                        <NavLink to="/payments" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                            <div className="menu-item-content">
                                <span className="menu-icon">💰</span>
                                {!isCollapsed && <span className="menu-label">{t('payments')}</span>}
                            </div>
                        </NavLink>

                        <NavLink to="/commissions" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                            <div className="menu-item-content">
                                <span className="menu-icon">💵</span>
                                {!isCollapsed && <span className="menu-label">{t('commissions')}</span>}
                            </div>
                        </NavLink>

                        <NavLink to="/car-finances" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                            <div className="menu-item-content">
                                <span className="menu-icon">🚗</span>
                                {!isCollapsed && <span className="menu-label">{t('car_finance')}</span>}
                            </div>
                        </NavLink>
                    </React.Fragment>
                )}
            </nav>

            <div className="sidebar-footer">
                <button className="footer-btn" onClick={() => setLanguage(language === 'en' ? 'gr' : 'en')}>
                    <span className="footer-icon">🌐</span>
                    {!isCollapsed && <span>{language === 'en' ? 'English' : 'Ελληνικά'}</span>}
                </button>

                <NavLink to="/profile" className="footer-btn">
                    <span className="footer-icon">👤</span>
                    {!isCollapsed && <span>{t('profile')}</span>}
                </NavLink>

                <button className="footer-btn logout-btn" onClick={handleLogout}>
                    <span className="footer-icon">🚪</span>
                    {!isCollapsed && <span>{t('logout')}</span>}
                </button>
            </div>
        </aside>
    );
}

export default SidebarNavigation;