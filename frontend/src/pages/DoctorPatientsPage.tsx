import React, { useEffect, useState } from 'react';
import { doctorAPI } from '../api/client';
import { Users, Search, UserCircle, ClipboardList, Calendar, ChevronDown, ChevronUp, UserPlus, CheckCircle2, AlertTriangle, Mail, X } from 'lucide-react';

const DoctorPatientsPage: React.FC = () => {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [expandedPatient, setExpandedPatient] = useState<string | null>(null);
    const [patientHistory, setPatientHistory] = useState<Record<string, any[]>>({});
    const [historyLoading, setHistoryLoading] = useState<string | null>(null);

    // Add Patient form state
    const [showAddForm, setShowAddForm] = useState(false);
    const [addForm, setAddForm] = useState({ name: '', email: '' });
    const [addLoading, setAddLoading] = useState(false);
    const [addMsg, setAddMsg] = useState('');
    const [addError, setAddError] = useState(false);

    const loadPatients = (q: string = '') => {
        doctorAPI.searchPatients(q)
            .then(res => setPatients(res.data?.patients || res.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadPatients(); }, []);

    const handleSearch = async (q: string) => {
        setSearch(q);
        loadPatients(q);
    };

    const toggleHistory = async (patientId: string) => {
        if (expandedPatient === patientId) {
            setExpandedPatient(null);
            return;
        }
        setExpandedPatient(patientId);
        if (!patientHistory[patientId]) {
            setHistoryLoading(patientId);
            try {
                const res = await doctorAPI.getPatientHistory(patientId);
                setPatientHistory(prev => ({ ...prev, [patientId]: res.data?.prescriptions || res.data || [] }));
            } catch {
                setPatientHistory(prev => ({ ...prev, [patientId]: [] }));
            } finally {
                setHistoryLoading(null);
            }
        }
    };

    const handleAddPatient = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addForm.name.trim() || !addForm.email.trim()) return;
        setAddLoading(true);
        setAddMsg('');
        try {
            const res = await doctorAPI.addPatient(addForm);
            const msg = res.data.default_password
                ? `Patient added! Default password: ${res.data.default_password}`
                : res.data.message || 'Patient added successfully';
            setAddMsg(msg);
            setAddError(false);
            setAddForm({ name: '', email: '' });
            setShowAddForm(false);
            loadPatients(search);
        } catch (err: any) {
            setAddMsg(err.response?.data?.error || 'Failed to add patient');
            setAddError(true);
        } finally {
            setAddLoading(false);
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
                    <h1 className="text-2xl font-extrabold text-slate-800">My Patients</h1>
                    <p className="text-slate-500 mt-1 text-sm">View and manage your patients</p>
                </div>
                <button onClick={() => { setShowAddForm(!showAddForm); setAddMsg(''); }} className="btn-primary">
                    <span className="flex items-center gap-2">
                        {showAddForm ? <X size={16} /> : <UserPlus size={16} />}
                        {showAddForm ? 'Cancel' : 'Add Patient'}
                    </span>
                </button>
            </div>

            {/* Stat */}
            <div className="stat-card group stagger-1 animate-slide-up w-full sm:w-72">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                        <Users size={22} />
                    </div>
                    <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-60" />
                </div>
                <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{patients.length}</p>
                <p className="text-sm font-medium text-slate-500 mt-1">Total Patients</p>
            </div>

            {/* Add Patient Form */}
            {showAddForm && (
                <div className="card border-2 border-primary-200/40 animate-slide-up">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 bg-primary-100/80 rounded-xl flex items-center justify-center text-primary-600">
                            <UserPlus size={18} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Add New Patient</h3>
                            <p className="text-xs text-slate-400">Enter the patient's name and email address</p>
                        </div>
                    </div>
                    <form onSubmit={handleAddPatient} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Patient Name *</label>
                                <input
                                    className="input w-full"
                                    placeholder="Enter full name"
                                    value={addForm.name}
                                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Email Address *</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        className="input w-full pl-10"
                                        placeholder="patient@email.com"
                                        value={addForm.email}
                                        onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" disabled={addLoading}>
                            <span className="flex items-center gap-2">
                                {addLoading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <UserPlus size={16} />
                                )}
                                {addLoading ? 'Adding...' : 'Add Patient'}
                            </span>
                        </button>
                    </form>
                </div>
            )}

            {/* Success / Error message */}
            {addMsg && (
                <div className={`flex items-center gap-2 p-3 rounded-2xl text-sm font-medium animate-slide-up ${addError
                        ? 'bg-red-50/60 border border-red-200/40 text-red-600'
                        : 'bg-emerald-50/60 border border-emerald-200/40 text-emerald-600'
                    }`}>
                    {addError ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                    {addMsg}
                </div>
            )}

            {/* Search */}
            <div className="card">
                <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        className="input pl-11 w-full"
                        placeholder="Search patients by name or email..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Patient List */}
            <div className="card">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-slate-800">Patient List</h3>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100/60 px-3 py-1 rounded-full">{patients.length} found</span>
                </div>
                {patients.length ? (
                    <div className="space-y-3">
                        {patients.map((p: any, i: number) => {
                            const pid = p.id || p._id || p.patient_id;
                            const isExpanded = expandedPatient === pid;
                            return (
                                <div key={pid || i} className={`rounded-2xl bg-white/40 hover:bg-white/70 border border-slate-100/50 transition-all duration-300 hover:shadow-sm stagger-${(i % 5) + 1} animate-slide-up overflow-hidden`}>
                                    <div
                                        className="flex items-center justify-between p-4 cursor-pointer"
                                        onClick={() => toggleHistory(pid)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-glow-sm">
                                                {(p.name || p.patient_name || '?').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800 text-sm">{p.name || p.patient_name}</p>
                                                <p className="text-xs text-slate-400">{p.email || p.patient_email || ''}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {p.blood_group && (
                                                <span className="text-xs text-slate-500 bg-red-50/60 text-red-500 border border-red-200/40 px-2.5 py-1 rounded-lg font-semibold">
                                                    {p.blood_group}
                                                </span>
                                            )}
                                            {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                                        </div>
                                    </div>

                                    {/* Expandable History */}
                                    {isExpanded && (
                                        <div className="px-4 pb-4 border-t border-slate-100/50 animate-slide-up">
                                            {historyLoading === pid ? (
                                                <div className="flex items-center justify-center py-4">
                                                    <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                                                </div>
                                            ) : patientHistory[pid]?.length ? (
                                                <div className="mt-3 space-y-2">
                                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Prescription History</p>
                                                    {patientHistory[pid].map((rx: any, j: number) => (
                                                        <div key={rx.id || rx._id || j} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-primary-500">
                                                                    <ClipboardList size={14} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-slate-700">{rx.verification_code || `Rx #${j + 1}`}</p>
                                                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                                                        <Calendar size={10} />
                                                                        {new Date(rx.issue_date).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <span className={rx.status === 'active' ? 'badge-active' : 'badge-warning'}>{rx.status}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-400 py-3 text-center">No prescription history found</p>
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
                        <p className="text-slate-400 font-medium">No patients found</p>
                        <p className="text-xs text-slate-300 mt-1">Use the "Add Patient" button to add your first patient</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorPatientsPage;
