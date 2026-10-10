import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Calendar, Users, CheckCircle, XCircle, ClipboardList } from 'lucide-react';
import Button from '../components/UI/Button';

const OrganizerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('username') || 'organizer';

  useEffect(() => {
    fetchOrganizerStats();
  }, []);

  const fetchOrganizerStats = async () => {
    setLoading(true);
    try {
      // Using organizer ID 2 (seeded organizer account) with fallback handling
      const res = await api.get('/api/dashboard/organizer/2');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching organizer stats', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page-container center" style={{ padding: '4rem' }}>Loading Organizer Portal...</div>;
  }

  return (
    <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', margin: '0 0 6px', fontWeight: '800', color: '#0f172a' }}>
          Organizer Dashboard
        </h1>
        <p style={{ margin: 0, color: '#64748b' }}>
          Welcome back, <strong>{username}</strong>. Manage your assigned campus events and mark attendance.
        </p>
      </div>

      {/* Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '2.5rem'
      }}>
        <div className="card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '12px', backgroundColor: 'rgba(79, 70, 229, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
            <Calendar size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', margin: 0, fontWeight: '800', color: '#0f172a' }}>{stats?.totalEvents || 0}</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Managed Events</p>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '12px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
            <Users size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', margin: 0, fontWeight: '800', color: '#0f172a' }}>{stats?.totalParticipants || 0}</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Total Registrations</p>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '12px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
            <CheckCircle size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', margin: 0, fontWeight: '800', color: '#16a34a' }}>{stats?.present || 0}</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Present</p>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '12px', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
            <XCircle size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', margin: 0, fontWeight: '800', color: '#dc2626' }}>{stats?.absent || 0}</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Absent</p>
          </div>
        </div>
      </div>

      {/* Managed Events Grid */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1.2rem', color: '#0f172a' }}>
          Your Assigned Events
        </h2>

        {!stats?.managedEvents || stats.managedEvents.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <p>You currently do not have events assigned to your account.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {stats.managedEvents.map((event) => (
              <div
                key={event.id}
                className="card"
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>
                      {event.name}
                    </h3>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      backgroundColor: '#f0fdf4',
                      color: '#16a34a'
                    }}>
                      {event.attendancePercentage}% Present
                    </span>
                  </div>

                  <p style={{ margin: '0 0 16px', fontSize: '0.9rem', color: '#64748b' }}>
                    📍 {event.venue || 'Campus Venue'} • 📅 {event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '8px',
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '10px',
                    textAlign: 'center',
                    marginBottom: '20px',
                    fontSize: '0.85rem'
                  }}>
                    <div>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{event.participants}</div>
                      <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Registered</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: '#16a34a' }}>{event.present}</div>
                      <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Present</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: '#dc2626' }}>{event.absent}</div>
                      <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Absent</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link to={`/event/${event.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                    <Button type="outline" style={{ width: '100%', padding: '8px', fontSize: '0.9rem' }}>
                      Details
                    </Button>
                  </Link>
                  <Link to={`/attendance/${event.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                    <Button type="primary" style={{ width: '100%', padding: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <ClipboardList size={15} /> Attendance
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
