import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PharmacyDashboard from './pages/PharmacyDashboard';
import CaregiverDashboard from './pages/CaregiverDashboard';
import MedicationsPage from './pages/MedicationsPage';
import AdherencePage from './pages/AdherencePage';
import EmergencyPage from './pages/EmergencyPage';
import CreatePrescriptionPage from './pages/CreatePrescriptionPage';
import ProfilePage from './pages/ProfilePage';
import NearbyCarePage from './pages/NearbyCarePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
    const { isAuthenticated, user, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8ecf8 50%, #f5f0ff 100%)' }}>
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-500 font-semibold">Loading MedVault...</p>
            </div>
        </div>
    );
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (roles && user && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
    return <>{children}</>;
};

const DashboardRouter: React.FC = () => {
    const { user } = useAuth();
    switch (user?.role) {
        case 'patient': return <PatientDashboard />;
        case 'doctor': return <DoctorDashboard />;
        case 'pharmacy': return <PharmacyDashboard />;
        case 'caregiver': return <CaregiverDashboard />;
        default: return <PatientDashboard />;
    }
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute><Layout><DashboardRouter /></Layout></ProtectedRoute>
                    } />

                    {/* Patient routes */}
                    <Route path="/medications" element={
                        <ProtectedRoute roles={['patient']}><Layout><MedicationsPage /></Layout></ProtectedRoute>
                    } />
                    <Route path="/adherence" element={
                        <ProtectedRoute roles={['patient']}><Layout><AdherencePage /></Layout></ProtectedRoute>
                    } />
                    <Route path="/emergency" element={
                        <ProtectedRoute roles={['patient']}><Layout><EmergencyPage /></Layout></ProtectedRoute>
                    } />
                    <Route path="/nearby" element={
                        <ProtectedRoute roles={['patient']}><Layout><NearbyCarePage /></Layout></ProtectedRoute>
                    } />

                    {/* Doctor routes */}
                    <Route path="/prescriptions/new" element={
                        <ProtectedRoute roles={['doctor']}><Layout><CreatePrescriptionPage /></Layout></ProtectedRoute>
                    } />

                    {/* Redirected placeholder routes */}
                    <Route path="/prescriptions" element={
                        <ProtectedRoute><Layout><DashboardRouter /></Layout></ProtectedRoute>
                    } />
                    <Route path="/side-effects" element={
                        <ProtectedRoute><Layout><DashboardRouter /></Layout></ProtectedRoute>
                    } />
                    <Route path="/patients" element={
                        <ProtectedRoute><Layout><DashboardRouter /></Layout></ProtectedRoute>
                    } />
                    <Route path="/verify" element={
                        <ProtectedRoute><Layout><DashboardRouter /></Layout></ProtectedRoute>
                    } />
                    <Route path="/refills" element={
                        <ProtectedRoute><Layout><DashboardRouter /></Layout></ProtectedRoute>
                    } />

                    {/* Shared routes */}
                    <Route path="/profile" element={
                        <ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>
                    } />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
