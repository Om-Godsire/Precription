import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1',
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('medvault_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses - try refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('medvault_refresh_token');
                if (refreshToken) {
                    const { data } = await axios.post('/api/v1/auth/refresh', { refreshToken });
                    localStorage.setItem('medvault_token', data.token);
                    localStorage.setItem('medvault_refresh_token', data.refreshToken);
                    originalRequest.headers.Authorization = `Bearer ${data.token}`;
                    return api(originalRequest);
                }
            } catch {
                localStorage.removeItem('medvault_token');
                localStorage.removeItem('medvault_refresh_token');
                localStorage.removeItem('medvault_user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: { email: string; password: string }) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
};

// Patient API
export const patientAPI = {
    getDashboard: () => api.get('/patient/dashboard'),
    getProfile: () => api.get('/patient/profile'),
    updateProfile: (data: any) => api.put('/patient/profile', data),
    getMedications: () => api.get('/patient/medications'),
    getAdherenceScore: () => api.get('/patient/adherence-score'),
    getPrescriptions: () => api.get('/patient/prescriptions'),
    regenerateEmergencyToken: () => api.post('/patient/emergency-token'),
};

// Adherence API
export const adherenceAPI = {
    logAdherence: (data: any) => api.post('/adherence/log', data),
    getLogs: (days?: number) => api.get(`/adherence/logs${days ? `?days=${days}` : ''}`),
    logSideEffect: (data: any) => api.post('/adherence/side-effects', data),
    getSideEffects: () => api.get('/adherence/side-effects'),
};

// Doctor API
export const doctorAPI = {
    getDashboard: () => api.get('/doctor/dashboard'),
    getProfile: () => api.get('/doctor/profile'),
    updateProfile: (data: any) => api.put('/doctor/profile', data),
    createPrescription: (data: any) => api.post('/doctor/prescriptions', data),
    getPrescriptions: () => api.get('/doctor/prescriptions'),
    searchPatients: (q: string) => api.get(`/doctor/patients/search?q=${q}`),
    getPatientHistory: (patientId: string) => api.get(`/doctor/patients/${patientId}/history`),
    addPatient: (data: { name: string; email: string }) => api.post('/doctor/patients', data),
};

// Pharmacy API
export const pharmacyAPI = {
    getDashboard: () => api.get('/pharmacy/dashboard'),
    verifyPrescription: (code: string) => api.get(`/pharmacy/verify/${code}`),
    logRefill: (data: any) => api.post('/pharmacy/refills', data),
    getRefills: () => api.get('/pharmacy/refills'),
};

// Caregiver API
export const caregiverAPI = {
    getDashboard: () => api.get('/caregiver/dashboard'),
    linkPatient: (data: any) => api.post('/caregiver/link', data),
    getLinkedPatients: () => api.get('/caregiver/patients'),
    getPatientDashboard: (patientId: string) => api.get(`/caregiver/patients/${patientId}`),
};

// Medicine API
export const medicineAPI = {
    search: (query: string) => api.get(`/medicines?search=${query}`),
    getAll: () => api.get('/medicines'),
    getById: (id: string) => api.get(`/medicines/${id}`),
    create: (data: any) => api.post('/medicines', data),
};

// Emergency API
export const emergencyAPI = {
    getQR: () => api.get('/emergency/qr/generate'),
    getPublicProfile: (token: string) => api.get(`/emergency/${token}`),
};

// Prescription API
export const prescriptionAPI = {
    getDetails: (id: string) => api.get(`/prescriptions/${id}`),
};

export default api;
