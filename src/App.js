import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import EventsPage from './pages/EventsPage';
import EventDetail from './pages/EventDetail';
import Registration from './pages/Registration';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import AttendanceManagement from './pages/Attendance/AttendanceManagement';
import ReportsPage from './pages/ReportsPage';
import { Calendar, LogOut, LogIn, LayoutDashboard, FileText } from 'lucide-react';
import './App.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token || !userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const NavigationBar = ({ userRole, username, onLogout }) => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <Calendar size={24} color="#4f46e5" />
        <span>CampusEvents</span>
      </Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>

        {userRole === 'ADMIN' && (
          <>
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <LayoutDashboard size={16} /> Admin
            </Link>
            <Link to="/reports" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <FileText size={16} /> Reports
            </Link>
          </>
        )}

        {userRole === 'ORGANIZER' && (
          <>
            <Link to="/organizer" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link to="/reports" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <FileText size={16} /> Reports
            </Link>
          </>
        )}

        {userRole ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>
              👤 {username || userRole}
            </span>
            <button
              onClick={onLogout}
              className="btn-outline"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}
          >
            <LogIn size={16} /> Login
          </Link>
        )}
      </div>
    </nav>
  );
};

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setUsername(localStorage.getItem('username'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    setUserRole(null);
    setUsername(null);
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="app-container">
        <NavigationBar userRole={userRole} username={username} onLogout={handleLogout} />

        <div className="content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/events" element={<EventsPage userRole={userRole} />} />
            <Route path="/event/:id" element={<EventDetail userRole={userRole} />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/register/:eventId" element={<Registration />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />

            {/* Admin only */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Organizer & Admin */}
            <Route
              path="/organizer"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'ORGANIZER']}>
                  <OrganizerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance/:eventId"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'ORGANIZER']}>
                  <AttendanceManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'ORGANIZER']}>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
