import React, { useEffect, useState } from 'react';
import { doctorAPI } from '../api/client';
import { ClipboardList, Search, FileText, Calendar, CheckCircle2 } from 'lucide-react';

const DoctorPrescriptionsPage: React.FC = () => {
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        doctorAPI.getPrescriptions()
            .then(res => setPrescriptions(res.data?.prescriptions || res.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
    );

    const filtered = prescriptions.filter((rx: any) =>
        (rx.patient_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (rx.verification_code || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-800">Prescriptions</h1>
                <p className="text-slate-500 mt-1 text-sm">All prescriptions you've issued</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="stat-card group stagger-1 animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                            <ClipboardList size={22} />
                        </div>
                        <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-60" />
                    </div>
                    <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{prescriptions.length}</p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Total Issued</p>
                </div>
                <div className="stat-card group stagger-2 animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                            <CheckCircle2 size={22} />
                        </div>
                        <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-60" />
                    </div>
                    <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        {prescriptions.filter((rx: any) => rx.status === 'active').length}
                    </p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Active</p>
                </div>
                <div className="stat-card group stagger-3 animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                            <Calendar size={22} />
                        </div>
                        <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 opacity-60" />
                    </div>
                    <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        {prescriptions.filter((rx: any) => {
                            const d = new Date(rx.issue_date);
                            const now = new Date();
                            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                        }).length}
                    </p>
                    <p className="text-sm font-medium text-slate-500 mt-1">This Month</p>
                </div>
            </div>

            {/* Search */}
            <div className="card">
                <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        className="input pl-11 w-full"
                        placeholder="Search by patient name or prescription code..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Prescriptions Table */}
            <div className="card">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-slate-800">All Prescriptions</h3>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100/60 px-3 py-1 rounded-full">{filtered.length} found</span>
                </div>
                {filtered.length ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/40">
                                    <th className="pb-3 pl-4">Patient</th>
                                    <th className="pb-3">Date</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3 pr-4">Code</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((rx: any, i: number) => (
                                    <tr key={rx.id || rx._id || i} className={`border-b border-slate-100/40 hover:bg-white/40 transition-all duration-200 stagger-${(i % 5) + 1} animate-slide-up`}>
                                        <td className="py-3.5 pl-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                                                    {rx.patient_name?.charAt(0) || '?'}
                                                </div>
                                                <span className="font-semibold text-slate-800 text-sm">{rx.patient_name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 text-sm text-slate-500">{new Date(rx.issue_date).toLocaleDateString()}</td>
                                        <td className="py-3.5"><span className={rx.status === 'active' ? 'badge-active' : 'badge-warning'}>{rx.status}</span></td>
                                        <td className="py-3.5 pr-4">
                                            <span className="font-mono text-xs bg-primary-50/60 text-primary-600 px-2.5 py-1 rounded-lg font-semibold">{rx.verification_code}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100/60 rounded-2xl flex items-center justify-center">
                            <FileText size={24} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-medium">No prescriptions found</p>
                        <p className="text-xs text-slate-300 mt-1">Create one from the sidebar</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorPrescriptionsPage;
