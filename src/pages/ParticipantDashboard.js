import React from 'react';
import { Link } from 'react-router-dom';

const ParticipantDashboard = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Participant Dashboard</h1>
      <p>Welcome! You can browse and register for upcoming events.</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/events">Browse Events</Link>
      </div>
    </div>
  );
};

export default ParticipantDashboard;
