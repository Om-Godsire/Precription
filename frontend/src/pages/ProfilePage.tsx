import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { patientAPI, doctorAPI } from '../api/client';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState<any>({});
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (user?.role === 'patient') {
                    const res = await patientAPI.getProfile();
                    setProfile(res.data);
                    setForm(res.data);
                } else if (user?.role === 'doctor') {
                    const res = await doctorAPI.getProfile();
                    setProfile(res.data);
                    setForm(res.data);
                }
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        fetchProfile();
    }, [user]);

    const handleSave = async () => {
        try {
            if (user?.role === 'patient') {
                await patientAPI.updateProfile(form);
            } else if (user?.role === 'doctor') {
                await doctorAPI.updateProfile(form);
            }
            setProfile(form);
            setEditing(false);
            setMsg('✅ Profile updated successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err: any) {
            setMsg('❌ ' + (err.response?.data?.error || 'Failed'));
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>;

    return (
        <div className="space-y-6 animate-in max-w-2xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
                    <p className="text-slate-500 mt-1">Manage your personal information</p>
                </div>
                <button onClick={() => editing ? handleSave() : setEditing(true)} className={editing ? 'btn-success' : 'btn-primary'}>
                    {editing ? '💾 Save Changes' : '✏️ Edit Profile'}
                </button>
            </div>

            {msg && <div className={`p-3 rounded-xl font-medium text-sm animate-slide-up ${msg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{msg}</div>}

            <div className="card">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold shadow-glow">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
                        <p className="text-slate-500">{user?.email}</p>
                        <span className="badge-info capitalize mt-1">{user?.role}</span>
                    </div>
                </div>

                {user?.role === 'patient' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">Blood Group</label>
                                <input className="input" value={form.blood_group || ''} disabled={!editing}
                                    onChange={(e) => setForm({ ...form, blood_group: e.target.value })} />
                            </div>
                            <div>
                                <label className="label">Phone</label>
                                <input className="input" value={form.phone || ''} disabled={!editing}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="label">Allergies</label>
                            <textarea className="input" rows={2} value={form.allergies || ''} disabled={!editing}
                                onChange={(e) => setForm({ ...form, allergies: e.target.value })} />
                        </div>
                        <div>
                            <label className="label">Chronic Conditions</label>
                            <textarea className="input" rows={2} value={form.chronic_conditions || ''} disabled={!editing}
                                onChange={(e) => setForm({ ...form, chronic_conditions: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">Emergency Contact Name</label>
                                <input className="input" value={form.emergency_contact_name || ''} disabled={!editing}
                                    onChange={(e) => setForm({ ...form, emergency_contact_name: e.target.value })} />
                            </div>
                            <div>
                                <label className="label">Emergency Contact Phone</label>
                                <input className="input" value={form.emergency_contact_phone || ''} disabled={!editing}
                                    onChange={(e) => setForm({ ...form, emergency_contact_phone: e.target.value })} />
                            </div>
                        </div>
                    </div>
                )}

                {user?.role === 'doctor' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">Specialization</label>
                                <input className="input" value={form.specialization || ''} disabled={!editing}
                                    onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
                            </div>
                            <div>
                                <label className="label">Clinic Name</label>
                                <input className="input" value={form.clinic_name || ''} disabled={!editing}
                                    onChange={(e) => setForm({ ...form, clinic_name: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="label">License Number</label>
                            <input className="input bg-slate-50" value={form.license_number || ''} disabled />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
