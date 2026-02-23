import React, { useEffect, useState } from 'react';
import { patientAPI } from '../api/client';

interface DashboardData {
    active_medications: number;
    adherence_score: number;
    missed_doses: number;
    upcoming_refills: number;
    recent_prescriptions: any[];
}

const PatientDashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        patientAPI.getDashboard()
            .then(res => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
    );

    const stats = [
        { label: 'Active Medications', value: data?.active_medications || 0, icon: '💊', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
        { label: 'Adherence Score', value: `${data?.adherence_score || 0}%`, icon: '📊', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Missed Doses', value: data?.missed_doses || 0, icon: '⚠️', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
        { label: 'Upcoming Refills', value: data?.upcoming_refills || 0, icon: '📦', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="space-y-6 animate-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Patient Dashboard</h1>
                    <p className="text-slate-500 mt-1">Your health overview at a glance</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="stat-card group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110`}>
                                {stat.icon}
                            </div>
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.color}`} />
                        </div>
                        <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                        <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Adherence Chart placeholder */}
            <div className="card">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Adherence Overview</h3>
                <div className="h-8 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3"
                        style={{ width: `${data?.adherence_score || 0}%` }}
                    >
                        <span className="text-xs font-bold text-white">{data?.adherence_score || 0}%</span>
                    </div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-slate-500">
                    <span>0%</span>
                    <span>Target: 90%</span>
                    <span>100%</span>
                </div>
            </div>

            {/* Recent Prescriptions */}
            <div className="card">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Prescriptions</h3>
                {data?.recent_prescriptions?.length ? (
                    <div className="space-y-3">
                        {data.recent_prescriptions.map((rx: any) => (
                            <div key={rx.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 text-lg">📋</div>
                                    <div>
                                        <p className="font-semibold text-slate-800">Dr. {rx.doctor_name}</p>
                                        <p className="text-sm text-slate-500">Issued: {new Date(rx.issue_date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={rx.status === 'active' ? 'badge-active' : 'badge-warning'}>{rx.status}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-400 text-center py-8">No prescriptions yet</p>
                )}
            </div>
        </div>
    );
};

export default PatientDashboard;
