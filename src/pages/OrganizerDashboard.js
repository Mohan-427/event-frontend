import React from 'react';
import { Link } from 'react-router-dom';

const OrganizerDashboard = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Organizer Dashboard</h1>
      <p>Welcome to your event management area.</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/admin-dashboard" style={{ marginRight: '10px' }}>Manage Events</Link>
        <Link to="/events">View All Events</Link>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
