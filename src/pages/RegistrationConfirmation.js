import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, MapPin, Calendar, Clock, CheckCircle, XCircle, Download, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const RegistrationConfirmation = () => {
  const [regData, setRegData] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const regId = queryParams.get('regId');
    if (regId) fetchConfirmation(regId);
  }, []);

  const fetchConfirmation = async (id) => {
    try {
      // In a real app, we'd call a specific GET /api/registrations/{id}
      // Simulating response for demo
      setRegData({
        participantName: 'Mohan Krishna',
        eventName: 'AI Hackathon 2026',
        regId: id,
        date: '2026-12-15',
        venue: 'Main Auditorium, Block C',
        timestamp: new Date().toLocaleString()
      });
    } catch (error) {
      console.error('Error fetching confirmation', error);
    }
  };

  if (!regData) return <div className="page-container center">Loading Ticket...</div>;

  return (
    <div className="page-container center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="ticket-card"
      >
        <div className="ticket-header">
          <h2>Registration Successful! 🎉</h2>
          <p>Your spot is secured. See you there!</p>
        </div>

        <div className="ticket-body">
          <div className="ticket-info">
            <div className="info-row">
              <span className="label">Participant</span>
              <span className="value">{regData.participantName}</span>
            </div>
            <div className="info-row">
              <span className="label">Event</span>
              <span className="value">{regData.eventName}</span>
            </div>
            <div className="info-row">
              <span className="label">Registration ID</span>
              <span className="value highlight">{regData.regId}</span>
            </div>
            <div className="info-row">
              <span className="label">Date</span>
              <span className="value">{regData.date}</span>
            </div>
            <div className="info-row">
              <span className="label">Venue</span>
              <span className="value">{regData.venue}</span>
            </div>
          </div>

          <div className="ticket-qr">
            <QRCodeSVG value={regData.regId} size={128} />
            <p>Scan at Entry</p>
          </div>
        </div>

        <div className="ticket-footer">
          <button onClick={() => window.print()} className="btn-outline-ticket"><Printer size={18}/> Print Ticket</button>
          <button className="btn-primary-ticket"><Download size={18}/> Download PDF</button>
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationConfirmation;
