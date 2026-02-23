import React, { useEffect, useState } from 'react';
import { patientAPI } from '../api/client';

const MedicationsPage: React.FC = () => {
    const [meds, setMeds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        patientAPI.getMedications().then(res => setMeds(res.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>;

    return (
        <div className="space-y-6 animate-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Active Medications</h1>
                <p className="text-slate-500 mt-1">Your current prescribed medications</p>
            </div>

            {meds.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {meds.map((med) => (
                        <div key={med.id} className="card hover:-translate-y-1">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">💊</div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg">{med.generic_name}</h3>
                                        <p className="text-sm text-slate-500">{med.brand_name} • {med.strength}</p>
                                    </div>
                                </div>
                                <span className="badge-info">{med.form}</span>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                                    <span className="text-slate-500">Dosage</span>
                                    <span className="font-medium text-slate-800">{med.dosage}</span>
                                </div>
                                <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                                    <span className="text-slate-500">Frequency</span>
                                    <span className="font-medium text-slate-800">{med.frequency}</span>
                                </div>
                                {med.duration_days && (
                                    <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                                        <span className="text-slate-500">Duration</span>
                                        <span className="font-medium text-slate-800">{med.duration_days} days</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card text-center py-12">
                    <span className="text-5xl mb-4 block">💊</span>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No Active Medications</h3>
                    <p className="text-slate-500">Your doctor hasn't prescribed any medications yet.</p>
                </div>
            )}
        </div>
    );
};

export default MedicationsPage;
