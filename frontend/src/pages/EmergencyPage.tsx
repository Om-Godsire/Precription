import React, { useEffect, useState } from 'react';
import { emergencyAPI, patientAPI } from '../api/client';

const EmergencyPage: React.FC = () => {
    const [qrData, setQrData] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            emergencyAPI.getQR(),
            patientAPI.getProfile(),
        ]).then(([qrRes, profileRes]) => {
            setQrData(qrRes.data);
            setProfile(profileRes.data);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleRegenerate = async () => {
        try {
            await patientAPI.regenerateEmergencyToken();
            const res = await emergencyAPI.getQR();
            setQrData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>;

    return (
        <div className="space-y-6 animate-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">🚨 Emergency Information</h1>
                <p className="text-slate-500 mt-1">Share this QR code for quick access to your medical info</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* QR Code */}
                <div className="card text-center">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Emergency QR Code</h3>
                    {qrData?.qr_code && (
                        <div className="inline-block p-4 bg-white rounded-2xl shadow-lg border-2 border-primary-100">
                            <img src={qrData.qr_code} alt="Emergency QR Code" className="w-64 h-64" />
                        </div>
                    )}
                    <p className="text-sm text-slate-500 mt-4 max-w-xs mx-auto">
                        Scan this code to access your emergency medical profile. Share with emergency contacts.
                    </p>
                    <button onClick={handleRegenerate} className="btn-secondary mt-4 text-sm">
                        🔄 Regenerate QR Code
                    </button>
                </div>

                {/* Emergency Info */}
                <div className="space-y-4">
                    <div className="card border-2 border-red-100 bg-red-50">
                        <h3 className="text-lg font-bold text-red-800 mb-4">Medical Profile</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between p-3 bg-white rounded-xl">
                                <span className="text-slate-500 font-medium">Name</span>
                                <span className="font-semibold text-slate-800">{profile?.name}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-white rounded-xl">
                                <span className="text-slate-500 font-medium">Blood Group</span>
                                <span className="font-bold text-red-600 text-lg">{profile?.blood_group || 'N/A'}</span>
                            </div>
                            <div className="p-3 bg-white rounded-xl">
                                <span className="text-slate-500 font-medium block mb-1">Allergies</span>
                                <span className="font-medium text-slate-800">{profile?.allergies || 'None recorded'}</span>
                            </div>
                            <div className="p-3 bg-white rounded-xl">
                                <span className="text-slate-500 font-medium block mb-1">Chronic Conditions</span>
                                <span className="font-medium text-slate-800">{profile?.chronic_conditions || 'None recorded'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="card border-2 border-amber-100 bg-amber-50">
                        <h3 className="text-lg font-bold text-amber-800 mb-3">Emergency Contact</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between p-3 bg-white rounded-xl">
                                <span className="text-slate-500">Name</span>
                                <span className="font-medium">{profile?.emergency_contact_name || 'Not set'}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-white rounded-xl">
                                <span className="text-slate-500">Phone</span>
                                <span className="font-medium text-primary-600">{profile?.emergency_contact_phone || 'Not set'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmergencyPage;
