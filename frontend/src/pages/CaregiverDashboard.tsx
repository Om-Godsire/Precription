import React, { useEffect, useState } from 'react';
import { caregiverAPI } from '../api/client';

const CaregiverDashboard: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [linkEmail, setLinkEmail] = useState('');
    const [linkMsg, setLinkMsg] = useState('');

    useEffect(() => {
        caregiverAPI.getDashboard().then(res => setData(res.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleLink = async () => {
        if (!linkEmail.trim()) return;
        try {
            await caregiverAPI.linkPatient({ patient_email: linkEmail });
            setLinkMsg('✅ Successfully linked to patient!');
            setLinkEmail('');
            caregiverAPI.getDashboard().then(res => setData(res.data));
        } catch (err: any) {
            setLinkMsg('❌ ' + (err.response?.data?.error || 'Failed to link'));
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
                <h1 className="text-2xl font-bold text-slate-800">Caregiver Dashboard</h1>
                <p className="text-slate-500 mt-1">Monitor your linked patients</p>
            </div>

            <div className="stat-card">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-4">👥</div>
                <p className="text-3xl font-bold text-slate-800">{data?.total_patients || 0}</p>
                <p className="text-sm text-slate-500 mt-1">Linked Patients</p>
            </div>

            {/* Link Patient */}
            <div className="card">
                <h3 className="text-lg font-bold text-slate-800 mb-4">🔗 Link a Patient</h3>
                <div className="flex gap-3">
                    <input className="input flex-1" placeholder="Enter patient's email" value={linkEmail}
                        onChange={(e) => setLinkEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLink()} />
                    <button onClick={handleLink} className="btn-primary">Link</button>
                </div>
                {linkMsg && <p className="mt-2 text-sm font-medium">{linkMsg}</p>}
            </div>

            {/* Alerts */}
            {data?.alerts?.length > 0 && (
                <div className="card border-2 border-amber-200 bg-amber-50">
                    <h3 className="text-lg font-bold text-amber-800 mb-4">⚠️ Missed Dose Alerts</h3>
                    <div className="space-y-3">
                        {data.alerts.map((a: any) => (
                            <div key={a.patient_id} className="flex items-center justify-between p-3 bg-white rounded-xl">
                                <div>
                                    <p className="font-semibold text-slate-800">{a.name}</p>
                                    <p className="text-sm text-amber-600">{a.missed_doses} missed doses</p>
                                </div>
                                <span className="badge-warning">Adherence: {a.adherence_score}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Patient List */}
            <div className="card">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Linked Patients</h3>
                {data?.patients?.length ? (
                    <div className="space-y-3">
                        {data.patients.map((p: any) => (
                            <div key={p.patient_id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                                        {p.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">{p.name}</p>
                                        <p className="text-sm text-slate-500 capitalize">{p.permission_level} access</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-slate-800">{p.adherence_score}%</p>
                                    <p className="text-xs text-slate-500">Adherence</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-400 text-center py-6">No linked patients. Use the form above to link one.</p>
                )}
            </div>
        </div>
    );
};

export default CaregiverDashboard;
