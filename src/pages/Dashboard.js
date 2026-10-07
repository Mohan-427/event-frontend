import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalParticipants: 0, presentParticipants: 0, absentParticipants: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resStats = await axios.get('http://localhost:8080/api/participants/stats');
        setStats(resStats.data);
        const resList = await axios.get('http://localhost:8080/api/participants');
        setRecent(resList.data.slice(-5).reverse());
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="page-container">
      <h2 className="page-title">Admin Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Participants</h3>
          <p className="stat-value">{stats.totalParticipants}</p>
        </div>
        <div className="stat-card">
          <h3>Present</h3>
          <p className="stat-value text-green">{stats.presentParticipants}</p>
        </div>
        <div className="stat-card">
          <h3>Absent</h3>
          <p className="stat-value text-red">{stats.absentParticipants}</p>
        </div>
      </div>
      <div className="card">
        <h3>Recent Registrations</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Event</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {recent.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.event}</td>
                <td>{p.email}</td>
              </tr>
            ))}
            {recent.length === 0 && <tr><td colSpan="3" className="text-center">No registrations yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
