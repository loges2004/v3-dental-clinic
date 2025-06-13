import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [rejectId, setRejectId] = useState(null);
  const [availableSlots, setAvailableSlots] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/appointments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      setAppointments(res.data);
    } catch (err) {
      setError('Failed to fetch appointments.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAccept = async (id) => {
    setMessage('');
    setError('');
    try {
      await axios.put(`/api/appointments/${id}/accept`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      setMessage('Appointment accepted and patient notified.');
      fetchAppointments();
    } catch (err) {
      setError('Failed to accept appointment.');
    }
  };

  const handleReject = async (id) => {
    setMessage('');
    setError('');
    try {
      await axios.put(`/api/appointments/${id}/reject`, { availableSlots }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      setMessage('Appointment rejected and patient notified.');
      setRejectId(null);
      setAvailableSlots('');
      fetchAppointments();
    } catch (err) {
      setError('Failed to reject appointment.');
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>
      {loading ? (
        <p>Loading appointments...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Service</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td>{appt.fullName}</td>
                <td>{appt.email}</td>
                <td>{appt.phone}</td>
                <td>{appt.date}</td>
                <td>{appt.timeSlot}</td>
                <td>{appt.serviceType}</td>
                <td>{appt.status}</td>
                <td>
                  {appt.status === 'pending' && (
                    <>
                      <button onClick={() => handleAccept(appt.id)}>Accept</button>
                      <button onClick={() => setRejectId(appt.id)}>Reject</button>
                    </>
                  )}
                  {rejectId === appt.id && (
                    <div className="reject-popup">
                      <input
                        type="text"
                        placeholder="Available slots (e.g. 5PM-6PM, 7PM-8PM)"
                        value={availableSlots}
                        onChange={(e) => setAvailableSlots(e.target.value)}
                      />
                      <button onClick={() => handleReject(appt.id)}>Send</button>
                      <button onClick={() => setRejectId(null)}>Cancel</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default AdminDashboard; 