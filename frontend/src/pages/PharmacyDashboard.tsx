import React, { useEffect, useState } from 'react';
import { pharmacyAPI } from '../api/client';

const PharmacyDashboard: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [verifyCode, setVerifyCode] = useState('');
    const [verifyResult, setVerifyResult] = useState<any>(null);
    const [verifyError, setVerifyError] = useState('');

    useEffect(() => {
        pharmacyAPI.getDashboard().then(res => setData(res.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleVerify = async () => {
        if (!verifyCode.trim()) return;
        setVerifyError('');
        setVerifyResult(null);
        try {
            const { data } = await pharmacyAPI.verifyPrescription(verifyCode.trim());
            setVerifyResult(data);
        } catch {
            setVerifyError('Prescription not found or invalid code');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 animate-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Pharmacy Dashboard</h1>
                <p className="text-slate-500 mt-1">Manage prescriptions and refills</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="stat-card">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-4">📦</div>
                    <p className="text-3xl font-bold text-slate-800">{data?.total_refills || 0}</p>
                    <p className="text-sm text-slate-500 mt-1">Total Refills</p>
                </div>
                <div className="stat-card">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-2xl mb-4">📅</div>
                    <p className="text-3xl font-bold text-slate-800">{data?.today_refills || 0}</p>
                    <p className="text-sm text-slate-500 mt-1">Today's Refills</p>
                </div>
            </div>

            {/* Prescription Verification */}
            <div className="card">
                <h3 className="text-lg font-bold text-slate-800 mb-4">🔍 Verify Prescription</h3>
                <div className="flex gap-3">
                    <input className="input flex-1" placeholder="Enter prescription code (e.g., RX-XXXXXXXX)"
                        value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleVerify()} />
                    <button onClick={handleVerify} className="btn-primary">Verify</button>
                </div>

                {verifyError && <p className="mt-3 text-red-500 font-medium">{verifyError}</p>}

                {verifyResult && (
                    <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200 animate-slide-up">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-emerald-600 text-xl">✅</span>
                            <h4 className="font-bold text-emerald-800">Prescription Verified</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div><span className="text-slate-500">Patient:</span> <span className="font-medium">{verifyResult.prescription.patient_name}</span></div>
                            <div><span className="text-slate-500">Doctor:</span> <span className="font-medium">{verifyResult.prescription.doctor_name}</span></div>
                            <div><span className="text-slate-500">Issued:</span> <span className="font-medium">{new Date(verifyResult.prescription.issue_date).toLocaleDateString()}</span></div>
                            <div><span className="text-slate-500">Status:</span> <span className="badge-active">{verifyResult.prescription.status}</span></div>
                        </div>
                        <div className="mt-3">
                            <p className="text-sm font-semibold text-slate-700 mb-2">Medicines:</p>
                            {verifyResult.medicines?.map((m: any) => (
                                <div key={m.id} className="py-2 border-t border-emerald-100 text-sm">
                                    <span className="font-medium">{m.generic_name}</span> ({m.brand_name}) — {m.dosage}, {m.frequency}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Recent Refills */}
            <div className="card">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Refills</h3>
                {data?.recent_refills?.length ? (
                    <div className="space-y-3">
                        {data.recent_refills.map((r: any) => (
                            <div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <div>
                                    <p className="font-medium text-slate-800">{r.generic_name} ({r.brand_name})</p>
                                    <p className="text-sm text-slate-500">Patient: {r.patient_name}</p>
                                </div>
                                <span className="text-sm text-slate-500">{new Date(r.refill_date).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-400 text-center py-6">No refills yet</p>
                )}
            </div>
        </div>
    );
};

export default PharmacyDashboard;
