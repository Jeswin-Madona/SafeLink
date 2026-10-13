import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserDashboard } from './pages/UserDashboard';
import { OfficialDashboard } from './pages/OfficialDashboard';
import { GuardianDashboard } from './pages/GuardianDashboard';
import { ReportIncidentPage } from './pages/ReportIncidentPage';
import { CommunityFeedPage } from './pages/CommunityFeedPage';
import { SafetyMapPage } from './pages/SafetyMapPage';
import { JourneysPage } from './pages/JourneysPage';
import { CompanionPage } from './pages/CompanionPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuditLogsPage } from './pages/AuditLogsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Application Routes under Enterprise Layout */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* User Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_ADMIN']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/safety-map"
              element={
                <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_ADMIN']}>
                  <SafetyMapPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report-incident"
              element={
                <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_ADMIN']}>
                  <ReportIncidentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_GUARDIAN', 'ROLE_OFFICIAL', 'ROLE_ADMIN']}>
                  <CommunityFeedPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/journeys"
              element={
                <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_ADMIN']}>
                  <JourneysPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/companion"
              element={
                <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_ADMIN']}>
                  <CompanionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/emergency"
              element={
                <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_ADMIN']}>
                  <EmergencyPage />
                </ProtectedRoute>
              }
            />

            {/* Guardian Routes */}
            <Route
              path="/guardian/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ROLE_GUARDIAN', 'ROLE_ADMIN']}>
                  <GuardianDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/guardian/connected-users"
              element={
                <ProtectedRoute allowedRoles={['ROLE_GUARDIAN', 'ROLE_ADMIN']}>
                  <GuardianDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/guardian/alerts"
              element={
                <ProtectedRoute allowedRoles={['ROLE_GUARDIAN', 'ROLE_ADMIN']}>
                  <GuardianDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/guardian/shared-journey"
              element={
                <ProtectedRoute allowedRoles={['ROLE_GUARDIAN', 'ROLE_ADMIN']}>
                  <GuardianDashboard />
                </ProtectedRoute>
              }
            />

            {/* Official Routes */}
            <Route
              path="/official/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ROLE_OFFICIAL', 'ROLE_ADMIN']}>
                  <OfficialDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/official/emergencies"
              element={
                <ProtectedRoute allowedRoles={['ROLE_OFFICIAL', 'ROLE_ADMIN']}>
                  <OfficialDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/official/incidents"
              element={
                <ProtectedRoute allowedRoles={['ROLE_OFFICIAL', 'ROLE_ADMIN']}>
                  <OfficialDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/official/community-review"
              element={
                <ProtectedRoute allowedRoles={['ROLE_OFFICIAL', 'ROLE_ADMIN']}>
                  <OfficialDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/official/map"
              element={
                <ProtectedRoute allowedRoles={['ROLE_OFFICIAL', 'ROLE_ADMIN']}>
                  <SafetyMapPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/official/audit-logs"
              element={
                <ProtectedRoute allowedRoles={['ROLE_OFFICIAL', 'ROLE_ADMIN']}>
                  <AuditLogsPage />
                </ProtectedRoute>
              }
            />

            {/* Common User Profile */}
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
