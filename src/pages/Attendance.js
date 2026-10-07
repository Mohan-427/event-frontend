import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Attendance = () => {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/participants');
      setParticipants(res.data);
    } catch (error) {
      console.error('Error fetching participants', error);
    }
  };

  const toggleAttendance = async (id, currentStatus) => {
    try {
      await axios.patch(`http://localhost:8080/api/participants/${id}/attendance?status=${!currentStatus}`);
      fetchParticipants();
    } catch (error) {
      alert('Update failed');
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Attendance Management</h2>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Event</th>
              <th>College</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {participants.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.event}</td>
                <td>{p.college}</td>
                <td className={p.attendance ? 'text-green' : 'text-red'}>
                  {p.attendance ? 'Present' : 'Absent'}
                </td>
                <td>
                  <button
                    onClick={() => toggleAttendance(p.id, p.attendance)}
                    className="btn-attendance"
                  >
                    Mark as {p.attendance ? 'Absent' : 'Present'}
                  </button>
                </td>
              </tr>
            ))}
            {participants.length === 0 && <tr><td colSpan="5" className="text-center">No participants registered</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
