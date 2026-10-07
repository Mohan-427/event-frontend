import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, User, Info, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventDetail = () => {
  const [event, setEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const id = window.location.pathname.split('/').pop();
    fetchEvent(id);
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchEvent = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/events/public/${id}`);
      setEvent(res.data);
    } catch (error) {
      console.error('Error fetching event', error);
    }
  };

  const calculateTimeLeft = () => {
    if (!event || !event.deadline) return;
    const difference = +new Date(event.deadline) - +new Date();
    if (difference > 0) {
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        mins: Math.floor((difference / 1000 / 60) % 60),
        secs: Math.floor((difference / 1000) % 60),
      });
    }
  };

  if (!event) return <div className="page-container center">Loading event details...</div>;

  return (
    <div className="page-container">
      <Link to="/events" className="back-link"><ArrowLeft size={18}/> Back to Events</Link>

      <div className="event-detail-header">
        <div className="event-banner-large" style={{ backgroundImage: `url(${event.bannerUrl || 'https://via.placeholder.com/1200x400'})` }}>
          <div className="banner-overlay">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="category-tag-lg">{event.category}</span>
              <h1>{event.name}</h1>
              <div className="event-meta-top">
                <span><Calendar size={18}/> {new Date(event.date).toDateString()}</span>
                <span><MapPin size={18}/> {event.venue}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="event-grid-detail">
        <div className="detail-main">
          <div className="card">
            <h3>About Event</h3>
            <p>{event.description}</p>
          </div>
          <div className="card">
            <h3>Event Schedule</h3>
            <div className="schedule-item">
              <Clock size={20}/> <span>Start: {new Date(event.startTime).toLocaleTimeString()}</span>
            </div>
            <div className="schedule-item">
              <Clock size={20}/> <span>End: {new Date(event.endTime).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="card registration-card">
            <h3>Register Now</h3>
            <div className="countdown">
              <p>Registration closes in:</p>
              <div className="timer">
                <div><span>{timeLeft.days}</span><small>Days</small></div>
                <div><span>{timeLeft.hours}</span><small>Hrs</small></div>
                <div><span>{timeLeft.mins}</span><small>Mins</small></div>
                <div><span>{timeLeft.secs}</span><small>Secs</small></div>
              </div>
            </div>
            <button className="btn-primary-full">Confirm Registration</button>
            <p className="capacity-text">Capacity: {event.maxParticipants} max</p>
          </div>
          <div className="card">
            <h3>Organizer</h3>
            <div className="organizer-info">
              <User size={40}/>
              <div>
                <h4>{event.organizer?.username || 'Event Admin'}</h4>
                <p>{event.organizer?.email || 'admin@college.edu'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
