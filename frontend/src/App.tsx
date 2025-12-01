/**import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from 'pages/Login';
import Settings from 'pages/Settings';
import LoadingSpinner from './components/LoadingSpinner';
import Detections from 'pages/Detections';
import LicensePlates from 'pages/LicensePlates';
import Cameras from 'pages/Cameras';


 * Main App component that handles routing and authentication
 * Provides the main application structure with protected routes
 */

/**
function App() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        {/* Public routes }
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          } 
        />
        
        {/* Protected routes }
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/cameras" element={<Cameras />} />
                  <Route path="/plates" element={<LicensePlates />} />
                  <Route path="/detections" element={<Detections />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;*/
/*
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cameras from './pages/Cameras';
import LicensePlates from './pages/LicensePlates';
import Detections from './pages/Detections';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Protected Routes with Layout }
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={
              <ProtectedRoute requiredRole="viewer">
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="cameras" element={
              <ProtectedRoute requiredRole="admin">
                <Cameras />
              </ProtectedRoute>
            } />
            <Route path="plates" element={
              <ProtectedRoute requiredRole="admin">
                <LicensePlates />
              </ProtectedRoute>
            } />
            <Route path="detections" element={
              <ProtectedRoute requiredRole="viewer">
                <Detections />
              </ProtectedRoute>
            } />
            <Route path="settings" element={
              <ProtectedRoute requiredRole="admin">
                <Settings />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Catch all route }
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;*/

// In App.tsx - COMPLETELY REVISED
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Cameras from './pages/Cameras';
import LicensePlates from './pages/LicensePlates';
import Detections from './pages/Detections';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Make Detections (Live Monitor) the default page */}
          <Route path="/" element={<Navigate to="/detections" replace />} />
          
          {/* Protected Routes with Layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            {/* REMOVED Dashboard route entirely */}
            
            {/* Live Monitor - accessible to both operator and admin */}
            <Route path="detections" element={
              <ProtectedRoute requiredRole="operator">
                <Detections />
              </ProtectedRoute>
            } />
            
            {/* Camera Systems - ADMIN ONLY */}
            <Route path="cameras" element={
              <ProtectedRoute requiredRole="admin">
                <Cameras />
              </ProtectedRoute>
            } />
            
            {/* Vehicle Registry - ADMIN ONLY */}
            <Route path="plates" element={
              <ProtectedRoute requiredRole="admin">
                <LicensePlates />
              </ProtectedRoute>
            } />
            
            {/* System Settings - ADMIN ONLY */}
            <Route path="settings" element={
              <ProtectedRoute requiredRole="admin">
                <Settings />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Catch all route - redirect to Live Monitor */}
          <Route path="*" element={<Navigate to="/detections" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;