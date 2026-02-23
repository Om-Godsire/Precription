import React, { useEffect, useState } from 'react';
import { doctorAPI } from '../api/client';

const DoctorDashboard: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        doctorAPI.getDashboard().then(res => setData(res.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
    );

    const stats = [
        { label: 'Total Patients', value: data?.total_patients || 0, icon: '👥', bg: 'bg-blue-50' },
        { label: 'Total Prescriptions', value: data?.total_prescriptions || 0, icon: '📋', bg: 'bg-emerald-50' },
        { label: 'Active Prescriptions', value: data?.active_prescriptions || 0, icon: '✅', bg: 'bg-amber-50' },
    ];

    return (
        <div className="space-y-6 animate-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Doctor Dashboard</h1>
                <p className="text-slate-500 mt-1">Manage your patients and prescriptions</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="stat-card group">
                        <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110`}>
                            {stat.icon}
                        </div>
                        <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                        <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="card">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Prescriptions</h3>
                {data?.recent_prescriptions?.length ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm text-slate-500 border-b border-slate-100">
                                    <th className="pb-3 font-semibold">Patient</th>
                                    <th className="pb-3 font-semibold">Date</th>
                                    <th className="pb-3 font-semibold">Status</th>
                                    <th className="pb-3 font-semibold">Code</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recent_prescriptions.map((rx: any) => (
                                    <tr key={rx.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <td className="py-3 font-medium text-slate-800">{rx.patient_name}</td>
                                        <td className="py-3 text-slate-600">{new Date(rx.issue_date).toLocaleDateString()}</td>
                                        <td className="py-3"><span className={rx.status === 'active' ? 'badge-active' : 'badge-warning'}>{rx.status}</span></td>
                                        <td className="py-3 font-mono text-sm text-primary-600">{rx.verification_code}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-slate-400 text-center py-8">No prescriptions yet. Create one from the sidebar.</p>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;
