import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Pill, ClipboardList, CheckCircle2, AlertTriangle,
    Siren, MapPin, User, PenSquare, Users, Search, Package,
    ChevronLeft, ChevronRight, LogOut, Bell, Menu, X
} from 'lucide-react';

type MenuItem = { label: string; path: string; icon: React.ReactNode; group?: string };

const roleMenus: Record<string, MenuItem[]> = {
    patient: [
        { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, group: 'Core' },
        { label: 'Medications', path: '/medications', icon: <Pill size={20} />, group: 'Core' },
        { label: 'Prescriptions', path: '/prescriptions', icon: <ClipboardList size={20} />, group: 'Core' },
        { label: 'Adherence', path: '/adherence', icon: <CheckCircle2 size={20} />, group: 'Health' },
        { label: 'Side Effects', path: '/side-effects', icon: <AlertTriangle size={20} />, group: 'Health' },
        { label: 'Emergency', path: '/emergency', icon: <Siren size={20} />, group: 'Quick Actions' },
        { label: 'Nearby Care', path: '/nearby', icon: <MapPin size={20} />, group: 'Quick Actions' },
        { label: 'Profile', path: '/profile', icon: <User size={20} />, group: 'Account' },
    ],
    doctor: [
        { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, group: 'Core' },
        { label: 'New Prescription', path: '/prescriptions/new', icon: <PenSquare size={20} />, group: 'Core' },
        { label: 'Prescriptions', path: '/prescriptions', icon: <ClipboardList size={20} />, group: 'Core' },
        { label: 'Patients', path: '/patients', icon: <Users size={20} />, group: 'Core' },
        { label: 'Profile', path: '/profile', icon: <User size={20} />, group: 'Account' },
    ],
    pharmacy: [
        { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, group: 'Core' },
        { label: 'Verify Rx', path: '/verify', icon: <Search size={20} />, group: 'Core' },
        { label: 'Refill History', path: '/refills', icon: <Package size={20} />, group: 'Core' },
        { label: 'Profile', path: '/profile', icon: <User size={20} />, group: 'Account' },
    ],
    caregiver: [
        { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, group: 'Core' },
        { label: 'Patients', path: '/patients', icon: <Users size={20} />, group: 'Core' },
        { label: 'Profile', path: '/profile', icon: <User size={20} />, group: 'Account' },
    ],
};

const roleTitles: Record<string, string> = {
    patient: 'Patient',
    doctor: 'Doctor',
    pharmacy: 'Pharmacy',
    caregiver: 'Caregiver',
};

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [expanded, setExpanded] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [hovered, setHovered] = useState(false);

    // Sidebar is visually expanded if pinned (expanded) OR hovered
    const isOpen = expanded || hovered;

    if (!user) return <>{children}</>;

    const menu = roleMenus[user.role] || [];

    // Group menu items
    const groups = menu.reduce((acc, item) => {
        const group = item.group || 'Other';
        if (!acc[group]) acc[group] = [];
        acc[group].push(item);
        return acc;
    }, {} as Record<string, MenuItem[]>);

    const renderNavItem = (item: MenuItem) => {
        const isActive = location.pathname === item.path;
        return (
            <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={isActive ? 'rail-link-active' : 'rail-link'}
                title={!isOpen ? item.label : undefined}
            >
                <div className="rail-icon">
                    {item.icon}
                </div>
                <span className={`whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden lg:opacity-0 lg:w-0'}`}>
                    {item.label}
                </span>
            </Link>
        );
    };

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Logo area */}
            <div className={`p-4 ${isOpen ? 'px-5' : 'px-3'} transition-all duration-300`}>
                <Link to="/dashboard" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-glow flex-shrink-0">
                        M
                    </div>
                    <div className={`transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                        <h1 className="text-lg font-extrabold gradient-text whitespace-nowrap">MedVault</h1>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap">{roleTitles[user.role]} Portal</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto overflow-x-hidden">
                {Object.entries(groups).map(([groupName, items], gi) => (
                    <div key={groupName}>
                        {gi > 0 && <div className="my-3 mx-2 border-t border-slate-200/40" />}
                        {isOpen && (
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 mb-2 transition-all duration-300">
                                {groupName}
                            </p>
                        )}
                        <div className="space-y-0.5">
                            {items.map(renderNavItem)}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Collapse toggle (desktop only) */}
            <div className="hidden lg:block px-3 py-2 border-t border-slate-200/30">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center justify-center gap-2 p-2.5 rounded-2xl text-slate-400 hover:text-primary-600 hover:bg-primary-50/50 transition-all duration-200"
                    title={expanded ? 'Unpin sidebar' : 'Pin sidebar open'}
                >
                    {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                    <span className={`text-xs font-medium transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                        {expanded ? 'Unpin' : 'Pin'}
                    </span>
                </button>
            </div>

            {/* User footer */}
            <div className={`p-3 ${isOpen ? 'px-4' : ''} border-t border-slate-200/30 transition-all duration-300`}>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-glow-sm">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className={`flex-1 min-w-0 transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                        <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium text-slate-500 hover:text-red-500 hover:bg-red-50/60 transition-all duration-200 ${!isOpen && 'px-0'}`}
                    title="Sign Out"
                >
                    <LogOut size={16} />
                    <span className={`transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                        Sign Out
                    </span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden animate-fade-in" onClick={() => setMobileOpen(false)} />
            )}

            {/* Mobile sidebar (full expand) */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 lg:hidden glass rounded-r-3xl shadow-rail transform transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="absolute top-4 right-3">
                    <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-slate-100/50 text-slate-500 transition-colors">
                        <X size={18} />
                    </button>
                </div>
                {/* Force expanded view on mobile */}
                <div className="flex flex-col h-full">
                    <div className="p-5">
                        <Link to="/dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-glow">M</div>
                            <div>
                                <h1 className="text-lg font-extrabold gradient-text">MedVault</h1>
                                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{roleTitles[user.role]} Portal</p>
                            </div>
                        </Link>
                    </div>
                    <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                        {Object.entries(groups).map(([groupName, items], gi) => (
                            <div key={groupName}>
                                {gi > 0 && <div className="my-3 mx-2 border-t border-slate-200/40" />}
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 mb-2">
                                    {groupName}
                                </p>
                                <div className="space-y-0.5">
                                    {items.map(item => {
                                        const isActive = location.pathname === item.path;
                                        return (
                                            <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                                                className={isActive ? 'rail-link-active' : 'rail-link'}>
                                                <div className="rail-icon">{item.icon}</div>
                                                <span>{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>
                    <div className="p-4 border-t border-slate-200/30">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-glow-sm">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                            </div>
                        </div>
                        <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium text-slate-500 hover:text-red-500 hover:bg-red-50/60 transition-all">
                            <LogOut size={16} /> Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Desktop sidebar (icon rail / expanded) */}
            <aside
                className={`hidden lg:block fixed inset-y-0 left-0 z-30 glass rounded-r-3xl shadow-rail transition-all duration-300 ease-out ${isOpen ? 'w-60' : 'w-[72px]'}`}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {sidebarContent}
            </aside>

            {/* Main content */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${expanded ? 'lg:ml-60' : 'lg:ml-[72px]'}`}>
                {/* Top bar */}
                <header className="glass rounded-b-2xl mx-3 mt-0 px-5 py-3.5 flex items-center gap-4 sticky top-0 z-20 shadow-glass">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="lg:hidden p-2 rounded-xl hover:bg-primary-50/60 text-slate-500 transition-colors"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-slate-800">
                            {getGreeting()}, <span className="gradient-text">{user.name.split(' ')[0]}</span> 👋
                        </h2>
                        <p className="text-xs text-slate-400 font-medium">
                            {menu.find(m => m.path === location.pathname)?.label || 'MedVault'} • {new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2.5 rounded-xl hover:bg-primary-50/60 text-slate-400 hover:text-primary-600 transition-all relative">
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
                        </button>
                        <Link to="/profile" className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-glow-sm hover:shadow-glow transition-all">
                            {user.name.charAt(0).toUpperCase()}
                        </Link>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-5 animate-in">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
