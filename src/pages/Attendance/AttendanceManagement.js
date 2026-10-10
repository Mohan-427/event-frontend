import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';
import {
  Users,
  CheckCircle,
  XCircle,
  Percent,
  ArrowLeft,
  Trash2,
  Edit2
} from 'lucide-react';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';

const AttendanceManagement = () => {
  const { eventId } = useParams();
  const userRole = localStorage.getItem('userRole');

  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, percentage: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // Edit Modal State
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    year: ''
  });

  useEffect(() => {
    fetchEventAndData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const fetchEventAndData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Event Details
      const eventRes = await api.get(`/api/events/public/${eventId}`);
      setEvent(eventRes.data);

      // 2. Fetch Event Participants
      const participantsRes = await api.get(`/api/participants/event/${eventId}`);
      setParticipants(participantsRes.data);

      // 3. Fetch Event Stats
      const statsRes = await api.get(`/api/participants/event/${eventId}/stats`);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching event attendance data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAttendance = async (participantId, newStatus) => {
    try {
      await api.patch(`/api/participants/${participantId}/attendance`, null, {
        params: { status: newStatus }
      });

      // Optimistically update local participant list
      const updatedList = participants.map((p) =>
        p.id === participantId ? { ...p, attendance: newStatus } : p
      );
      setParticipants(updatedList);

      // Recalculate live stats
      const total = updatedList.length;
      const present = updatedList.filter((p) => p.attendance).length;
      const absent = total - present;
      const percentage = total === 0 ? 0 : Math.round((present * 100) / total);
      setStats({ total, present, absent, percentage });

      showFeedback('Attendance status updated successfully!', 'success');
    } catch (error) {
      showFeedback('Failed to update attendance.', 'error');
    }
  };

  const showFeedback = (text, type = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Admin: Delete registration
  const handleDeleteParticipant = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove registration for ${name}?`)) {
      try {
        await api.delete(`/api/participants/${id}`);
        showFeedback(`Removed ${name} from event registrations.`, 'success');
        fetchEventAndData();
      } catch (err) {
        showFeedback('Failed to delete participant.', 'error');
      }
    }
  };

  // Admin: Open Edit modal
  const handleOpenEdit = (p) => {
    setEditingParticipant(p);
    setEditForm({
      name: p.name || '',
      email: p.email || '',
      phone: p.phone || '',
      college: p.college || '',
      department: p.department || '',
      year: p.year || ''
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/participants/${editingParticipant.id}`, editForm);
      setEditingParticipant(null);
      showFeedback('Participant details updated successfully.', 'success');
      fetchEventAndData();
    } catch (err) {
      alert('Failed to update participant details.');
    }
  };

  const filteredParticipants = participants.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      (p.college && p.college.toLowerCase().includes(q))
    );
  });

  return (
    <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px' }}>
        <Link
          to={userRole === 'ADMIN' ? '/admin' : '/organizer'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#64748b',
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontWeight: '500'
          }}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
          Event ID: #{eventId}
        </span>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', margin: '0 0 6px', fontWeight: '800', color: '#0f172a' }}>
          Attendance Management
        </h1>
        {event && (
          <p style={{ margin: 0, color: '#4f46e5', fontWeight: '600', fontSize: '1.1rem' }}>
            {event.name} • {event.venue}
          </p>
        )}
      </div>

      {feedback && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '10px',
          backgroundColor: feedback.type === 'success' ? '#dcfce7' : '#fee2e2',
          color: feedback.type === 'success' ? '#166534' : '#991b1b',
          marginBottom: '1.5rem',
          fontWeight: '500',
          fontSize: '0.95rem'
        }}>
          {feedback.text}
        </div>
      )}

      {/* Attendance Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(79, 70, 229, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
            <Users size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.8rem', margin: 0, color: '#0f172a' }}>{stats.total}</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Total Registered</p>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.8rem', margin: 0, color: '#16a34a' }}>{stats.present}</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Present</p>
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
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Attendance Rate</p>
          </div>
        </div>
      </div>

      {/* Participant List & Attendance Table */}
      <div className="card" style={{ padding: '24px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '1.3rem', margin: 0, fontWeight: '700', color: '#0f172a' }}>
            Registered Participants ({filteredParticipants.length})
          </h2>
          <div style={{ maxWidth: '320px', width: '100%' }}>
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading attendance sheet...</div>
        ) : filteredParticipants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <p>No participants registered for this event.</p>
            <Link to={`/register/${eventId}`}>
              <Button type="primary" style={{ padding: '8px 16px', marginTop: '10px' }}>Register Participant</Button>
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
                  <th style={{ padding: '12px 14px' }}>Participant</th>
                  <th style={{ padding: '12px 14px' }}>Contact</th>
                  <th style={{ padding: '12px 14px' }}>College / Dept</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Attendance Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Mark Attendance</th>
                  {userRole === 'ADMIN' && (
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px', fontWeight: '600', color: '#0f172a' }}>
                      {p.name}
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '400' }}>
                        ID: #{p.id}
                      </div>
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
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => handleToggleAttendance(p.id, true)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: p.attendance ? '2px solid #16a34a' : '1px solid #cbd5e1',
                            backgroundColor: p.attendance ? '#16a34a' : '#ffffff',
                            color: p.attendance ? '#ffffff' : '#334155',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            transition: 'all 0.15s'
                          }}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleToggleAttendance(p.id, false)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: !p.attendance ? '2px solid #dc2626' : '1px solid #cbd5e1',
                            backgroundColor: !p.attendance ? '#dc2626' : '#ffffff',
                            color: !p.attendance ? '#ffffff' : '#334155',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            transition: 'all 0.15s'
                          }}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                    {userRole === 'ADMIN' && (
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            style={{
                              padding: '6px 8px',
                              border: '1px solid #cbd5e1',
                              background: '#ffffff',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              color: '#4f46e5'
                            }}
                            title="Edit Registration"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteParticipant(p.id, p.name)}
                            style={{
                              padding: '6px 8px',
                              border: '1px solid #fee2e2',
                              background: '#fff5f5',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              color: '#ef4444'
                            }}
                            title="Delete Registration"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin Edit Participant Modal */}
      {editingParticipant && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '24px' }}>
            <h2 style={{ margin: '0 0 1.2rem', fontSize: '1.4rem', fontWeight: '700' }}>
              Edit Registration Details
            </h2>

            <form onSubmit={handleSaveEdit}>
              <div style={{ marginBottom: '1rem' }}>
                <Input
                  label="Name"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
                <div>
                  <Input
                    label="Email"
                    required
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <Input
                    label="Phone"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <Input
                  label="College"
                  required
                  value={editForm.college}
                  onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '1.5rem' }}>
                <div>
                  <Input
                    label="Department"
                    required
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500' }}>Year</label>
                  <select
                    value={editForm.year}
                    onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setEditingParticipant(null)}
                  style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <Button type="primary" style={{ padding: '8px 20px' }}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
