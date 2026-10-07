import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ParticipantList = () => {
  const [participants, setParticipants] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/participants?query=${query}`);
      setParticipants(res.data);
    } catch (error) {
      console.error('Error fetching participants', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this participant?')) {
      try {
        await axios.delete(`http://localhost:8080/api/participants/${id}`);
        fetchParticipants();
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Participant Management</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, email or event..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && fetchParticipants()}
        />
        <button onClick={fetchParticipants} className="btn-primary">Search</button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Event</th>
              <th>College</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {participants.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td>{p.event}</td>
                <td>{p.college}</td>
                <td>{p.year}</td>
                <td>
                  <button className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
            {participants.length === 0 && <tr><td colSpan="6" className="text-center">No participants found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParticipantList;
