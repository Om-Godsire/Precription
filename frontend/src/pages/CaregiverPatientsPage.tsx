import React, { useEffect, useState } from 'react';
import { caregiverAPI } from '../api/client';
import { Users, Link2, CheckCircle2, AlertTriangle, UserCircle, Activity, ChevronDown, ChevronUp, Pill, BarChart3 } from 'lucide-react';

const CaregiverPatientsPage: React.FC = () => {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [linkEmail, setLinkEmail] = useState('');
    const [linkMsg, setLinkMsg] = useState('');
    const [linkError, setLinkError] = useState(false);
    const [expandedPatient, setExpandedPatient] = useState<string | null>(null);
    const [patientDetails, setPatientDetails] = useState<Record<string, any>>({});
    const [detailLoading, setDetailLoading] = useState<string | null>(null);

    const loadPatients = () => {
        caregiverAPI.getLinkedPatients()
            .then(res => setPatients(res.data?.patients || res.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadPatients(); }, []);

    const handleLink = async () => {
        if (!linkEmail.trim()) return;
        try {
            await caregiverAPI.linkPatient({ patient_email: linkEmail });
            setLinkMsg('Successfully linked to patient!');
            setLinkError(false);
            setLinkEmail('');
            loadPatients();
        } catch (err: any) {
            setLinkMsg(err.response?.data?.error || 'Failed to link');
            setLinkError(true);
        }
    };

    const toggleDetails = async (patientId: string) => {
        if (expandedPatient === patientId) {
            setExpandedPatient(null);
            return;
        }
        setExpandedPatient(patientId);
        if (!patientDetails[patientId]) {
            setDetailLoading(patientId);
            try {
                const res = await caregiverAPI.getPatientDashboard(patientId);
                setPatientDetails(prev => ({ ...prev, [patientId]: res.data }));
            } catch {
                setPatientDetails(prev => ({ ...prev, [patientId]: null }));
            } finally {
                setDetailLoading(null);
            }
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
                <h1 className="text-2xl font-extrabold text-slate-800">My Patients</h1>
                <p className="text-slate-500 mt-1 text-sm">Manage and monitor your linked patients</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="stat-card group stagger-1 animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                            <Users size={22} />
                        </div>
                        <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-60" />
                    </div>
                    <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{patients.length}</p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Linked Patients</p>
                </div>
                <div className="stat-card group stagger-2 animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                            <AlertTriangle size={22} />
                        </div>
                        <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 opacity-60" />
                    </div>
                    <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        {patients.filter((p: any) => (p.adherence_score || 100) < 80).length}
                    </p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Need Attention</p>
                </div>
            </div>

            {/* Link Patient */}
            <div className="card">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 bg-primary-100/80 rounded-xl flex items-center justify-center text-primary-600">
                        <Link2 size={18} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Link a Patient</h3>
                        <p className="text-xs text-slate-400">Enter a patient's email to add them to your care list</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <input
                        className="input flex-1"
                        placeholder="Enter patient's email"
                        value={linkEmail}
                        onChange={(e) => setLinkEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLink()}
                    />
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

            {/* Patient List */}
            <div className="card">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-slate-800">Linked Patients</h3>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100/60 px-3 py-1 rounded-full">{patients.length} total</span>
                </div>
                {patients.length ? (
                    <div className="space-y-3">
                        {patients.map((p: any, i: number) => {
                            const pid = p.patient_id || p.id || p._id;
                            const isExpanded = expandedPatient === pid;
                            return (
                                <div key={pid || i} className={`rounded-2xl bg-white/40 hover:bg-white/70 border border-slate-100/50 transition-all duration-300 hover:shadow-sm stagger-${(i % 5) + 1} animate-slide-up overflow-hidden`}>
                                    <div
                                        className="flex items-center justify-between p-4 cursor-pointer"
                                        onClick={() => toggleDetails(pid)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-glow-sm">
                                                {p.name?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800 text-sm">{p.name}</p>
                                                <p className="text-xs text-slate-400 capitalize">{p.permission_level || 'view'} access</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <p className="text-lg font-extrabold text-slate-800">{p.adherence_score ?? '—'}%</p>
                                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Adherence</p>
                                            </div>
                                            {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                                        </div>
                                    </div>

                                    {/* Expandable Details */}
                                    {isExpanded && (
                                        <div className="px-4 pb-4 border-t border-slate-100/50 animate-slide-up">
                                            {detailLoading === pid ? (
                                                <div className="flex items-center justify-center py-4">
                                                    <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                                                </div>
                                            ) : patientDetails[pid] ? (
                                                <div className="mt-3 space-y-3">
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                        <div className="p-3 bg-white/50 rounded-xl text-center">
                                                            <div className="flex items-center justify-center mb-1">
                                                                <Pill size={14} className="text-blue-500" />
                                                            </div>
                                                            <p className="text-lg font-bold text-slate-800">{patientDetails[pid].active_medications || 0}</p>
                                                            <p className="text-[10px] text-slate-400 font-semibold uppercase">Active Meds</p>
                                                        </div>
                                                        <div className="p-3 bg-white/50 rounded-xl text-center">
                                                            <div className="flex items-center justify-center mb-1">
                                                                <BarChart3 size={14} className="text-emerald-500" />
                                                            </div>
                                                            <p className="text-lg font-bold text-slate-800">{patientDetails[pid].adherence_score || 0}%</p>
                                                            <p className="text-[10px] text-slate-400 font-semibold uppercase">Adherence</p>
                                                        </div>
                                                        <div className="p-3 bg-white/50 rounded-xl text-center">
                                                            <div className="flex items-center justify-center mb-1">
                                                                <AlertTriangle size={14} className="text-amber-500" />
                                                            </div>
                                                            <p className="text-lg font-bold text-slate-800">{patientDetails[pid].missed_doses || 0}</p>
                                                            <p className="text-[10px] text-slate-400 font-semibold uppercase">Missed Doses</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-400 py-3 text-center">Unable to load patient details</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100/60 rounded-2xl flex items-center justify-center">
                            <UserCircle size={24} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-medium">No linked patients</p>
                        <p className="text-xs text-slate-300 mt-1">Use the form above to link a patient</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CaregiverPatientsPage;
