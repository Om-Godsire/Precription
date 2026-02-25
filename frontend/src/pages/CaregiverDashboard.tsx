import React, { useEffect, useState } from 'react';
import { caregiverAPI } from '../api/client';
import { Users, Link2, CheckCircle2, AlertTriangle, UserCircle } from 'lucide-react';

const CaregiverDashboard: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [linkEmail, setLinkEmail] = useState('');
    const [linkMsg, setLinkMsg] = useState('');
    const [linkError, setLinkError] = useState(false);

    useEffect(() => {
        caregiverAPI.getDashboard().then(res => setData(res.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleLink = async () => {
        if (!linkEmail.trim()) return;
        try {
            await caregiverAPI.linkPatient({ patient_email: linkEmail });
            setLinkMsg('Successfully linked to patient!');
            setLinkError(false);
            setLinkEmail('');
            caregiverAPI.getDashboard().then(res => setData(res.data));
        } catch (err: any) {
            setLinkMsg(err.response?.data?.error || 'Failed to link');
            setLinkError(true);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 animate-in">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-800">Caregiver Dashboard</h1>
                <p className="text-slate-500 mt-1 text-sm">Monitor your linked patients</p>
            </div>

            {/* Stat Card */}
            <div className="stat-card group stagger-1 animate-slide-up w-full sm:w-72">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                        <Users size={22} />
                    </div>
                    <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-60" />
                </div>
                <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{data?.total_patients || 0}</p>
                <p className="text-sm font-medium text-slate-500 mt-1">Linked Patients</p>
            </div>

            {/* Link Patient */}
            <div className="card">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 bg-primary-100/80 rounded-xl flex items-center justify-center text-primary-600">
                        <Link2 size={18} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Link a Patient</h3>
                </div>
                <div className="flex gap-3">
                    <input className="input flex-1" placeholder="Enter patient's email" value={linkEmail}
                        onChange={(e) => setLinkEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLink()} />
                    <button onClick={handleLink} className="btn-primary">
                        <span className="flex items-center gap-2">
                            <Link2 size={16} />
                            Link
                        </span>
                    </button>
                </div>
                {linkMsg && (
                    <div className={`mt-3 flex items-center gap-2 p-3 rounded-2xl text-sm font-medium animate-slide-up ${linkError
                            ? 'bg-red-50/60 border border-red-200/40 text-red-600'
                            : 'bg-emerald-50/60 border border-emerald-200/40 text-emerald-600'
                        }`}>
                        {linkError ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                        {linkMsg}
                    </div>
                )}
            </div>

            {/* Alerts */}
            {data?.alerts?.length > 0 && (
                <div className="card border border-amber-200/50 !bg-amber-50/40">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                            <AlertTriangle size={18} />
                        </div>
                        <h3 className="text-lg font-bold text-amber-800">Missed Dose Alerts</h3>
                    </div>
                    <div className="space-y-3">
                        {data.alerts.map((a: any) => (
                            <div key={a.patient_id} className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-amber-100/40 hover:bg-white/80 transition-all duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                        {a.name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm">{a.name}</p>
                                        <p className="text-xs text-amber-600">{a.missed_doses} missed doses</p>
                                    </div>
                                </div>
                                <span className="badge-warning">Adherence: {a.adherence_score}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Patient List */}
            <div className="card">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-slate-800">Linked Patients</h3>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100/60 px-3 py-1 rounded-full">{data?.patients?.length || 0} total</span>
                </div>
                {data?.patients?.length ? (
                    <div className="space-y-3">
                        {data.patients.map((p: any, i: number) => (
                            <div key={p.patient_id} className={`flex items-center justify-between p-4 rounded-2xl bg-white/40 hover:bg-white/70 border border-slate-100/50 transition-all duration-300 hover:shadow-sm stagger-${i + 1} animate-slide-up`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-glow-sm">
                                        {p.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm">{p.name}</p>
                                        <p className="text-xs text-slate-400 capitalize">{p.permission_level} access</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-extrabold text-slate-800">{p.adherence_score}%</p>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Adherence</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100/60 rounded-2xl flex items-center justify-center">
                            <UserCircle size={24} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-medium">No linked patients</p>
                        <p className="text-xs text-slate-300 mt-1">Use the form above to link one</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CaregiverDashboard;
