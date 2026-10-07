import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Users, Award, Zap } from 'lucide-react';

const LandingPage = () => {
  const stats = [
    { label: 'Total Events', value: '50+', icon: <Calendar />, color: '#3b82f6' },
    { label: 'Participants', value: '2K+', icon: <Users />, color: '#10b981' },
    { label: 'Awards Given', value: '100+', icon: <Award />, color: '#f59e0b' },
    { label: 'Hackathons', value: '12+', icon: <Zap />, color: '#8b5cf6' },
  ];

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <h1>Manage Events. <span className="text-gradient">Connect People.</span> Simplify Attendance.</h1>
          <p>The ultimate platform for colleges and organizations to orchestrate seamless events, track participants, and automate attendance with ease.</p>
          <div className="hero-btns">
            <Link to="/events" className="btn-primary-lg">Explore Events</Link>
            <Link to="/events" className="btn-secondary-lg">Register Now</Link>
          </div>
        </motion.div>
        <div className="hero-decoration">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="stat-card-modern"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="stat-icon" style={{ backgroundColor: stat.color }}>{stat.icon}</div>
              <div className="stat-info">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Events Preview */}
      <section className="featured-section">
        <h2 className="section-title">Featured Events</h2>
        <div className="event-preview-grid">
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              className="event-card-modern"
              whileHover={{ y: -10 }}
            >
              <div className="event-banner-placeholder">Event Image {i}</div>
              <div className="event-card-content">
                <span className="category-tag">Technical</span>
                <h3>Sample Event {i}</h3>
                <p>Join us for an amazing experience of learning and growth...</p>
                <div className="event-footer">
                  <Link to={`/event/${i}`} className="btn-outline">View Details</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
