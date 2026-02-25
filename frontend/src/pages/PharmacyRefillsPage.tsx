import React, { useEffect, useState } from 'react';
import { pharmacyAPI } from '../api/client';
import { Package, Pill, Calendar, Search, RefreshCw } from 'lucide-react';

const PharmacyRefillsPage: React.FC = () => {
    const [refills, setRefills] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        pharmacyAPI.getRefills()
            .then(res => setRefills(res.data?.refills || res.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
    );

    const filtered = refills.filter((r: any) =>
        (r.generic_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.patient_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.brand_name || '').toLowerCase().includes(search.toLowerCase())
    );

    // Stats
    const today = new Date().toDateString();
    const todayCount = refills.filter((r: any) => new Date(r.refill_date).toDateString() === today).length;

    return (
        <div className="space-y-6 animate-in">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-800">Refill History</h1>
                <p className="text-slate-500 mt-1 text-sm">Complete log of all prescription refills</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="stat-card group stagger-1 animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                            <Package size={22} />
                        </div>
                        <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-60" />
                    </div>
                    <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{refills.length}</p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Total Refills</p>
                </div>
                <div className="stat-card group stagger-2 animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                            <Calendar size={22} />
                        </div>
                        <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-60" />
                    </div>
                    <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{todayCount}</p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Today's Refills</p>
                </div>
                <div className="stat-card group stagger-3 animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                            <RefreshCw size={22} />
                        </div>
                        <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 opacity-60" />
                    </div>
                    <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        {new Set(refills.map((r: any) => r.patient_name)).size}
                    </p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Unique Patients</p>
                </div>
            </div>

            {/* Search */}
            <div className="card">
                <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        className="input pl-11 w-full"
                        placeholder="Search by medicine or patient name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Refills List */}
            <div className="card">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-slate-800">All Refills</h3>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100/60 px-3 py-1 rounded-full">{filtered.length} found</span>
                </div>
                {filtered.length ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/40">
                                    <th className="pb-3 pl-4">Medicine</th>
                                    <th className="pb-3">Patient</th>
                                    <th className="pb-3">Date</th>
                                    <th className="pb-3 pr-4">Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((r: any, i: number) => (
                                    <tr key={r.id || r._id || i} className={`border-b border-slate-100/40 hover:bg-white/40 transition-all duration-200 stagger-${(i % 5) + 1} animate-slide-up`}>
                                        <td className="py-3.5 pl-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-primary-500">
                                                    <Pill size={14} />
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-slate-800 text-sm">{r.generic_name || r.medicine_name}</span>
                                                    {r.brand_name && <span className="text-xs text-slate-400 ml-1">({r.brand_name})</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 text-sm text-slate-600 font-medium">{r.patient_name}</td>
                                        <td className="py-3.5 text-sm text-slate-500">{new Date(r.refill_date).toLocaleDateString()}</td>
                                        <td className="py-3.5 pr-4">
                                            <span className="text-xs bg-slate-100/60 text-slate-600 px-2.5 py-1 rounded-lg font-medium">
                                                {r.quantity || '—'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100/60 rounded-2xl flex items-center justify-center">
                            <Package size={24} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-medium">No refills found</p>
                        <p className="text-xs text-slate-300 mt-1">Refill records will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PharmacyRefillsPage;
