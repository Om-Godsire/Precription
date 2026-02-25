import React, { useEffect, useState } from 'react';
import { doctorAPI } from '../api/client';
import { Users, ClipboardList, CheckCircle2, FileText } from 'lucide-react';

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
        {
            label: 'Total Patients',
            value: data?.total_patients || 0,
            icon: <Users size={22} />,
            iconBg: 'bg-blue-100 text-blue-600',
            gradient: 'from-blue-500 to-indigo-500',
        },
        {
            label: 'Total Prescriptions',
            value: data?.total_prescriptions || 0,
            icon: <ClipboardList size={22} />,
            iconBg: 'bg-emerald-100 text-emerald-600',
            gradient: 'from-emerald-500 to-teal-500',
        },
        {
            label: 'Active Prescriptions',
            value: data?.active_prescriptions || 0,
            icon: <CheckCircle2 size={22} />,
            iconBg: 'bg-amber-100 text-amber-600',
            gradient: 'from-amber-500 to-orange-500',
        },
    ];

    return (
        <div className="space-y-6 animate-in">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-800">Doctor Dashboard</h1>
                <p className="text-slate-500 mt-1 text-sm">Manage your patients and prescriptions</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

            <div className="card">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-slate-800">Recent Prescriptions</h3>
                    <span className="text-xs font-semibold text-primary-600 hover:text-primary-700 cursor-pointer">View All →</span>
                </div>
                {data?.recent_prescriptions?.length ? (
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
                                {data.recent_prescriptions.map((rx: any, i: number) => (
                                    <tr key={rx.id} className={`border-b border-slate-100/40 hover:bg-white/40 transition-all duration-200 stagger-${i + 1} animate-slide-up`}>
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
                        <p className="text-slate-400 font-medium">No prescriptions yet</p>
                        <p className="text-xs text-slate-300 mt-1">Create one from the sidebar</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;
