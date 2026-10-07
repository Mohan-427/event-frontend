import React, { useState } from 'react';
import api from '../api';

const Registration = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', college: '', event: '', department: '', year: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const validatePhone = (phone) => {
    return String(phone)
      .match(/^\d{10}$/);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      await api.post('/api/participants', formData);
      setSubmitted(true);
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
    }
  };

  if (submitted) {
    return (
      <div className="page-container center">
        <div className="card success-card">
          <h2>Registration Successful! 🎉</h2>
          <p>Thank you for registering. We look forward to seeing you at the event.</p>
          <button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', college: '', event: '', department: '', year: '' }); }} className="btn-primary">Register Another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="card form-card">
        <h2>Event Registration</h2>
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Enter full name" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Enter email" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phone" required value={formData.phone} onChange={handleChange} placeholder="Enter phone number" />
          </div>
          <div className="form-group">
            <label>College/Organization</label>
            <input type="text" name="college" required value={formData.college} onChange={handleChange} placeholder="Enter college name" />
          </div>
          <div className="form-group">
            <label>Event Name</label>
            <input type="text" name="event" required value={formData.event} onChange={handleChange} placeholder="Enter event name" />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input type="text" name="department" required value={formData.department} onChange={handleChange} placeholder="Enter department" />
          </div>
          <div className="form-group">
            <label>Year</label>
            <input type="text" name="year" required value={formData.year} onChange={handleChange} placeholder="e.g. 3rd Year" />
          </div>
          <button type="submit" className="btn-primary">Register Now</button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
