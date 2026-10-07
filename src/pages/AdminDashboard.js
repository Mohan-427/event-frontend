import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Calendar, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/dashboard/admin');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching admin stats', error);
    }
  };

  if (!stats) return <div className="page-container center">Loading Dashboard...</div>;

  const chartData = {
    labels: Object.keys(stats.categoryDistribution || {}),
    datasets: [{
      label: 'Events by Category',
      data: Object.values(stats.categoryDistribution || {}),
      backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
    }],
  };

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h2 className="page-title">System Overview</h2>
        <div className="date-display">{new Date().toDateString()}</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card-modern">
          <div className="stat-icon" style={{ backgroundColor: '#4f46e5' }}><Calendar /></div>
          <div className="stat-info">
            <h3>{stats.totalEvents}</h3>
            <p>Total Events</p>
          </div>
        </div>
        <div className="stat-card-modern">
          <div className="stat-icon" style={{ backgroundColor: '#10b981' }}><Users /></div>
          <div className="stat-info">
            <h3>{stats.totalParticipants}</h3>
            <p>Total Participants</p>
          </div>
        </div>
        <div className="stat-card-modern">
          <div className="stat-icon" style={{ backgroundColor: '#22c55e' }}><CheckCircle /></div>
          <div className="stat-info">
            <h3>{stats.totalPresent}</h3>
            <p>Total Present</p>
          </div>
        </div>
        <div className="stat-card-modern">
          <div className="stat-icon" style={{ backgroundColor: '#ef4444' }}><XCircle /></div>
          <div className="stat-info">
            <h3>{stats.totalAbsent}</h3>
            <p>Total Absent</p>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="card chart-card">
          <h3>Event Distribution</h3>
          <div className="chart-container">
            <Pie data={chartData} />
          </div>
        </div>
        <div className="card activity-card">
          <h3>Growth Analytics</h3>
          <div className="analytics-item">
            <TrendingUp color="#10b981" />
            <span>Registration growth is up by 12% this week.</span>
          </div>
          <div className="recent-list">
            <p>Recent Events Created:</p>
            {/* Sample list */}
            <div className="list-item">Hackathon 2026 <span className="tag">Active</span></div>
            <div className="list-item">AI Workshop <span className="tag">Upcoming</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
