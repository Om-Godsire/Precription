import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: '', email: '', phone: '', password: '', confirmPassword: '',
        role: 'patient' as string,
        // Patient fields
        blood_group: '', allergies: '', chronic_conditions: '',
        emergency_contact_name: '', emergency_contact_phone: '',
        // Doctor fields
        specialization: '', clinic_name: '', license_number: '',
        // Pharmacy fields
        pharmacy_name: '', address: '',
    });

    const update = (field: string, value: string) => setForm({ ...form, [field]: value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const { confirmPassword, ...data } = form;
            await register(data);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-lg">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl shadow-glow mb-4">
                        <span className="text-3xl font-bold text-white">M</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-primary-200">Join MedVault today</p>
                </div>

                <div className="glass rounded-3xl p-8 shadow-2xl">
                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        {[1, 2].map((s) => (
                            <div key={s} className={`w-3 h-3 rounded-full transition-all duration-300 ${step >= s ? 'bg-primary-500 w-8' : 'bg-slate-300'}`} />
                        ))}
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium animate-slide-up">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {step === 1 && (
                            <>
                                <div>
                                    <label className="label">Full Name</label>
                                    <input className="input" placeholder="John Doe" value={form.name}
                                        onChange={(e) => update('name', e.target.value)} required />
                                </div>
                                <div>
                                    <label className="label">Email</label>
                                    <input type="email" className="input" placeholder="you@example.com" value={form.email}
                                        onChange={(e) => update('email', e.target.value)} required />
                                </div>
                                <div>
                                    <label className="label">Phone</label>
                                    <input className="input" placeholder="9876543210" value={form.phone}
                                        onChange={(e) => update('phone', e.target.value)} />
                                </div>
                                <div>
                                    <label className="label">Password</label>
                                    <input type="password" className="input" placeholder="Min 8 characters" value={form.password}
                                        onChange={(e) => update('password', e.target.value)} required minLength={8} />
                                </div>
                                <div>
                                    <label className="label">Confirm Password</label>
                                    <input type="password" className="input" placeholder="Re-enter password" value={form.confirmPassword}
                                        onChange={(e) => update('confirmPassword', e.target.value)} required />
                                </div>
                                <div>
                                    <label className="label">I am a...</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['patient', 'doctor', 'pharmacy', 'caregiver'].map((r) => (
                                            <button key={r} type="button"
                                                className={`p-3 rounded-xl border-2 text-sm font-semibold capitalize transition-all duration-200 ${form.role === r ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600 hover:border-primary-300'}`}
                                                onClick={() => update('role', r)}>
                                                {r === 'pharmacy' ? '🏥' : r === 'doctor' ? '🩺' : r === 'caregiver' ? '🤝' : '👤'} {r}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button type="button" onClick={() => setStep(2)} className="btn-primary w-full">
                                    Continue →
                                </button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                {form.role === 'patient' && (
                                    <>
                                        <div>
                                            <label className="label">Blood Group</label>
                                            <select className="input" value={form.blood_group} onChange={(e) => update('blood_group', e.target.value)}>
                                                <option value="">Select</option>
                                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg}>{bg}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="label">Allergies</label>
                                            <textarea className="input" rows={2} placeholder="e.g., Penicillin, Peanuts"
                                                value={form.allergies} onChange={(e) => update('allergies', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="label">Chronic Conditions</label>
                                            <textarea className="input" rows={2} placeholder="e.g., Diabetes, Hypertension"
                                                value={form.chronic_conditions} onChange={(e) => update('chronic_conditions', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="label">Emergency Contact Name</label>
                                            <input className="input" value={form.emergency_contact_name}
                                                onChange={(e) => update('emergency_contact_name', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="label">Emergency Contact Phone</label>
                                            <input className="input" value={form.emergency_contact_phone}
                                                onChange={(e) => update('emergency_contact_phone', e.target.value)} />
                                        </div>
                                    </>
                                )}

                                {form.role === 'doctor' && (
                                    <>
                                        <div>
                                            <label className="label">License Number *</label>
                                            <input className="input" placeholder="MH-MED-XXXX-XXXXX" value={form.license_number}
                                                onChange={(e) => update('license_number', e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="label">Specialization</label>
                                            <input className="input" placeholder="e.g., General Medicine" value={form.specialization}
                                                onChange={(e) => update('specialization', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="label">Clinic Name</label>
                                            <input className="input" placeholder="e.g., City Care Clinic" value={form.clinic_name}
                                                onChange={(e) => update('clinic_name', e.target.value)} />
                                        </div>
                                    </>
                                )}

                                {form.role === 'pharmacy' && (
                                    <>
                                        <div>
                                            <label className="label">Pharmacy Name</label>
                                            <input className="input" value={form.pharmacy_name}
                                                onChange={(e) => update('pharmacy_name', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="label">Address</label>
                                            <textarea className="input" rows={2} value={form.address}
                                                onChange={(e) => update('address', e.target.value)} />
                                        </div>
                                    </>
                                )}

                                {form.role === 'caregiver' && (
                                    <div className="text-center py-8">
                                        <span className="text-5xl mb-4 block">🤝</span>
                                        <p className="text-slate-600 text-lg">You can link patients after creating your account.</p>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">← Back</button>
                                    <button type="submit" disabled={loading} className="btn-primary flex-1">
                                        {loading ? 'Creating...' : 'Create Account'}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-600">Already have an account?{' '}
                            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
