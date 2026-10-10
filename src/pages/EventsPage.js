import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Plus, Edit2, Trash2, Calendar, MapPin, User, CheckCircle } from 'lucide-react';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

const EventsPage = ({ userRole }) => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Admin Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Technical',
    date: '',
    time: '',
    venue: '',
    bannerUrl: ''
  });
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/events/public');
      setEvents(res.data);
    } catch (error) {
      console.error('Error fetching events', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Technical', 'Workshop', 'Hackathon', 'Cultural', 'Seminar', 'Sports'];

  const filteredEvents = events.filter((e) => {
    const matchesCategory = filter === 'All' || e.category === filter;
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(search.toLowerCase())) ||
      (e.venue && e.venue.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingEvent(null);
    setFormData({
      name: '',
      description: '',
      category: 'Technical',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      venue: '',
      bannerUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80'
    });
    setModalError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name || '',
      description: event.description || '',
      category: event.category || 'Technical',
      date: event.date ? (typeof event.date === 'string' && event.date.includes('T') ? event.date.split('T')[0] : event.date) : '',
      time: event.time || '10:00 AM',
      venue: event.venue || '',
      bannerUrl: event.bannerUrl || ''
    });
    setModalError('');
    setShowModal(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.venue) {
      setModalError('Event Name and Venue are required.');
      return;
    }

    try {
      if (editingEvent) {
        await api.put(`/api/events/admin/${editingEvent.id}`, formData);
      } else {
        await api.post('/api/events/admin', formData);
      }
      setShowModal(false);
      fetchEvents();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to save event. Please check inputs.');
    }
  };

  const handleDeleteEvent = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This will also remove registered participants.`)) {
      try {
        await api.delete(`/api/events/admin/${id}`);
        fetchEvents();
      } catch (err) {
        alert('Failed to delete event.');
      }
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header and Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', margin: 0, fontWeight: '800', color: '#0f172a' }}>College Events</h1>
          <p style={{ margin: '6px 0 0', color: '#64748b' }}>Discover events or manage campus registrations</p>
        </div>

        {userRole === 'ADMIN' && (
          <Button
            type="primary"
            onClick={handleOpenAddModal}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
          >
            <Plus size={18} /> Add Event
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '2.5rem' }}>
        <div style={{ maxWidth: '480px' }}>
          <Input
            placeholder="Search events by title, description or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: filter === cat ? 'none' : '1px solid #cbd5e1',
                backgroundColor: filter === cat ? '#4f46e5' : '#ffffff',
                color: filter === cat ? '#ffffff' : '#475569',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '500',
                transition: 'all 0.15s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading events...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <p>No events found matching your criteria.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="event-card-modern"
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {event.bannerUrl ? (
                <div style={{
                  height: '160px',
                  backgroundImage: `url(${event.bannerUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />
              ) : (
                <div style={{
                  height: '120px',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '1rem',
                  letterSpacing: '0.05em'
                }}>
                  {event.category || 'CAMPUS EVENT'}
                </div>
              )}

              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    color: '#4f46e5',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    {event.category || 'General'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={14} /> Open
                  </span>
                </div>

                <h3 style={{ margin: '0 0 10px', fontSize: '1.25rem', color: '#0f172a', fontWeight: '700' }}>
                  {event.name}
                </h3>

                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '16px', flex: 1 }}>
                  {event.description ? event.description.substring(0, 110) + '...' : 'No description provided.'}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '0.85rem', color: '#64748b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={15} color="#4f46e5" />
                    <span>{event.date ? new Date(event.date).toLocaleDateString() : 'TBA'} {event.time ? `• ${event.time}` : ''}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={15} color="#4f46e5" />
                    <span>{event.venue || 'Campus Venue'}</span>
                  </div>
                  {event.organizer && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={15} color="#4f46e5" />
                      <span>Organizer: {event.organizer.name || event.organizer.username}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Link to={`/event/${event.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                    <Button type="outline" style={{ width: '100%', padding: '8px' }}>
                      View Details
                    </Button>
                  </Link>
                  <Link to={`/register/${event.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                    <Button type="primary" style={{ width: '100%', padding: '8px' }}>
                      Register
                    </Button>
                  </Link>

                  {userRole === 'ADMIN' && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleOpenEditModal(event)}
                        style={{
                          padding: '8px 10px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          color: '#4f46e5'
                        }}
                        title="Edit Event"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id, event.name)}
                        style={{
                          padding: '8px 10px',
                          border: '1px solid #fee2e2',
                          background: '#fff5f5',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          color: '#ef4444'
                        }}
                        title="Delete Event"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Add / Edit Event Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '540px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h2>

            {modalError && (
              <div style={{
                padding: '10px 14px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#dc2626',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.9rem'
              }}>
                {modalError}
              </div>
            )}

            <form onSubmit={handleModalSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <Input
                  label="Event Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. National Hackathon 2026"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500' }}>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.95rem'
                  }}
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
                <div>
                  <Input
                    label="Date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <Input
                    label="Time"
                    placeholder="e.g. 10:00 AM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <Input
                  label="Venue"
                  required
                  placeholder="e.g. Main Auditorium, CS Block"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <Input
                  label="Banner Image URL / File Path"
                  placeholder="e.g. /images/hackathon.jpg or https://images.unsplash.com/..."
                  value={formData.bannerUrl}
                  onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                />
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Tip: Put your image in <code>frontend/public/images/</code> and enter <code>/images/filename.jpg</code>, or paste an online image link.
                </span>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500' }}>
                  Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the event, guidelines, or perks..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 18px',
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Cancel
                </button>
                <Button type="primary" style={{ padding: '10px 20px' }}>
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
