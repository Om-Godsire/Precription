import React, { useEffect, useState } from 'react';
import { patientAPI } from '../api/client';
import { Pill, BarChart3, AlertTriangle, Package, ClipboardList } from 'lucide-react';

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
        {
            label: 'Active Medications',
            value: data?.active_medications || 0,
            icon: <Pill size={22} />,
            gradient: 'from-blue-500 to-indigo-500',
            iconBg: 'bg-blue-100 text-blue-600',
            change: '+2 this week',
        },
        {
            label: 'Adherence Score',
            value: `${data?.adherence_score || 0}%`,
            icon: <BarChart3 size={22} />,
            gradient: 'from-emerald-500 to-teal-500',
            iconBg: 'bg-emerald-100 text-emerald-600',
            change: 'On track',
        },
        {
            label: 'Missed Doses',
            value: data?.missed_doses || 0,
            icon: <AlertTriangle size={22} />,
            gradient: 'from-amber-500 to-orange-500',
            iconBg: 'bg-amber-100 text-amber-600',
            change: 'Last 7 days',
        },
        {
            label: 'Upcoming Refills',
            value: data?.upcoming_refills || 0,
            icon: <Package size={22} />,
            gradient: 'from-purple-500 to-violet-500',
            iconBg: 'bg-purple-100 text-purple-600',
            change: 'Next 30 days',
        },
    ];

    return (
        <div className="space-y-6 animate-in">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-extrabold text-slate-800">Patient Dashboard</h1>
                <p className="text-slate-500 mt-1 text-sm">Your health overview at a glance</p>
            </div>

            {/* Bento stat grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                        <p className="text-xs text-slate-400 mt-0.5">{stat.change}</p>
                    </div>
                ))}
            </div>

            {/* Adherence Chart */}
            <div className="card">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-slate-800">Adherence Overview</h3>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100/60 px-3 py-1 rounded-full">This Month</span>
                </div>
                <div className="relative">
                    <div className="h-4 bg-slate-100/80 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 rounded-full transition-all duration-1000 ease-out relative"
                            style={{ width: `${data?.adherence_score || 0}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                        </div>
                    </div>
                    <div className="flex justify-between mt-3 text-xs font-medium text-slate-400">
                        <span>0%</span>
                        <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                            Target: 90%
                        </span>
                        <span>100%</span>
                    </div>
                </div>
            </div>

            {/* Recent Prescriptions */}
            <div className="card">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-slate-800">Recent Prescriptions</h3>
                    <span className="text-xs font-semibold text-primary-600 hover:text-primary-700 cursor-pointer">View All →</span>
                </div>
                {data?.recent_prescriptions?.length ? (
                    <div className="space-y-3">
                        {data.recent_prescriptions.map((rx: any, i: number) => (
                            <div key={rx.id} className={`flex items-center justify-between p-4 rounded-2xl bg-white/40 hover:bg-white/70 border border-slate-100/50 transition-all duration-300 hover:shadow-sm stagger-${i + 1} animate-slide-up`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary-100/80 rounded-xl flex items-center justify-center text-primary-600">
                                        <ClipboardList size={18} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm">Dr. {rx.doctor_name}</p>
                                        <p className="text-xs text-slate-400">Issued: {new Date(rx.issue_date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={rx.status === 'active' ? 'badge-active' : 'badge-warning'}>{rx.status}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100/60 rounded-2xl flex items-center justify-center">
                            <ClipboardList size={24} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-medium">No prescriptions yet</p>
                        <p className="text-xs text-slate-300 mt-1">Your prescriptions will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};


export default PatientDashboard;
