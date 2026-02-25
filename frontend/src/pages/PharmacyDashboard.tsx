import React, { useEffect, useState } from 'react';
import { pharmacyAPI } from '../api/client';
import { Package, CalendarDays, Search, CheckCircle2, ShieldCheck, Pill, AlertCircle } from 'lucide-react';

const PharmacyDashboard: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [verifyCode, setVerifyCode] = useState('');
    const [verifyResult, setVerifyResult] = useState<any>(null);
    const [verifyError, setVerifyError] = useState('');

    useEffect(() => {
        pharmacyAPI.getDashboard().then(res => setData(res.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleVerify = async () => {
        if (!verifyCode.trim()) return;
        setVerifyError('');
        setVerifyResult(null);
        try {
            const { data } = await pharmacyAPI.verifyPrescription(verifyCode.trim());
            setVerifyResult(data);
        } catch {
            setVerifyError('Prescription not found or invalid code');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
    );

    const stats = [
        {
            label: 'Total Refills',
            value: data?.total_refills || 0,
            icon: <Package size={22} />,
            iconBg: 'bg-blue-100 text-blue-600',
            gradient: 'from-blue-500 to-indigo-500',
        },
        {
            label: "Today's Refills",
            value: data?.today_refills || 0,
            icon: <CalendarDays size={22} />,
            iconBg: 'bg-emerald-100 text-emerald-600',
            gradient: 'from-emerald-500 to-teal-500',
        },
    ];

    return (
        <div className="space-y-6 animate-in">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-800">Pharmacy Dashboard</h1>
                <p className="text-slate-500 mt-1 text-sm">Manage prescriptions and refills</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                    <div key={stat.label} className={`stat-card group stagger-${i + 1} animate-slide-up`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-11 h-11 ${stat.iconBg} rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}>
                                {stat.icon}
                            </div>
                            <div className={`h-1.5 w-8 rounded-full bg-gradient-to-r ${stat.gradient} opacity-60`} />
                        </div>
                        <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{stat.value}</p>
                        <p className="text-sm font-medium text-slate-500 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Prescription Verification */}
            <div className="card">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 bg-primary-100/80 rounded-xl flex items-center justify-center text-primary-600">
                        <Search size={18} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Verify Prescription</h3>
                </div>
                <div className="flex gap-3">
                    <input className="input flex-1" placeholder="Enter prescription code (e.g., RX-XXXXXXXX)"
                        value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleVerify()} />
                    <button onClick={handleVerify} className="btn-primary">
                        <span className="flex items-center gap-2">
                            <ShieldCheck size={16} />
                            Verify
                        </span>
                    </button>
                </div>

                {verifyError && (
                    <div className="mt-3 flex items-center gap-2 p-3 bg-red-50/60 border border-red-200/40 rounded-2xl text-red-600 text-sm font-medium animate-slide-up">
                        <AlertCircle size={16} />
                        {verifyError}
                    </div>
                )}

                {verifyResult && (
                    <div className="mt-4 p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200/40 animate-slide-up">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                                <CheckCircle2 size={18} />
                            </div>
                            <h4 className="font-bold text-emerald-800">Prescription Verified</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="p-2.5 bg-white/50 rounded-xl">
                                <span className="text-slate-400 text-xs font-semibold block">Patient</span>
                                <span className="font-semibold text-slate-800">{verifyResult.prescription.patient_name}</span>
                            </div>
                            <div className="p-2.5 bg-white/50 rounded-xl">
                                <span className="text-slate-400 text-xs font-semibold block">Doctor</span>
                                <span className="font-semibold text-slate-800">{verifyResult.prescription.doctor_name}</span>
                            </div>
                            <div className="p-2.5 bg-white/50 rounded-xl">
                                <span className="text-slate-400 text-xs font-semibold block">Issued</span>
                                <span className="font-semibold text-slate-800">{new Date(verifyResult.prescription.issue_date).toLocaleDateString()}</span>
                            </div>
                            <div className="p-2.5 bg-white/50 rounded-xl">
                                <span className="text-slate-400 text-xs font-semibold block">Status</span>
                                <span className="badge-active">{verifyResult.prescription.status}</span>
                            </div>
                        </div>
                        {verifyResult.medicines?.length > 0 && (
                            <div className="mt-4">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Medicines</p>
                                <div className="space-y-2">
                                    {verifyResult.medicines.map((m: any) => (
                                        <div key={m.id} className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
                                            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-primary-500">
                                                <Pill size={14} />
                                            </div>
                                            <div>
                                                <span className="font-semibold text-sm text-slate-800">{m.generic_name}</span>
                                                <span className="text-xs text-slate-400 ml-1">({m.brand_name})</span>
                                                <p className="text-xs text-slate-500">{m.dosage} • {m.frequency}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Recent Refills */}
            <div className="card">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-slate-800">Recent Refills</h3>
                    <span className="text-xs font-semibold text-primary-600 hover:text-primary-700 cursor-pointer">View All →</span>
                </div>
                {data?.recent_refills?.length ? (
                    <div className="space-y-3">
                        {data.recent_refills.map((r: any, i: number) => (
                            <div key={r.id} className={`flex items-center justify-between p-4 rounded-2xl bg-white/40 hover:bg-white/70 border border-slate-100/50 transition-all duration-300 hover:shadow-sm stagger-${i + 1} animate-slide-up`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500">
                                        <Pill size={16} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm">{r.generic_name} <span className="text-slate-400 font-normal">({r.brand_name})</span></p>
                                        <p className="text-xs text-slate-400">Patient: {r.patient_name}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400 bg-slate-100/50 px-2.5 py-1 rounded-lg font-medium">{new Date(r.refill_date).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100/60 rounded-2xl flex items-center justify-center">
                            <Package size={24} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-medium">No refills yet</p>
                        <p className="text-xs text-slate-300 mt-1">Refill records will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PharmacyDashboard;
