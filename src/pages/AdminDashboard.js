import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Plus,
  ClipboardList
} from 'lucide-react';
import Button from '../components/UI/Button';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/dashboard/admin');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching admin dashboard stats', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page-container center" style={{ padding: '4rem' }}>Loading Admin Dashboard...</div>;
  }

  if (!stats) {
    return (
      <div className="page-container center" style={{ padding: '4rem' }}>
        <p>Failed to load dashboard data. Please make sure the backend is reachable.</p>
        <Button onClick={fetchDashboardStats} type="primary">Retry</Button>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', margin: '0 0 6px', fontWeight: '800', color: '#0f172a' }}>
            Admin Dashboard
          </h1>
          <p style={{ margin: 0, color: '#64748b' }}>
            System overview, college event registrations & attendance metrics
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/events" style={{ textDecoration: 'none' }}>
            <Button type="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px' }}>
              <Plus size={18} /> Manage Events
            </Button>
          </Link>
          <Link to="/reports" style={{ textDecoration: 'none' }}>
            <Button type="outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px' }}>
              <ClipboardList size={18} /> Event Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
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
            <h3 style={{ fontSize: '2rem', margin: 0, fontWeight: '800', color: '#0f172a' }}>{stats.totalEvents}</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>Total Events</p>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '12px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
            <Users size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', margin: 0, fontWeight: '800', color: '#0f172a' }}>{stats.totalRegistrations}</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>Total Registrations</p>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '12px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
            <CheckCircle size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', margin: 0, fontWeight: '800', color: '#16a34a' }}>{stats.totalPresent}</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>Present Participants</p>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '12px', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
            <XCircle size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', margin: 0, fontWeight: '800', color: '#dc2626' }}>{stats.totalAbsent}</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>Absent Participants</p>
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Upcoming Events & Recent Registrations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px' }}>
        {/* Upcoming Events */}
        <div className="card" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: '700', color: '#0f172a' }}>
              Upcoming Events
            </h2>
            <Link to="/events" style={{ fontSize: '0.85rem', color: '#4f46e5', fontWeight: '600', textDecoration: 'none' }}>
              View all
            </Link>
          </div>

          {!stats.upcomingEvents || stats.upcomingEvents.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>No upcoming events.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stats.upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1px solid #f1f5f9',
                    backgroundColor: '#f8fafc',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '1rem', color: '#0f172a' }}>{event.name}</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                      📍 {event.venue} • 📅 {event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/attendance/${event.id}`}>
                      <button
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: '#4f46e5',
                          color: '#ffffff',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '500'
                        }}
                      >
                        Attendance
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Registrations */}
        <div className="card" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: '700', color: '#0f172a' }}>
              Recent Registrations
            </h2>
            <Link to="/reports" style={{ fontSize: '0.85rem', color: '#4f46e5', fontWeight: '600', textDecoration: 'none' }}>
              All participants
            </Link>
          </div>

          {!stats.recentRegistrations || stats.recentRegistrations.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>No registrations yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b' }}>
                    <th style={{ padding: '10px 8px' }}>Student</th>
                    <th style={{ padding: '10px 8px' }}>Event</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center' }}>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentRegistrations.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '10px 8px' }}>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{p.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.college}</div>
                      </td>
                      <td style={{ padding: '10px 8px', color: '#334155' }}>
                        {p.event?.name || 'Assigned Event'}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: p.attendance ? '#dcfce7' : '#fee2e2',
                          color: p.attendance ? '#166534' : '#991b1b'
                        }}>
                          {p.attendance ? 'Present' : 'Absent'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
