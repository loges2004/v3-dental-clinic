import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './AdminDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap'; // Import react-bootstrap components

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8001',
});

const timeSlots = [
  '09:30',
  '10:30',
  '11:30',
  '12:30',
  '13:30',
  '14:30',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:30'
];

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectId, setRejectId] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // State to control reschedule modal visibility
  const [showEditModal, setShowEditModal] = useState(false); // State to control edit modal visibility
  const [editId, setEditId] = useState(null); // ID of the appointment being edited
  const [selectedStatus, setSelectedStatus] = useState(''); // Selected status in edit modal

  const handleCloseModal = () => {
    setShowModal(false);
    setRejectId(null);
  };

  const handleShowModal = (id) => {
    setRejectId(id);
    setRescheduleDate(''); // Clear previous values
    setRescheduleTime(''); // Clear previous values
    setShowModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditId(null);
    setSelectedStatus('');
  };

  const handleShowEditModal = (id, currentStatus) => {
    setEditId(id);
    setSelectedStatus(currentStatus);
    setShowEditModal(true);
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('jwtToken');
      console.log('Debug Token (fetchAppointments):', token); // Debugging line
      const res = await api.get('/api/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch appointments. Please try again.',
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAccept = async (id) => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('jwtToken');
      console.log('Debug Token (handleAccept):', token); // Debugging line
      await api.put(`/api/appointments/${id}/status?status=ACCEPTED`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({
        icon: 'success',
        title: 'Appointment Accepted!',
        text: 'Patient has been notified.',
      });
      fetchAppointments();
    } catch (err) {
      console.error('Failed to accept appointment:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to accept appointment. Please try again.',
      });
    }
  };

  const handleReject = async (id) => {
    if (!rescheduleDate || !rescheduleTime) {
        Swal.fire({
            icon: 'warning',
            title: 'Missing Information',
            text: 'Please select a new date and time for rescheduling.',
        });
        return;
    }

    const rejectionReason = `Rescheduled to ${new Date(rescheduleDate).toLocaleDateString()} at ${rescheduleTime}.`;

    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('jwtToken');
      console.log('Debug Token (handleReject):', token); // Debugging line
      await api.put(`/api/appointments/${id}/status?status=RESCHEDULED&reason=${encodeURIComponent(rejectionReason)}&newDate=${rescheduleDate}&newTime=${rescheduleTime}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({
        icon: 'success',
        title: 'Appointment Rescheduled!',
        text: 'Patient has been notified with the new time.',
      });
      setRejectId(null);
      setRescheduleDate('');
      setRescheduleTime('');
      handleCloseModal(); // Close the modal after successful reschedule
      fetchAppointments();
    } catch (err) {
      console.error('Failed to reschedule appointment:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to reschedule appointment. Please try again.',
      });
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please select a status.',
      });
      return;
    }

    try {
      let url = `/api/appointments/${editId}/status?status=${selectedStatus}`;
      // Add newDate and newTime if status is RESCHEDULED for consistency, even if not directly from reschedule flow
      if (selectedStatus === 'RESCHEDULED') {
        // For now, we'll assume rescheduling goes through the reschedule modal. If admin edits to RESCHEDULED directly, they need to provide date/time.
        // This part needs to be more robust for direct status change to RESCHEDULED.
        // For simplicity, if admin directly changes to RESCHEDULED via this edit modal, they also need to select date/time
        if (!rescheduleDate || !rescheduleTime) {
          Swal.fire({
            icon: 'warning',
            title: 'Missing Information',
            text: 'Please select a new date and time for rescheduling when setting status to RESCHEDULED.',
          });
          return;
        }
        url += `&newDate=${rescheduleDate}&newTime=${rescheduleTime}`;
      }
      const token = localStorage.getItem('adminToken') || localStorage.getItem('jwtToken');
      console.log('Debug Token (handleUpdateStatus):', token); // Debugging line
      await api.put(url, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({
        icon: 'success',
        title: 'Status Updated!',
        text: `Appointment status changed to ${selectedStatus}.`,
      });
      handleCloseEditModal();
      fetchAppointments();
    } catch (err) {
      console.error('Failed to update appointment status:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update appointment status. Please try again.',
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div 
      className="admin-dashboard-container"
      style={{ backgroundImage: `url('/images/background_admin.jpg')` }}
    >
      <div className="admin-dashboard-header">
      <h2>Dentist Dashboard</h2>
<p>Manage appointments, patient records, and treatment schedules from here.</p>

        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      
      {loading ? (
        <p>Loading appointments...</p>
      ) : (
        <div className="table-container">
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
              {appointments.length > 0 ? (
                appointments.map((appt) => (
                  <tr key={appt.id}>
                    <td>{appt.patientFullName}</td>
                    <td>{appt.patientEmail}</td>
                    <td>{appt.patientPhone}</td>
                    <td>{new Date(appt.appointmentDate).toLocaleDateString()}</td>
                    <td>{appt.appointmentTime}</td>
                    <td>{appt.serviceType}</td>
                    <td className={`status-${appt.status.toLowerCase()}`}>{appt.status}</td>
                    <td>
                      {appt.status && appt.status.trim().toUpperCase() === 'PENDING' && (
                        <>
                          <button className='btn btn-success' onClick={() => handleAccept(appt.id)}>Accept</button>
                          <button className='btn btn-danger mt-2' onClick={() => handleShowModal(appt.id)}>Reject</button>
                        </>
                      )}
                      <button className='btn btn-info mt-2' onClick={() => handleShowEditModal(appt.id, appt.status)}>Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-appointments">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* React-Bootstrap Reschedule Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reschedule Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="rescheduleDate">New Date:</Form.Label>
            <Form.Control
              type="date"
              id="rescheduleDate"
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="rescheduleTime">New Time:</Form.Label>
            <Form.Select
              id="rescheduleTime"
              value={rescheduleTime}
              onChange={(e) => setRescheduleTime(e.target.value)}
            >
              <option value="">Select Time</option>
              {timeSlots.map((slot, idx) => (
                  <option key={idx} value={slot}>{slot}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => handleReject(rejectId)}>
            Reschedule
          </Button>
        </Modal.Footer>
      </Modal>

      {/* React-Bootstrap Edit Status Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Appointment Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="statusSelect">Select Status:</Form.Label>
            <Form.Select
              id="statusSelect"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="RESCHEDULED">Rescheduled</option>
            </Form.Select>
          </Form.Group>
          {(selectedStatus === 'RESCHEDULED' && editId) && (
            <>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="editRescheduleDate">New Date:</Form.Label>
                <Form.Control
                  type="date"
                  id="editRescheduleDate"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="editRescheduleTime">New Time:</Form.Label>
                <Form.Select
                  id="editRescheduleTime"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                >
                  <option value="">Select Time</option>
                  {timeSlots.map((slot, idx) => (
                      <option key={idx} value={slot}>{slot}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateStatus}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;