import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import EventsPage from './pages/EventsPage';
import EventDetail from './pages/EventDetail';
import AdminDashboard from './pages/AdminDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import ParticipantDashboard from './pages/ParticipantDashboard';
import RegistrationConfirmation from './pages/RegistrationConfirmation';
import { Sun, Moon } from 'lucide-react';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className={`app-container ${darkMode ? 'dark-theme' : ''}`}>
        <nav className="navbar">
          <div className="nav-logo">EventPro</div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/events">Events</Link>
            <Link to="/admin">Admin</Link>
            <Link to="/organizer">Organizer</Link>
            <Link to="/participant">My Profile</Link>
            <button
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </nav>

        <div className="content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/organizer" element={<OrganizerDashboard />} />
            <Route path="/participant" element={<ParticipantDashboard />} />
            <Route path="/confirmation" element={<RegistrationConfirmation />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
