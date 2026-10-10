import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

const Registration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [eventsList, setEventsList] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(eventId || '');
  const [event, setEvent] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    year: '1st Year'
  });
  const [submittedData, setSubmittedData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEventsAndCurrent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const fetchEventsAndCurrent = async () => {
    try {
      const res = await api.get('/api/events/public');
      setEventsList(res.data);

      if (eventId) {
        setSelectedEventId(eventId);
        const current = res.data.find((e) => e.id.toString() === eventId.toString());
        if (current) setEvent(current);
      } else if (res.data.length > 0) {
        setSelectedEventId(res.data[0].id.toString());
        setEvent(res.data[0]);
      }
    } catch (err) {
      console.error('Error fetching events for registration', err);
    }
  };

  const handleEventSelect = (e) => {
    const id = e.target.value;
    setSelectedEventId(id);
    const found = eventsList.find((ev) => ev.id.toString() === id.toString());
    setEvent(found || null);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(String(phone).trim());
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const targetEventId = selectedEventId || eventId;
    if (!targetEventId) {
      setError('Please select an event to register for.');
      return;
    }

    if (!formData.name.trim()) {
      setError('Full Name is required.');
      return;
    }
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address (e.g. student@college.edu).');
      return;
    }
    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.college.trim()) {
      setError('College/Institution name is required.');
      return;
    }
    if (!formData.department.trim()) {
      setError('Department is required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        college: formData.college.trim(),
        department: formData.department.trim(),
        year: formData.year,
        eventId: parseInt(targetEventId, 10)
      };

      const res = await api.post('/api/participants', payload);
      setSubmittedData(res.data);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        'Registration failed. You may already be registered for this event.';
      setError(typeof message === 'string' ? message : 'Registration failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  if (submittedData) {
    return (
      <div className="page-container center" style={{ padding: '3rem 1rem' }}>
        <div className="card" style={{ maxWidth: '520px', width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#dcfce7',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <CheckCircle size={36} />
          </div>

          <h2 style={{ fontSize: '1.8rem', color: '#0f172a', margin: '0 0 10px', fontWeight: '800' }}>
            Registration Successful!
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem' }}>
            You have successfully registered for <strong>{event?.name || 'the event'}</strong>.
          </p>

          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'left',
            marginBottom: '2rem',
            fontSize: '0.9rem',
            lineHeight: '1.7'
          }}>
            <div><strong>Participant:</strong> {submittedData.name}</div>
            <div><strong>Email:</strong> {submittedData.email}</div>
            <div><strong>Phone:</strong> {submittedData.phone}</div>
            <div><strong>College:</strong> {submittedData.college}</div>
            <div><strong>Department & Year:</strong> {submittedData.department} ({submittedData.year})</div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Button type="primary" onClick={() => navigate('/events')} style={{ padding: '10px 24px' }}>
              Browse Other Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '640px', margin: '0 auto', padding: '2rem 1rem' }}>
      <Link
        to={eventId ? `/event/${eventId}` : '/events'}
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

      <div className="card form-card" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', margin: '0 0 8px', fontWeight: '800', color: '#0f172a' }}>
            Event Registration
          </h2>
          {event ? (
            <p style={{ margin: 0, color: '#4f46e5', fontWeight: '600', fontSize: '1.05rem' }}>
              Registering for: {event.name}
            </p>
          ) : (
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
              Select an event and complete your registration details
            </p>
          )}
        </div>

        {/* Event Selector if navigated without specific event ID */}
        {(!eventId || eventsList.length > 1) && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>
              Select Event
            </label>
            <select
              value={selectedEventId}
              onChange={handleEventSelect}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                backgroundColor: '#ffffff'
              }}
            >
              {eventsList.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name} ({ev.category} - {ev.venue})
                </option>
              ))}
            </select>
          </div>
        )}

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#dc2626',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.2rem' }}>
            <Input
              label="Full Name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.2rem' }}>
            <div>
              <Input
                label="Email Address"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="student@college.edu"
              />
            </div>
            <div>
              <Input
                label="Phone Number"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <Input
              label="College / Institution"
              name="college"
              required
              value={formData.college}
              onChange={handleChange}
              placeholder="e.g. University College of Engineering"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '1.8rem' }}>
            <div>
              <Input
                label="Department"
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500', color: '#334155' }}>
                Academic Year
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.95rem'
                }}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            className="btn-full"
            disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
          >
            {loading ? 'Submitting Registration...' : 'Complete Registration'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
