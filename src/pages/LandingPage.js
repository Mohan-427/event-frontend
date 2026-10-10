import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Calendar, MapPin, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import Button from '../components/UI/Button';

const LandingPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/api/events/public');
      setEvents(res.data.slice(0, 3)); // Featured 3 events
    } catch (err) {
      console.error('Error fetching landing events', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero" style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          color: '#4f46e5',
          borderRadius: '20px',
          fontSize: '0.9rem',
          fontWeight: '600',
          marginBottom: '1.5rem'
        }}>
          <Sparkles size={16} /> College Event Management System
        </div>

        <h1 style={{ fontSize: '3.2rem', lineHeight: '1.2', marginBottom: '1.2rem', color: '#0f172a', fontWeight: '800' }}>
          Discover, Register & <br />
          <span style={{ color: '#4f46e5' }}>Manage College Events</span>
        </h1>

        <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '2.5rem', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
          The centralized platform for students to browse campus hackathons, workshops, and fests,
          while organizers streamline registrations and track live attendance.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/events" style={{ textDecoration: 'none' }}>
            <Button type="primary" style={{ padding: '12px 28px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Explore All Events <ArrowRight size={18} />
            </Button>
          </Link>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Button type="outline" style={{ padding: '12px 24px', fontSize: '1rem' }}>
              Staff Portal
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Events Section */}
      <section style={{ padding: '40px 20px 80px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', margin: '0 0 8px', fontWeight: '700', color: '#0f172a' }}>
              Upcoming Featured Events
            </h2>
            <p style={{ margin: 0, color: '#64748b' }}>
              Join exciting technical competitions, seminars, and cultural celebrations
            </p>
          </div>
          <Link to="/events" style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading available events...</div>
        ) : events.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <p>No events currently scheduled. Check back soon!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {events.map((event) => (
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
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                {event.bannerUrl && (
                  <div style={{
                    height: '180px',
                    backgroundImage: `url(${event.bannerUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} />
                )}

                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
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
                    <span style={{
                      fontSize: '0.8rem',
                      color: '#10b981',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <CheckCircle size={14} /> Open
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 10px', fontSize: '1.3rem', color: '#0f172a', fontWeight: '700' }}>
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
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to={`/event/${event.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                      <Button type="outline" style={{ width: '100%', padding: '8px' }}>
                        Details
                      </Button>
                    </Link>
                    <Link to={`/register/${event.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                      <Button type="primary" style={{ width: '100%', padding: '8px' }}>
                        Register
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LandingPage;
