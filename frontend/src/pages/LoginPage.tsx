import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        }
        setLoading(false);
    };

    const demoLogins = [
        { role: 'Patient', email: 'patient@medvault.com' },
        { role: 'Doctor', email: 'doctor@medvault.com' },
        { role: 'Pharmacy', email: 'pharmacy@medvault.com' },
        { role: 'Caregiver', email: 'caregiver@medvault.com' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl shadow-glow mb-4">
                        <span className="text-3xl font-bold text-white">M</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">MedVault</h1>
                    <p className="text-primary-200 text-lg">Digital Medication Management</p>
                </div>

                {/* Login card */}
                <div className="glass rounded-3xl p-8 shadow-2xl">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Welcome Back</h2>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium animate-slide-up">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="label">Email Address</label>
                            <input type="email" className="input" placeholder="you@example.com"
                                value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div>
                            <label className="label">Password</label>
                            <input type="password" className="input" placeholder="••••••••"
                                value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full text-lg py-4">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-600">Don't have an account?{' '}
                            <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">Sign Up</Link>
                        </p>
                    </div>
                </div>

                {/* Demo logins */}
                <div className="mt-6 p-4 bg-white/10 backdrop-blur rounded-2xl">
                    <p className="text-primary-200 text-sm font-medium mb-3 text-center">Demo Accounts (password: Password123!)</p>
                    <div className="grid grid-cols-2 gap-2">
                        {demoLogins.map((demo) => (
                            <button
                                key={demo.role}
                                onClick={() => { setEmail(demo.email); setPassword('Password123!'); }}
                                className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-medium transition-all duration-200"
                            >
                                {demo.role}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
