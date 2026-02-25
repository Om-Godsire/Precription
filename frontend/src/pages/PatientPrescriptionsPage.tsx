import React, { useEffect, useState } from 'react';
import { patientAPI } from '../api/client';
import { ClipboardList, Calendar, Pill, FileText, Search } from 'lucide-react';

const PatientPrescriptionsPage: React.FC = () => {
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        patientAPI.getPrescriptions()
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
        (rx.doctor_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (rx.status || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-800">My Prescriptions</h1>
                <p className="text-slate-500 mt-1 text-sm">View all prescriptions issued to you</p>
            </div>

            {/* Search */}
            <div className="card">
                <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        className="input pl-11 w-full"
                        placeholder="Search by doctor name or status..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="stat-card group stagger-1 animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                            <ClipboardList size={22} />
                        </div>
                        <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-60" />
                    </div>
                    <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{prescriptions.length}</p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Total Prescriptions</p>
                </div>
                <div className="stat-card group stagger-2 animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                            <Pill size={22} />
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
                        {prescriptions.filter((rx: any) => rx.status === 'completed' || rx.status === 'expired').length}
                    </p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Completed / Expired</p>
                </div>
            </div>

            {/* Prescriptions List */}
            <div className="card">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-slate-800">All Prescriptions</h3>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100/60 px-3 py-1 rounded-full">{filtered.length} found</span>
                </div>
                {filtered.length ? (
                    <div className="space-y-3">
                        {filtered.map((rx: any, i: number) => (
                            <div key={rx.id || rx._id || i} className={`p-4 rounded-2xl bg-white/40 hover:bg-white/70 border border-slate-100/50 transition-all duration-300 hover:shadow-sm stagger-${(i % 5) + 1} animate-slide-up`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-primary-100/80 rounded-xl flex items-center justify-center text-primary-600">
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800 text-sm">Dr. {rx.doctor_name || 'Unknown'}</p>
                                            <p className="text-xs text-slate-400">Issued: {new Date(rx.issue_date).toLocaleDateString()}</p>
                                            {rx.medicines_count && (
                                                <p className="text-xs text-slate-400">{rx.medicines_count} medication(s)</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-1">
                                        <span className={rx.status === 'active' ? 'badge-active' : 'badge-warning'}>{rx.status}</span>
                                        {rx.verification_code && (
                                            <span className="font-mono text-[10px] bg-primary-50/60 text-primary-600 px-2 py-0.5 rounded-lg font-semibold">
                                                {rx.verification_code}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100/60 rounded-2xl flex items-center justify-center">
                            <ClipboardList size={24} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-medium">No prescriptions found</p>
                        <p className="text-xs text-slate-300 mt-1">Your prescriptions will appear here once a doctor issues one</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientPrescriptionsPage;
