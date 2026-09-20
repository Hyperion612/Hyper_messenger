import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './lib/auth';
import './i18n';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Messenger from './pages/Messenger';
import Settings from './pages/Settings';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import Architecture from './pages/Architecture';
import Connect from './pages/Connect';
import { ErrorBoundary } from './components/ErrorBoundary';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const [isAdminAuth, setIsAdminAuth] = useState(() => {
    return sessionStorage.getItem('hyper_admin_auth') === 'true';
  });
  
  // Apply theme from localStorage
  useEffect(() => {
    const theme = localStorage.getItem('hyper_theme');
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    }
  }, []);

  // Listen for admin auth changes
  useEffect(() => {
    const interval = setInterval(() => {
      const auth = sessionStorage.getItem('hyper_admin_auth') === 'true';
      if (auth !== isAdminAuth) {
        setIsAdminAuth(auth);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isAdminAuth]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/architecture" element={<Architecture />} />
      
      {/* Protected routes */}
      <Route path="/app" element={<ProtectedRoute><Messenger /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/connect" element={<ProtectedRoute><Connect /></ProtectedRoute>} />
      
      {/* Admin routes (hidden) */}
      <Route path="/hyper-admin-7x9k" element={
        isAdminAuth ? <AdminPanel /> : <AdminLogin />
      } />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
