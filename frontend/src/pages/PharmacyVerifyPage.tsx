import React, { useState } from 'react';
import { pharmacyAPI } from '../api/client';
import { Search, ShieldCheck, CheckCircle2, AlertCircle, Pill, FileText } from 'lucide-react';

const PharmacyVerifyPage: React.FC = () => {
    const [verifyCode, setVerifyCode] = useState('');
    const [verifyResult, setVerifyResult] = useState<any>(null);
    const [verifyError, setVerifyError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (!verifyCode.trim()) return;
        setVerifyError('');
        setVerifyResult(null);
        setLoading(true);
        try {
            const { data } = await pharmacyAPI.verifyPrescription(verifyCode.trim());
            setVerifyResult(data);
        } catch {
            setVerifyError('Prescription not found or invalid code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-800">Verify Prescription</h1>
                <p className="text-slate-500 mt-1 text-sm">Enter a prescription code to verify its authenticity</p>
            </div>

            {/* Verification Form */}
            <div className="card">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 bg-primary-100/80 rounded-2xl flex items-center justify-center text-primary-600">
                        <Search size={22} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Prescription Lookup</h3>
                        <p className="text-xs text-slate-400">Enter the RX code printed on the prescription</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <input
                        className="input flex-1"
                        placeholder="Enter prescription code (e.g., RX-XXXXXXXX)"
                        value={verifyCode}
                        onChange={(e) => setVerifyCode(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                    />
                    <button onClick={handleVerify} className="btn-primary" disabled={loading}>
                        <span className="flex items-center gap-2">
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <ShieldCheck size={16} />
                            )}
                            Verify
                        </span>
                    </button>
                </div>

                {verifyError && (
                    <div className="mt-3 flex items-center gap-2 p-3 bg-red-50/60 border border-red-200/40 rounded-2xl text-red-600 text-sm font-medium animate-slide-up">
                        <AlertCircle size={16} />
                        {verifyError}
                    </div>
                )}
            </div>

            {/* Result */}
            {verifyResult && (
                <div className="card border-2 border-emerald-200/40 animate-slide-up">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                            <CheckCircle2 size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-emerald-800">Prescription Verified ✓</h3>
                            <p className="text-xs text-emerald-600">This prescription is authentic and valid</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                        <div className="p-3.5 bg-white/50 rounded-xl">
                            <span className="text-slate-400 text-xs font-semibold block mb-0.5">Patient</span>
                            <span className="font-semibold text-slate-800">{verifyResult.prescription?.patient_name}</span>
                        </div>
                        <div className="p-3.5 bg-white/50 rounded-xl">
                            <span className="text-slate-400 text-xs font-semibold block mb-0.5">Doctor</span>
                            <span className="font-semibold text-slate-800">{verifyResult.prescription?.doctor_name}</span>
                        </div>
                        <div className="p-3.5 bg-white/50 rounded-xl">
                            <span className="text-slate-400 text-xs font-semibold block mb-0.5">Issued</span>
                            <span className="font-semibold text-slate-800">{new Date(verifyResult.prescription?.issue_date).toLocaleDateString()}</span>
                        </div>
                        <div className="p-3.5 bg-white/50 rounded-xl">
                            <span className="text-slate-400 text-xs font-semibold block mb-0.5">Status</span>
                            <span className="badge-active">{verifyResult.prescription?.status}</span>
                        </div>
                    </div>

                    {verifyResult.medicines?.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Prescribed Medicines</p>
                            <div className="space-y-2">
                                {verifyResult.medicines.map((m: any, i: number) => (
                                    <div key={m.id || i} className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
                                        <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center text-primary-500">
                                            <Pill size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-semibold text-sm text-slate-800">{m.generic_name}</span>
                                            {m.brand_name && <span className="text-xs text-slate-400 ml-1">({m.brand_name})</span>}
                                            <p className="text-xs text-slate-500">{m.dosage} • {m.frequency}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Help text when no result */}
            {!verifyResult && !verifyError && (
                <div className="card">
                    <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100/60 rounded-2xl flex items-center justify-center">
                            <FileText size={24} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-medium">Enter a prescription code above</p>
                        <p className="text-xs text-slate-300 mt-1">The verification result will appear here</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PharmacyVerifyPage;
