import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/api/events/public');
      setEvents(res.data);
    } catch (error) {
      console.error('Error fetching events', error);
    }
  };

  const filteredEvents = events.filter(e =>
    (filter === 'All' || e.category === filter) &&
    (e.name.toLowerCase().includes(search.toLowerCase()))
  );

  const categories = ['All', 'Technical', 'Workshop', 'Seminar', 'Hackathon', 'Cultural', 'Sports'];

  return (
    <div className="page-container">
      <h2 className="page-title">Discover Events</h2>

      <div className="events-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tags">
          {categories.map(cat => (
            <button
              key={cat}
              className={`tag ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="event-grid-modern">
        {filteredEvents.map(event => (
          <motion.div
            key={event.id}
            className="event-card-modern"
            whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
          >
            <div className="event-banner-img" style={{ backgroundImage: `url(${event.bannerUrl || 'https://via.placeholder.com/300x150'})` }}>
              <span className="status-badge">{event.status}</span>
            </div>
            <div className="event-card-content">
              <span className="category-tag">{event.category}</span>
              <h3>{event.name}</h3>
              <p>{event.description?.substring(0, 100)}...</p>
              <div className="event-details-mini">
                <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                <span>📍 {event.venue}</span>
              </div>
              <div className="event-card-footer">
                <Link to={`/event/${event.id}`} className="btn-outline">Details</Link>
                <Link to={`/event/${event.id}`} className="btn-primary">Register</Link>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredEvents.length === 0 && (
          <div className="empty-state">
            <p>No events found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
