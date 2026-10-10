import React, { useState, useEffect } from 'react';
import api from '../api';
import {
  Users,
  CheckCircle,
  XCircle,
  Percent,
  Calendar,
  MapPin
} from 'lucide-react';
import Input from '../components/UI/Input';

const ReportsPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [stats, setStats] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/api/events/public');
      setEvents(res.data);
      if (res.data.length > 0) {
        setSelectedEventId(res.data[0].id.toString());
        fetchEventReport(res.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching events for reports', error);
    }
  };

  const fetchEventReport = async (eventId) => {
    try {
      const [statsRes, participantsRes] = await Promise.all([
        api.get(`/api/participants/event/${eventId}/stats`),
        api.get(`/api/participants/event/${eventId}`)
      ]);
      setStats(statsRes.data);
      setParticipants(participantsRes.data);
    } catch (error) {
      console.error('Error fetching event report data', error);
    }
  };

  const handleEventChange = (e) => {
    const id = e.target.value;
    setSelectedEventId(id);
    fetchEventReport(id);
  };

  const filteredParticipants = participants.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.college.toLowerCase().includes(q) ||
      p.department.toLowerCase().includes(q)
    );
  });

  const selectedEvent = events.find((e) => e.id.toString() === selectedEventId);

  return (
    <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', margin: '0 0 6px', fontWeight: '800', color: '#0f172a' }}>
          Event Attendance Reports
        </h1>
        <p style={{ margin: 0, color: '#64748b' }}>
          Select an event to view official attendance statistics and attendee records
        </p>
      </div>

      {/* Event Selector Card */}
      <div className="card" style={{ padding: '20px', borderRadius: '16px', marginBottom: '2rem' }}>
        <div style={{ maxWidth: '480px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: '600', color: '#0f172a' }}>
            Select Event:
          </label>
          <select
            value={selectedEventId}
            onChange={handleEventChange}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '1rem',
              fontWeight: '500',
              backgroundColor: '#ffffff'
            }}
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.name} ({ev.category})
              </option>
            ))}
          </select>
        </div>

        {selectedEvent && (
          <div style={{ display: 'flex', gap: '20px', marginTop: '16px', fontSize: '0.9rem', color: '#64748b', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} color="#4f46e5" />
              {selectedEvent.date ? new Date(selectedEvent.date).toLocaleDateString() : 'TBA'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} color="#4f46e5" />
              {selectedEvent.venue}
            </span>
          </div>
        )}
      </div>

      {/* Attendance Stats Cards */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '2.5rem'
        }}>
          <div className="card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(79, 70, 229, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
              <Users size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', margin: 0, color: '#0f172a' }}>{stats.total}</h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Total Registrations</p>
            </div>
          </div>

          <div className="card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
              <CheckCircle size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', margin: 0, color: '#16a34a' }}>{stats.present}</h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Present Attendees</p>
            </div>
          </div>

          <div className="card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
              <XCircle size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', margin: 0, color: '#dc2626' }}>{stats.absent}</h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Absent</p>
            </div>
          </div>

          <div className="card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <Percent size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', margin: 0, color: '#059669' }}>{stats.percentage}%</h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Attendance Turnout</p>
            </div>
          </div>
        </div>
      )}

      {/* Attendee Details Table */}
      <div className="card" style={{ padding: '24px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '1.3rem', margin: 0, fontWeight: '700', color: '#0f172a' }}>
            Event Roster ({filteredParticipants.length})
          </h2>
          <div style={{ maxWidth: '300px', width: '100%' }}>
            <Input
              placeholder="Search by name, email or college..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filteredParticipants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <p>No participant records found for this event.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
                  <th style={{ padding: '12px 14px' }}>Participant</th>
                  <th style={{ padding: '12px 14px' }}>Email & Phone</th>
                  <th style={{ padding: '12px 14px' }}>Institution & Dept</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Attendance Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px', fontWeight: '600', color: '#0f172a' }}>
                      {p.name}
                    </td>
                    <td style={{ padding: '14px', color: '#334155' }}>
                      <div>{p.email}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{p.phone}</div>
                    </td>
                    <td style={{ padding: '14px', color: '#334155' }}>
                      <div>{p.college}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        {p.department} ({p.year})
                      </div>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        backgroundColor: p.attendance ? '#dcfce7' : '#fee2e2',
                        color: p.attendance ? '#166534' : '#991b1b'
                      }}>
                        {p.attendance ? <CheckCircle size={14} /> : <XCircle size={14} />}
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
  );
};

export default ReportsPage;
