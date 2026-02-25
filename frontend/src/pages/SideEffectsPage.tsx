import React, { useEffect, useState } from 'react';
import { adherenceAPI, patientAPI } from '../api/client';
import { AlertTriangle, Plus, Calendar, Pill, Activity, Send, X } from 'lucide-react';

const severityColors: Record<string, string> = {
    mild: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    moderate: 'bg-amber-100 text-amber-700 border-amber-200',
    severe: 'bg-red-100 text-red-700 border-red-200',
};

const SideEffectsPage: React.FC = () => {
    const [sideEffects, setSideEffects] = useState<any[]>([]);
    const [medications, setMedications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ medicine_id: '', description: '', severity: 'mild' });
    const [submitting, setSubmitting] = useState(false);
    const [submitMsg, setSubmitMsg] = useState('');

    const loadData = async () => {
        try {
            const [seRes, medRes] = await Promise.all([
                adherenceAPI.getSideEffects(),
                patientAPI.getMedications(),
            ]);
            setSideEffects(seRes.data?.side_effects || seRes.data || []);
            setMedications(medRes.data?.medications || medRes.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.description.trim()) return;
        setSubmitting(true);
        setSubmitMsg('');
        try {
            await adherenceAPI.logSideEffect(form);
            setSubmitMsg('Side effect reported successfully!');
            setForm({ medicine_id: '', description: '', severity: 'mild' });
            setShowForm(false);
            loadData();
        } catch {
            setSubmitMsg('Failed to report side effect');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 animate-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800">Side Effects</h1>
                    <p className="text-slate-500 mt-1 text-sm">Track and report medication side effects</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                    <span className="flex items-center gap-2">
                        {showForm ? <X size={16} /> : <Plus size={16} />}
                        {showForm ? 'Cancel' : 'Report New'}
                    </span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="stat-card group stagger-1 animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                            <Activity size={22} />
                        </div>
                        <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-60" />
                    </div>
                    <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{sideEffects.length}</p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Total Reports</p>
                </div>
                <div className="stat-card group stagger-2 animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                            <AlertTriangle size={22} />
                        </div>
                        <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 opacity-60" />
                    </div>
                    <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        {sideEffects.filter((s: any) => s.severity === 'severe').length}
                    </p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Severe</p>
                </div>
                <div className="stat-card group stagger-3 animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                            <Pill size={22} />
                        </div>
                        <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-60" />
                    </div>
                    <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        {new Set(sideEffects.map((s: any) => s.medicine_id)).size}
                    </p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Medications Affected</p>
                </div>
            </div>

            {/* Report Form */}
            {showForm && (
                <div className="card border-2 border-primary-200/40 animate-slide-up">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Report a Side Effect</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1.5">Medication (optional)</label>
                            <select
                                className="input w-full"
                                value={form.medicine_id}
                                onChange={(e) => setForm({ ...form, medicine_id: e.target.value })}
                            >
                                <option value="">Select a medication...</option>
                                {medications.map((m: any) => (
                                    <option key={m.id || m._id} value={m.id || m._id}>
                                        {m.generic_name || m.name} {m.brand_name ? `(${m.brand_name})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1.5">Description *</label>
                            <textarea
                                className="input w-full min-h-[100px] resize-y"
                                placeholder="Describe the side effect you experienced..."
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1.5">Severity</label>
                            <div className="flex gap-3">
                                {['mild', 'moderate', 'severe'].map(sev => (
                                    <button
                                        key={sev}
                                        type="button"
                                        onClick={() => setForm({ ...form, severity: sev })}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 capitalize ${form.severity === sev
                                                ? severityColors[sev]
                                                : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                                            }`}
                                    >
                                        {sev}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" disabled={submitting}>
                            <span className="flex items-center gap-2">
                                <Send size={16} />
                                {submitting ? 'Submitting...' : 'Submit Report'}
                            </span>
                        </button>
                    </form>
                </div>
            )}

            {submitMsg && (
                <div className={`p-3 rounded-2xl text-sm font-medium animate-slide-up ${submitMsg.includes('success') ? 'bg-emerald-50/60 border border-emerald-200/40 text-emerald-600' : 'bg-red-50/60 border border-red-200/40 text-red-600'
                    }`}>
                    {submitMsg}
                </div>
            )}

            {/* Side Effects List */}
            <div className="card">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-slate-800">Reported Side Effects</h3>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100/60 px-3 py-1 rounded-full">{sideEffects.length} total</span>
                </div>
                {sideEffects.length ? (
                    <div className="space-y-3">
                        {sideEffects.map((se: any, i: number) => (
                            <div key={se.id || se._id || i} className={`p-4 rounded-2xl bg-white/40 hover:bg-white/70 border border-slate-100/50 transition-all duration-300 hover:shadow-sm stagger-${(i % 5) + 1} animate-slide-up`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-amber-100/80 rounded-xl flex items-center justify-center text-amber-600 mt-0.5">
                                            <AlertTriangle size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-800 text-sm">{se.description}</p>
                                            {se.medicine_name && (
                                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                    <Pill size={12} /> {se.medicine_name}
                                                </p>
                                            )}
                                            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                                <Calendar size={12} /> {new Date(se.reported_at || se.created_at || se.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border capitalize flex-shrink-0 ${severityColors[se.severity] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                        {se.severity || 'unknown'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100/60 rounded-2xl flex items-center justify-center">
                            <AlertTriangle size={24} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-medium">No side effects reported</p>
                        <p className="text-xs text-slate-300 mt-1">Use the "Report New" button to log any side effects</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SideEffectsPage;
