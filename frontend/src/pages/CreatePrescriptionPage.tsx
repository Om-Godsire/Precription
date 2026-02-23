import React, { useEffect, useState } from 'react';
import { doctorAPI, medicineAPI } from '../api/client';

const CreatePrescriptionPage: React.FC = () => {
    const [patients, setPatients] = useState<any[]>([]);
    const [searchQ, setSearchQ] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [diagnosis, setDiagnosis] = useState('');
    const [validUntil, setValidUntil] = useState('');
    const [medicines, setMedicines] = useState<any[]>([]);
    const [medSearch, setMedSearch] = useState('');
    const [medResults, setMedResults] = useState<any[]>([]);
    const [prescribedMeds, setPrescribedMeds] = useState<any[]>([]);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const searchPatients = async (q: string) => {
        setSearchQ(q);
        if (q.length >= 2) {
            const res = await doctorAPI.searchPatients(q);
            setPatients(res.data);
        } else { setPatients([]); }
    };

    const searchMedicines = async (q: string) => {
        setMedSearch(q);
        if (q.length >= 2) {
            const res = await medicineAPI.search(q);
            setMedResults(res.data);
        } else { setMedResults([]); }
    };

    const addMedicine = (med: any) => {
        if (prescribedMeds.find(p => p.medicine_id === med.id)) return;
        setPrescribedMeds([...prescribedMeds, {
            medicine_id: med.id, name: `${med.generic_name} (${med.brand_name || ''})`,
            dosage: '', frequency: '', duration_days: 30, instructions: '',
        }]);
        setMedSearch('');
        setMedResults([]);
    };

    const updateMed = (idx: number, field: string, value: any) => {
        const updated = [...prescribedMeds];
        updated[idx] = { ...updated[idx], [field]: value };
        setPrescribedMeds(updated);
    };

    const removeMed = (idx: number) => setPrescribedMeds(prescribedMeds.filter((_, i) => i !== idx));

    const handleSubmit = async () => {
        if (!selectedPatient || prescribedMeds.length === 0) {
            setMsg('❌ Select a patient and add at least one medicine');
            return;
        }
        setLoading(true);
        try {
            const res = await doctorAPI.createPrescription({
                patient_id: selectedPatient.id,
                diagnosis_notes: diagnosis,
                valid_until: validUntil || undefined,
                medicines: prescribedMeds.map(m => ({
                    medicine_id: m.medicine_id,
                    dosage: m.dosage,
                    frequency: m.frequency,
                    duration_days: parseInt(m.duration_days) || 30,
                    instructions: m.instructions,
                })),
            });
            setMsg(`✅ Prescription created! Code: ${res.data.verification_code}`);
            setSelectedPatient(null); setDiagnosis(''); setPrescribedMeds([]);
        } catch (err: any) {
            setMsg('❌ ' + (err.response?.data?.error || 'Failed'));
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6 animate-in max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Create Prescription</h1>
                <p className="text-slate-500 mt-1">Write a new digital prescription</p>
            </div>

            {msg && <div className={`p-4 rounded-xl font-medium text-sm animate-slide-up ${msg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg}</div>}

            {/* Patient search */}
            <div className="card">
                <h3 className="text-lg font-bold text-slate-800 mb-4">👤 Select Patient</h3>
                {selectedPatient ? (
                    <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
                        <div>
                            <p className="font-semibold text-slate-800">{selectedPatient.name}</p>
                            <p className="text-sm text-slate-500">{selectedPatient.email} • Blood: {selectedPatient.blood_group || 'N/A'}</p>
                        </div>
                        <button onClick={() => setSelectedPatient(null)} className="text-red-500 hover:text-red-600 font-medium text-sm">Change</button>
                    </div>
                ) : (
                    <div>
                        <input className="input" placeholder="Search patients by name or email..." value={searchQ}
                            onChange={(e) => searchPatients(e.target.value)} />
                        {patients.length > 0 && (
                            <div className="mt-2 border border-slate-200 rounded-xl overflow-hidden">
                                {patients.map((p) => (
                                    <button key={p.id} onClick={() => { setSelectedPatient(p); setPatients([]); setSearchQ(''); }}
                                        className="w-full text-left p-3 hover:bg-primary-50 border-b border-slate-100 transition-colors">
                                        <p className="font-medium">{p.name}</p>
                                        <p className="text-sm text-slate-500">{p.email}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Diagnosis */}
            <div className="card">
                <h3 className="text-lg font-bold text-slate-800 mb-4">📋 Diagnosis</h3>
                <textarea className="input" rows={3} placeholder="Diagnosis notes..."
                    value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
                <div className="mt-3">
                    <label className="label">Valid Until</label>
                    <input type="date" className="input w-auto" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
                </div>
            </div>

            {/* Medicines */}
            <div className="card">
                <h3 className="text-lg font-bold text-slate-800 mb-4">💊 Medicines</h3>
                <input className="input mb-3" placeholder="Search medicines..." value={medSearch}
                    onChange={(e) => searchMedicines(e.target.value)} />
                {medResults.length > 0 && (
                    <div className="mb-4 border border-slate-200 rounded-xl overflow-hidden max-h-40 overflow-y-auto">
                        {medResults.map((m) => (
                            <button key={m.id} onClick={() => addMedicine(m)}
                                className="w-full text-left p-3 hover:bg-primary-50 border-b border-slate-100 text-sm transition-colors">
                                <span className="font-medium">{m.generic_name}</span> ({m.brand_name}) • {m.strength} • {m.form}
                            </button>
                        ))}
                    </div>
                )}

                {prescribedMeds.map((med, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl mb-3 animate-slide-up">
                        <div className="flex items-center justify-between mb-3">
                            <p className="font-semibold text-slate-800">{med.name}</p>
                            <button onClick={() => removeMed(idx)} className="text-red-500 text-sm font-medium hover:text-red-600">Remove</button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="label text-xs">Dosage *</label>
                                <input className="input py-2 text-sm" placeholder="e.g., 500mg" value={med.dosage}
                                    onChange={(e) => updateMed(idx, 'dosage', e.target.value)} />
                            </div>
                            <div>
                                <label className="label text-xs">Frequency *</label>
                                <input className="input py-2 text-sm" placeholder="e.g., Twice daily" value={med.frequency}
                                    onChange={(e) => updateMed(idx, 'frequency', e.target.value)} />
                            </div>
                            <div>
                                <label className="label text-xs">Duration (days)</label>
                                <input type="number" className="input py-2 text-sm" value={med.duration_days}
                                    onChange={(e) => updateMed(idx, 'duration_days', e.target.value)} />
                            </div>
                            <div>
                                <label className="label text-xs">Instructions</label>
                                <input className="input py-2 text-sm" placeholder="e.g., Take with meals" value={med.instructions}
                                    onChange={(e) => updateMed(idx, 'instructions', e.target.value)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full text-lg py-4">
                {loading ? 'Creating...' : '✍️ Create & Digitally Sign Prescription'}
            </button>
        </div>
    );
};

export default CreatePrescriptionPage;
