// eslint-disable-next-line no-unused-vars
import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './AdminDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap'; // Import react-bootstrap components
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const getApiBaseUrl = () => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8001';
    }
    return `http://${hostname}:8001`;
};

const timeSlots = [
  '09:30',
  '10:30',
  '11:30',
  '12:30',
  '01:30',
  '02:30',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00'
];

const serviceTypes = [
  "Teeth Cleaning",
  "Teeth Whitening",
  "Dental Fillings",
  "Root Canal Therapy",
  "Dental Crowns",
  "Dental Bridges",
  "Wisdom Tooth Extraction",
  "Braces",
  "Full Mouth Rehabilitation"
];

const clinicAreas = [
  "Kannappa nagar",
  // "Sai baba colony",
  // "RS puram"
];

const clinicLocations = {
  "Kannappa nagar": "https://maps.app.goo.gl/yqS21NNiS5ALGvvs7",
  // "Sai baba colony": "https://www.google.com/maps/place/V3+DENTAL+CARE+-+SAIBABA+COLONY/@11.0264273,76.9431476,17z/",
  // "RS puram": "https://www.google.com/maps/place/V3+Dental+Care+-+Best+Dental+Clinic+in+RS+Puram,Coimbatore/@10.999696,76.95353,17z/"
};

const getLogoBase64 = () => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = '/images/logo.png';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    };
    img.onerror = () => {
      resolve(null);
    }
  });
};

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectId, setRejectId] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // State to control reschedule modal visibility
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // State to control edit modal visibility
  const [editId, setEditId] = useState(null); // ID of the appointment being edited
  const [selectedStatus, setSelectedStatus] = useState(''); // Selected status in edit modal
  const [rejectionReason, setRejectionReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterTime, setFilterTime] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [selectedAppointments, setSelectedAppointments] = useState(new Set()); // Track selected appointments
  const [selectAll, setSelectAll] = useState(false); // Track select all state
  const [isBulkDeleting, setIsBulkDeleting] = useState(false); // Track bulk deletion state
  const [newAppointment, setNewAppointment] = useState({
    patientFullName: '',
    patientPhone: '',
    patientEmail: '',
    serviceType: '',
    appointmentDate: '',
    appointmentTime: '',
    clinicArea: '',
  });

  const handleCloseModal = () => {
    setShowModal(false);
    setRejectId(null);
    setSelectedStatus('');
    setRejectionReason('');
  };

  const handleShowModal = (id, isReject = false) => {
    setRejectId(id);
    setRescheduleDate('');
    setRescheduleTime('');
    if (isReject) {
      setRejectionReason('');
      setShowRejectModal(true);
    } else {
      setShowModal(true);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditId(null);
    setSelectedStatus('');
    setRejectionReason('');
  };

  const handleShowEditModal = (id, currentStatus) => {
    setEditId(id);
    setSelectedStatus(currentStatus);
    setShowEditModal(true);
  };

  const handleShowAddModal = () => {
    setNewAppointment({
      patientFullName: '',
      patientPhone: '',
      patientEmail: '',
      serviceType: '',
      appointmentDate: '',
      appointmentTime: '',
      clinicArea: '',
    });
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => setShowAddModal(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('jwtToken');
      const res = await fetch(`${getApiBaseUrl()}/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch appointments. Please try again.',
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Filtered appointments
  const filteredAppointments = appointments.filter(appt => {
    const statusMatch = !filterStatus || appt.status === filterStatus;
    const dateMatch = !filterDate || appt.appointmentDate === filterDate;
    const timeMatch = !filterTime || (appt.appointmentTime && appt.appointmentTime.startsWith(filterTime));
    return statusMatch && dateMatch && timeMatch;
  });

  // Handle individual appointment selection
  const handleAppointmentSelect = (appointmentId) => {
    const newSelected = new Set(selectedAppointments);
    if (newSelected.has(appointmentId)) {
      newSelected.delete(appointmentId);
    } else {
      newSelected.add(appointmentId);
    }
    setSelectedAppointments(newSelected);
    
    // Update select all state
    const filteredIds = filteredAppointments.map(appt => appt.id);
    setSelectAll(newSelected.size === filteredIds.length && filteredIds.length > 0);
  };

  const handleAccept = async (id) => {
    setAcceptingId(id);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('jwtToken');
      const payload = { status: 'ACCEPTED' };
      const res = await fetch(`${getApiBaseUrl()}/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const appt = await res.json();
      Swal.fire({
        icon: 'success',
        title: 'Appointment Accepted!',
        text: 'Patient has been notified.',
      }).then(() => {
        const date = new Date(appt.appointmentDate);
        const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        const timeObj = new Date(`1970-01-01T${appt.appointmentTime}`);
        const timeStr = timeObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        const message =
          `*V3 Dental Clinic | Appointment Confirmation*\n\n` +
          `*Name:* ${appt.patientFullName}\n` +
          `*Service:* ${appt.serviceType}\n` +
          `*Date:* ${dateStr}\n` +
          `*Time:* ${timeStr}\n` +
          (appt.clinicArea && clinicLocations[appt.clinicArea] ? `*Our Location:* ${clinicLocations[appt.clinicArea]}\n\n` : '\n') +
          `Please arrive 10 minutes early.\n` +
          `Thank you for booking with us!\n\n` +
          `*V3 Dental Clinic*`;
        let phone = appt.patientPhone.replace(/\D/g, '');
        if (phone.startsWith('0')) {
          phone = phone.substring(1);
        }
        if (!phone.startsWith('91')) {
          phone = '91' + phone;
        }
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      });
      fetchAppointments();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to accept appointment. Please try again.',
      });
    } finally {
      setAcceptingId(null);
    }
  };

  const handleReschedule = async (id) => {
    if (!rescheduleDate || !rescheduleTime) {
        Swal.fire({
            icon: 'warning',
            title: 'Missing Information',
            text: 'Please select a new date and time for rescheduling.',
        });
        return;
    }

    const reason = `Rescheduled to ${new Date(rescheduleDate).toLocaleDateString()} at ${rescheduleTime}.`;

    setIsRescheduling(true);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('jwtToken');
      const payload = {
        status: 'RESCHEDULED',
        reason: reason,
        newDate: rescheduleDate,
        newTime: rescheduleTime,
      };
      await fetch(`${getApiBaseUrl()}/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      Swal.fire({
        icon: 'success',
        title: 'Appointment Rescheduled!',
        text: 'Patient has been notified with the new time.',
      });
      setRejectId(null);
      setRescheduleDate('');
      setRescheduleTime('');
      handleCloseModal();
      fetchAppointments();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to reschedule appointment. Please try again.',
      });
    } finally {
      setIsRescheduling(false);
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

    const payload = { status: selectedStatus };

    if (selectedStatus === 'REJECTED') {
      if (!rejectionReason.trim()) {
        Swal.fire({ icon: 'warning', title: 'Missing Information', text: 'Please enter a reason for rejection.' });
        return;
      }
      payload.reason = rejectionReason;
    }

    if (selectedStatus === 'RESCHEDULED') {
      if (!rescheduleDate || !rescheduleTime) {
        Swal.fire({ icon: 'warning', title: 'Missing Information', text: 'Please select a new date and time.' });
        return;
      }
      payload.newDate = rescheduleDate;
      payload.newTime = rescheduleTime;
    }

    setIsUpdating(true);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('jwtToken');
      const res = await fetch(`${getApiBaseUrl()}/api/appointments/${editId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const appt = await res.json();
      Swal.fire({
        icon: 'success',
        title: 'Status Updated!',
        text: `Appointment status changed to ${selectedStatus}.`,
      }).then(() => {
        if (selectedStatus === 'ACCEPTED' || selectedStatus === 'RESCHEDULED') {
          const date = new Date(appt.appointmentDate);
          const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
          const timeObj = new Date(`1970-01-01T${appt.appointmentTime}`);
          const timeStr = timeObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
          const message =
            `*V3 Dental Clinic | Appointment Confirmation*\n\n` +
            `*Name:* ${appt.patientFullName}\n` +
            `*Service:* ${appt.serviceType}\n` +
            `*Date:* ${dateStr}\n` +
            `*Time:* ${timeStr}\n` +
            (appt.clinicArea && clinicLocations[appt.clinicArea] ? `*Our Location:* ${clinicLocations[appt.clinicArea]}\n\n` : '\n') +
            `Please arrive 10 minutes early.\n` +
            `Thank you for booking with us!\n\n` +
            `*V3 Dental Clinic*`;
          let phone = appt.patientPhone.replace(/\D/g, '');
          if (phone.startsWith('0')) {
            phone = phone.substring(1);
          }
          if (!phone.startsWith('91')) {
            phone = '91' + phone;
          }
          const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
        }
      });
      handleCloseEditModal();
      fetchAppointments();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update appointment status. Please try again.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // Delete appointment handler
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the appointment.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });
    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('jwtToken');
        await fetch(`${getApiBaseUrl()}/api/appointments/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire('Deleted!', 'Appointment has been deleted.', 'success');
        fetchAppointments();
      } catch (err) {
        Swal.fire('Error', 'Failed to delete appointment.', 'error');
      }
    }
  };

  // Handle select all functionality
  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedAppointments(new Set());
      setSelectAll(false);
    } else {
      const allIds = filteredAppointments.map(appt => appt.id);
      setSelectedAppointments(new Set(allIds));
      setSelectAll(true);
    }
  }, [selectAll, filteredAppointments]);

  // Handle bulk deletion
  const handleBulkDelete = async () => {
    if (selectedAppointments.size === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Selection',
        text: 'Please select at least one appointment to delete.',
      });
      return;
    }

    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `This will permanently delete ${selectedAppointments.size} appointment(s). This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete them!',
      confirmButtonColor: '#d33',
    });

    if (confirm.isConfirmed) {
      setIsBulkDeleting(true);
      try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('jwtToken');
        const deletePromises = Array.from(selectedAppointments).map(id =>
          fetch(`${getApiBaseUrl()}/api/appointments/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          })
        );

        await Promise.all(deletePromises);
        
        Swal.fire({
          icon: 'success',
          title: 'Bulk Delete Successful!',
          text: `${selectedAppointments.size} appointment(s) have been deleted.`,
        });
        
        setSelectedAppointments(new Set());
        setSelectAll(false);
        fetchAppointments();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Bulk Delete Failed',
          text: 'Some appointments could not be deleted. Please try again.',
        });
      } finally {
        setIsBulkDeleting(false);
      }
    }
  };

  // Clear selection when filters change
  useEffect(() => {
    setSelectedAppointments(new Set());
    setSelectAll(false);
  }, [filterStatus, filterDate, filterTime]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+A to select all
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        if (filteredAppointments.length > 0) {
          handleSelectAll();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [filteredAppointments, handleSelectAll]);

  // Reset all filters
  const handleResetFilters = () => {
    setFilterStatus('');
    setFilterDate('');
    setFilterTime('');
  };

  const handleAddAppointment = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('jwtToken');
      const res = await fetch(`${getApiBaseUrl()}/api/appointments/admin-add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newAppointment),
      });
      const appt = await res.json();
      Swal.fire({
        icon: 'success',
        title: 'Appointment Added!',
        text: 'The new appointment has been successfully created.',
      }).then(() => {
        const date = new Date(appt.appointmentDate);
        const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        const timeObj = new Date(`1970-01-01T${appt.appointmentTime}`);
        const timeStr = timeObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        const message =
          `*V3 Dental Clinic | Appointment Confirmation*\n\n` +
          `*Name:* ${appt.patientFullName}\n` +
          `*Service:* ${appt.serviceType}\n` +
          `*Date:* ${dateStr}\n` +
          `*Time:* ${timeStr}\n` +
          (appt.clinicArea && clinicLocations[appt.clinicArea] ? `*Our Location:* ${clinicLocations[appt.clinicArea]}\n\n` : '\n') +
          `Please arrive 10 minutes early.\n` +
          `Thank you for booking with us!\n\n` +
          `*V3 Dental Clinic*`;
        let phone = appt.patientPhone.replace(/\D/g, '');
        if (phone.startsWith('0')) {
          phone = phone.substring(1);
        }
        if (!phone.startsWith('91')) {
          phone = '91' + phone;
        }
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      });
      handleCloseAddModal();
      fetchAppointments();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add appointment. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) {
      Swal.fire({ icon: 'warning', title: 'Missing Information', text: 'Please enter a reason for rejection.' });
      return;
    }
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('jwtToken');
      const payload = {
        status: 'REJECTED',
        reason: rejectionReason,
      };
      await fetch(`${getApiBaseUrl()}/api/appointments/${rejectId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      Swal.fire('Rejected!', 'The appointment has been rejected.', 'success');
      setShowRejectModal(false);
      fetchAppointments();
    } catch (err) {
      Swal.fire('Error', 'Failed to reject appointment.', 'error');
    }
  };

  const downloadPDF = async () => {
    if (filteredAppointments.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Data',
        text: 'No appointments found to download.',
      });
      return;
    }

    const doc = new jsPDF({ orientation: 'landscape' });
    const logoBase64 = await getLogoBase64();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;

    // Add clinic logo and title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    const clinicTitle = 'V3 Dental Clinic';
    const titleWidth = doc.getTextWidth(clinicTitle);
    const logoWidth = 30;
    const logoHeight = 15;
    const gap = 1;

    const totalHeaderWidth = logoWidth + gap + titleWidth;
    const headerStartX = (pageWidth - totalHeaderWidth) / 2;
    
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', headerStartX, 12, logoWidth, logoHeight);
    }
    doc.text(clinicTitle, headerStartX + logoWidth + gap, 22);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Appointment Records Report', pageWidth / 2, 40, { align: 'center' });
    
    // Add filter information
    doc.setFontSize(10);
    let filterInfo = 'All Appointments';
    if (filterStatus || filterDate || filterTime) {
      filterInfo = 'Filtered by: ';
      const filters = [];
      if (filterStatus) filters.push(`Status: ${filterStatus}`);
      if (filterDate) filters.push(`Date: ${filterDate}`);
      if (filterTime) filters.push(`Time: ${filterTime}`);
      filterInfo += filters.join(', ');
    }
    doc.text(filterInfo, pageWidth / 2, 50, { align: 'center' });
    
    // Add generation date
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    doc.text(`Generated on: ${currentDate} at ${currentTime}`, pageWidth / 2, 60, { align: 'center' });
    
    // Prepare table data
    const tableData = filteredAppointments.map((appt, index) => {
      const date = new Date(appt.appointmentDate);
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      return [
        (index + 1).toString(),
        appt.patientFullName,
        appt.patientEmail || 'N/A',
        appt.patientPhone,
        formattedDate,
        appt.appointmentTime,
        appt.serviceType,
        appt.clinicArea || 'N/A',
        appt.status,
        appt.description || 'N/A'
      ];
    });
    
    // Create table
    autoTable(doc, {
      startY: 70,
      head: [['S.No.', 'Patient Name', 'Email', 'Phone', 'Date', 'Time', 'Service', 'Clinic Area', 'Status', 'Description']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        valign: 'middle'
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 30, halign: 'left' },
        2: { cellWidth: 40, halign: 'left' },
        3: { cellWidth: 25, halign: 'center' },
        4: { cellWidth: 20, halign: 'center' },
        5: { cellWidth: 20, halign: 'center' },
        6: { cellWidth: 40, halign: 'left' },
        7: { cellWidth: 25, halign: 'center' },
        8: { cellWidth: 20, halign: 'center' },
        9: { cellWidth: 'auto', halign: 'left' }
      },
      didDrawPage: function (data) {
        // Add page number
        doc.setFontSize(8);
        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          pageWidth - margin,
          pageHeight - 10,
          { align: 'right' }
        );
      }
    });
    
    // Add summary
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Appointments: ${filteredAppointments.length}`, 20, finalY);
    
    // Status summary
    const statusCounts = {};
    filteredAppointments.forEach(appt => {
      statusCounts[appt.status] = (statusCounts[appt.status] || 0) + 1;
    });
    
    let statusY = finalY + 10;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    Object.entries(statusCounts).forEach(([status, count]) => {
      doc.text(`${status}: ${count}`, 20, statusY);
      statusY += 5;
    });
    
    // Generate filename
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `appointment_records_${timestamp}.pdf`;
    
    // Download the PDF
    doc.save(filename);
    
    Swal.fire({
      icon: 'success',
      title: 'PDF Downloaded!',
      text: `Appointment records have been downloaded as ${filename}`,
    });
  };

  return (
    <>
      <div 
        className="admin-dashboard-container"
        style={{ backgroundImage: `url('${process.env.PUBLIC_URL}/images/background_admin.jpg')` }}
      >
        
        <div className="admin-dashboard-header">
          
    <h2><img 
        src="/images/logo.png" 
        alt="Dental Logo"
        className="dental-logo-animate me-2"
        style={{
          height: '40px',
          verticalAlign: 'text-bottom',
          animation: 'pulse 2s infinite',
        }}
      />V3 Dental Clinic</h2>
    <p>Manage appointments, records, and treatments</p>
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.2)', 
      padding: '0.5rem 1rem', 
      borderRadius: '20px', 
      fontSize: '0.9rem',
      fontWeight: '500',
      marginTop: '0.5rem'
    }}>
      📊 Total Appointments: <strong>{filteredAppointments.length}</strong>
      {filteredAppointments.length !== appointments.length && (
        <span style={{ marginLeft: '1rem', opacity: 0.8 }}>
          (Filtered from {appointments.length})
        </span>
      )}
    </div>
    </div>
        
        {/* Filter Controls */}
        <div className="filter-controls" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', maxWidth: 180 }}>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="form-select" style={{ paddingRight: filterStatus ? '2.2rem' : undefined }}>
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="RESCHEDULED">Rescheduled</option>
            </select>
            {filterStatus && (
              <button type="button" className="filter-clear-btn" onClick={() => setFilterStatus('')} title="Clear status filter">×</button>
            )}
          </div>
          <div style={{ position: 'relative', maxWidth: 160 }}>
            <input
              type="date"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
              className="form-control"
              style={{ paddingRight: filterDate ? '2.2rem' : undefined }}
            />
            {filterDate && (
              <button type="button" className="filter-clear-btn" onClick={() => setFilterDate('')} title="Clear date filter">×</button>
            )}
          </div>
          <div style={{ position: 'relative', maxWidth: 140 }}>
            <select value={filterTime} onChange={e => setFilterTime(e.target.value)} className="form-select" style={{ paddingRight: filterTime ? '2.2rem' : undefined }}>
              <option value="">All Times</option>
              {timeSlots.map((slot, idx) => (
                <option key={idx} value={slot}>{slot}</option>
              ))}
            </select>
            {filterTime && (
              <button type="button" className="filter-clear-btn" onClick={() => setFilterTime('')} title="Clear time filter">×</button>
            )}
          </div>
          <button type="button" className="btn btn-outline-secondary btn-sm reset-filters-btn" onClick={handleResetFilters} title="Reset all filters">
            Reset Filters
          </button>
          <Button variant="primary" className="ms-3" onClick={handleShowAddModal}>
            Add Appointment
          </Button>
        </div>

        {/* Selection Summary */}
        {selectedAppointments.size > 0 && (
          <div className="selection-summary" style={{ 
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', 
            padding: '0.75rem 1rem', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            border: '1px solid #90caf9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1976d2' }}>
                📋 {selectedAppointments.size} appointment(s) selected
              </span>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>
                out of {filteredAppointments.length} total
              </span>
              <span style={{ fontSize: '0.8rem', color: '#888', fontStyle: 'italic' }}>
                💡 Tip: Use Ctrl+A to select all
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSelectedAppointments(new Set());
                  setSelectAll(false);
                }}
              >
                Clear Selection
              </button>
              <button 
                className="btn btn-danger btn-sm"
                onClick={handleBulkDelete}
                disabled={isBulkDeleting}
              >
                {isBulkDeleting ? 'Deleting...' : `Delete Selected (${selectedAppointments.size})`}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <p>Loading appointments...</p>
        ) : (
          <div className="table-container">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th style={{ width: '50px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      disabled={filteredAppointments.length === 0}
                      title={selectAll ? "Deselect all" : "Select all"}
                    />
                  </th>
                  <th style={{ width: '60px', textAlign: 'center' }}>S.No.</th>
                  <th>Patient Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Service</th>
                  <th>Clinic Area</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appt, index) => (
                    <tr key={appt.id} className={selectedAppointments.has(appt.id) ? 'selected-row' : ''}>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={selectedAppointments.has(appt.id)}
                          onChange={() => handleAppointmentSelect(appt.id)}
                          title="Select this appointment"
                        />
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#666' }}>
                        {index + 1}
                      </td>
                      <td>{appt.patientFullName}</td>
                      <td>{appt.patientEmail}</td>
                      <td>{appt.patientPhone}</td>
                      <td>
                        {(() => {
                          const date = new Date(appt.appointmentDate);
                          return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                        })()}
                      </td>
                      <td>{appt.appointmentTime}</td>
                      <td>{appt.serviceType}</td>
                      <td>{appt.clinicArea}</td>
                      <td className={`status-${appt.status.toLowerCase()}`}>{appt.status}</td>
                      <td>
                        <div className={`action-btn-group ${appt.status === 'PENDING' ? 'pending-actions' : ''}`}>
                          {appt.status && appt.status.trim().toUpperCase() === 'PENDING' && (
                            <>
                              <button 
                                className='btn btn-success btn-sm' 
                                onClick={() => handleAccept(appt.id)} 
                                disabled={acceptingId === appt.id}
                              >
                                {acceptingId === appt.id ? 'Accepting...' : 'Accept'}
                              </button>
                              <button className='btn btn-danger btn-sm' onClick={() => handleShowModal(appt.id, true)}>Reject</button>
                              <button className='btn btn-warning btn-sm' onClick={() => handleShowModal(appt.id)}>Reschedule</button>
                            </>
                          )}
                          <button className='btn btn-info btn-sm' onClick={() => handleShowEditModal(appt.id, appt.status)}>Edit</button>
                          <button className='btn btn-danger btn-sm' onClick={() => handleDelete(appt.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="no-appointments">
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
            <Button variant="primary" onClick={() => handleReschedule(rejectId)} disabled={isRescheduling}>
              {isRescheduling ? 'Rescheduling...' : 'Reschedule'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Rejection Modal */}
        <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Reject Appointment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="rejectionReason">Reason for Rejection:</Form.Label>
              <Form.Control
                as="textarea"
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a clear reason for rejecting the appointment..."
                rows={4}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmReject}>
              Confirm Rejection
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
            {selectedStatus === 'REJECTED' && (
              <Form.Group className="mb-3">
                <Form.Label htmlFor="rejectionReason">Rejection Reason:</Form.Label>
                <Form.Control
                  as="textarea"
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection"
                  rows={3}
                />
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdateStatus} disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Status'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Add Appointment Modal */}
        <Modal show={showAddModal} onHide={handleCloseAddModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add New Appointment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="patientFullName">
                <Form.Label>Patient Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter full name"
                  value={newAppointment.patientFullName}
                  onChange={(e) => setNewAppointment({ ...newAppointment, patientFullName: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="patientPhone">
                <Form.Label>Patient Phone</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter phone number"
                  value={newAppointment.patientPhone}
                  onChange={(e) => setNewAppointment({ ...newAppointment, patientPhone: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="patientEmail">
                <Form.Label>Patient Email (Optional)</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email (if available)"
                  value={newAppointment.patientEmail}
                  onChange={(e) => setNewAppointment({ ...newAppointment, patientEmail: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="serviceType">
                <Form.Label>Service Type</Form.Label>
                <Form.Control
                  as="select"
                  value={newAppointment.serviceType}
                  onChange={(e) => setNewAppointment({ ...newAppointment, serviceType: e.target.value })}
                >
                  <option value="">Select a service</option>
                  {serviceTypes.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3" controlId="clinicArea">
                <Form.Label>Clinic Area</Form.Label>
                <Form.Control
                  as="select"
                  value={newAppointment.clinicArea}
                  onChange={(e) => setNewAppointment({ ...newAppointment, clinicArea: e.target.value })}
                >
                  <option value="">Select a clinic area</option>
                  {clinicAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3" controlId="appointmentDate">
                <Form.Label>Appointment Date</Form.Label>
                <Form.Control
                  type="date"
                  value={newAppointment.appointmentDate}
                  onChange={(e) => setNewAppointment({ ...newAppointment, appointmentDate: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="appointmentTime">
                <Form.Label>Appointment Time</Form.Label>
                <Form.Control
                  as="select"
                  value={newAppointment.appointmentTime}
                  onChange={(e) => setNewAppointment({ ...newAppointment, appointmentTime: e.target.value })}
                >
                  <option value="">Select a time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddAppointment} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Appointment'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <div className="floating-action-buttons">
        <Button variant="success" className="mb-2" onClick={downloadPDF} title="Export filtered appointments as PDF">
            Export to PDF
        </Button>
        <button className="logout-button" onClick={handleLogout}>V3 Logout</button>
      </div>
    </>
    
  );
};

export default AdminDashboard;