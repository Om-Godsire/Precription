import React, { useEffect, useState } from 'react';
import { adherenceAPI, patientAPI } from '../api/client';

const AdherencePage: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [meds, setMeds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [logMsg, setLogMsg] = useState('');

    useEffect(() => {
        Promise.all([
            adherenceAPI.getLogs(30),
            patientAPI.getMedications(),
        ]).then(([logsRes, medsRes]) => {
            setLogs(logsRes.data);
            setMeds(medsRes.data);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleLog = async (prescribed_medicine_id: string, status: 'taken' | 'missed' | 'skipped') => {
        try {
            await adherenceAPI.logAdherence({
                prescribed_medicine_id,
                scheduled_time: new Date().toISOString(),
                status,
                taken_time: status === 'taken' ? new Date().toISOString() : undefined,
            });
            setLogMsg(`✅ Marked as ${status}`);
            const res = await adherenceAPI.getLogs(30);
            setLogs(res.data);
            setTimeout(() => setLogMsg(''), 2000);
        } catch (err: any) {
            setLogMsg('❌ ' + (err.response?.data?.error || 'Failed'));
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>;

    return (
        <div className="space-y-6 animate-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Adherence Tracker</h1>
                <p className="text-slate-500 mt-1">Track your medication intake</p>
            </div>

            {logMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-medium text-sm animate-slide-up">
                    {logMsg}
                </div>
            )}

            {/* Quick actions */}
            {meds.length > 0 && (
                <div className="card">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Log Medication</h3>
                    <div className="space-y-3">
                        {meds.map((med) => (
                            <div key={med.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div>
                                    <p className="font-semibold text-slate-800">{med.generic_name} ({med.brand_name})</p>
                                    <p className="text-sm text-slate-500">{med.dosage} • {med.frequency}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleLog(med.id, 'taken')} className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">✓ Taken</button>
                                    <button onClick={() => handleLog(med.id, 'missed')} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">✗ Missed</button>
                                    <button onClick={() => handleLog(med.id, 'skipped')} className="px-4 py-2 bg-slate-400 text-white rounded-lg text-sm font-medium hover:bg-slate-500 transition-colors">⊘ Skip</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Log history */}
            <div className="card">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Recent History</h3>
                {logs.length ? (
                    <div className="space-y-2">
                        {logs.map((log) => (
                            <div key={log.id} className="flex items-center justify-between p-3 border-b border-slate-50">
                                <div className="flex items-center gap-3">
                                    <span className={`w-3 h-3 rounded-full ${log.status === 'taken' ? 'bg-emerald-400' : log.status === 'missed' ? 'bg-red-400' : 'bg-slate-400'}`} />
                                    <div>
                                        <p className="font-medium text-slate-800">{log.generic_name}</p>
                                        <p className="text-xs text-slate-500">{log.dosage} • {new Date(log.scheduled_time).toLocaleString()}</p>
                                    </div>
                                </div>
                                <span className={log.status === 'taken' ? 'badge-active' : log.status === 'missed' ? 'badge-danger' : 'badge-warning'}>
                                    {log.status}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-400 text-center py-6">No adherence logs yet</p>
                )}
            </div>
        </div>
    );
};

export default AdherencePage;
