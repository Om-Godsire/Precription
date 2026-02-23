import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const roleMenus: Record<string, { label: string; path: string; icon: string }[]> = {
    patient: [
        { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
        { label: 'Medications', path: '/medications', icon: '💊' },
        { label: 'Prescriptions', path: '/prescriptions', icon: '📋' },
        { label: 'Adherence', path: '/adherence', icon: '✅' },
        { label: 'Side Effects', path: '/side-effects', icon: '⚠️' },
        { label: 'Emergency', path: '/emergency', icon: '🚨' },
        { label: 'Profile', path: '/profile', icon: '👤' },
    ],
    doctor: [
        { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
        { label: 'New Prescription', path: '/prescriptions/new', icon: '📝' },
        { label: 'Prescriptions', path: '/prescriptions', icon: '📋' },
        { label: 'Patients', path: '/patients', icon: '👥' },
        { label: 'Profile', path: '/profile', icon: '👤' },
    ],
    pharmacy: [
        { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
        { label: 'Verify Rx', path: '/verify', icon: '🔍' },
        { label: 'Refill History', path: '/refills', icon: '📦' },
        { label: 'Profile', path: '/profile', icon: '👤' },
    ],
    caregiver: [
        { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
        { label: 'Patients', path: '/patients', icon: '👥' },
        { label: 'Profile', path: '/profile', icon: '👤' },
    ],
};

const roleTitles: Record<string, string> = {
    patient: 'Patient',
    doctor: 'Doctor',
    pharmacy: 'Pharmacy',
    caregiver: 'Caregiver',
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (!user) return <>{children}</>;

    const menu = roleMenus[user.role] || [];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 shadow-lg lg:shadow-none transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-slate-100">
                        <Link to="/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-glow">
                                M
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-800">MedVault</h1>
                                <p className="text-xs text-slate-400 font-medium">{roleTitles[user.role]} Portal</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {menu.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={location.pathname === item.path ? 'sidebar-link-active' : 'sidebar-link'}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* User info */}
                    <div className="p-4 border-t border-slate-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                            </div>
                        </div>
                        <button onClick={logout} className="w-full btn-secondary text-sm py-2">
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-slate-800">
                            {menu.find(m => m.path === location.pathname)?.label || 'MedVault'}
                        </h2>
                    </div>
                    <div className="text-sm text-slate-500">
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
