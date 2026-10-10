import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, User, ArrowLeft, CheckCircle, ClipboardList } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import Button from '../components/UI/Button';

const EventDetail = ({ userRole }) => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent(id);
  }, [id]);

  const fetchEvent = async (eventId) => {
    try {
      const res = await api.get(`/api/events/public/${eventId}`);
      setEvent(res.data);
    } catch (error) {
      console.error('Error fetching event details', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page-container center" style={{ padding: '4rem' }}>Loading event details...</div>;
  if (!event) return <div className="page-container center" style={{ padding: '4rem' }}>Event not found.</div>;

  return (
    <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <Link
        to="/events"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '1.5rem',
          color: '#64748b',
          textDecoration: 'none',
          fontSize: '0.95rem',
          fontWeight: '500'
        }}
      >
        <ArrowLeft size={18} /> Back to Events
      </Link>

      {/* Event Header Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
        marginBottom: '2rem'
      }}>
        {event.bannerUrl ? (
          <div style={{
            height: '280px',
            backgroundImage: `url(${event.bannerUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} />
        ) : (
          <div style={{
            height: '180px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '1.5rem',
            fontWeight: '700'
          }}>
            {event.name}
          </div>
        )}

        <div style={{ padding: '28px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{
              backgroundColor: 'rgba(79, 70, 229, 0.1)',
              color: '#4f46e5',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              {event.category || 'General'}
            </span>
            <span style={{
              fontSize: '0.85rem',
              color: '#10b981',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <CheckCircle size={15} /> Registrations Open
            </span>
          </div>

          <h1 style={{ fontSize: '2.4rem', margin: '0 0 16px', color: '#0f172a', fontWeight: '800' }}>
            {event.name}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', color: '#64748b', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="#4f46e5" />
              <span>{event.date ? new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'TBA'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#4f46e5" />
              <span>{event.time || '10:00 AM'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="#4f46e5" />
              <span>{event.venue || 'Campus Venue'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Description & Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>
              About This Event
            </h3>
            <p style={{ lineHeight: '1.7', color: '#334155', fontSize: '1rem', whiteSpace: 'pre-line' }}>
              {event.description || 'No detailed description provided for this event.'}
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>
              Organizer Information
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4f46e5'
              }}>
                <User size={24} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>
                  {event.organizer?.name || event.organizer?.username || 'Department Event Coordinator'}
                </h4>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                  {event.organizer?.email || 'events@college.edu'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '1.2rem', fontWeight: '700', color: '#0f172a' }}>
              Join This Event
            </h3>
            <p style={{ margin: '0 0 20px', color: '#64748b', fontSize: '0.9rem' }}>
              Free registration for students and college participants.
            </p>

            <Link to={`/register/${event.id}`} style={{ textDecoration: 'none' }}>
              <Button type="primary" style={{ width: '100%', padding: '12px', fontSize: '1rem' }}>
                Register for Event
              </Button>
            </Link>

            {(userRole === 'ADMIN' || userRole === 'ORGANIZER') && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '10px' }}>Staff Controls:</p>
                <Link to={`/attendance/${event.id}`} style={{ textDecoration: 'none' }}>
                  <Button
                    type="outline"
                    style={{ width: '100%', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <ClipboardList size={16} /> Manage Attendance
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
