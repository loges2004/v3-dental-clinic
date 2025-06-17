import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Spinner, FloatingLabel } from 'react-bootstrap';
import Swal from 'sweetalert2';
import './AppointmentForm.css';

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
  '09:30'
];

const services = [
  'Dental Check-ups & Cleaning',
  'Fillings & Root Canal Treatment',
  'Crowns, Bridges & Extractions',
  'Braces, Aligners & Smile Designing',
  'Extractions & Wisdom Tooth Removal (Impaction)',
  'Teeth Whitening',
  'Pediatric Dentistry',
  'Full Mouth Rehabilitation',
];

const clinicAreas = [
  'Kannappa nagar',
  'sai baba colony',
  'RS puram',
];

const AppointmentForm = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    clinicArea: '',
    date: '',
    timeSlot: '',
    serviceType: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImage, setCurrentImage] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev % 6) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { fullName, email, phone, clinicArea, date, timeSlot, serviceType } = form;

    if (!fullName || !email || !phone || !clinicArea || !date || !timeSlot || !serviceType) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'All fields are required. Please fill in all information.',
      });
      return false;
    }

    const emailRegex = /^[\w-.]+@([\w-]+\.)+(com|org|net|edu|gov|mil|biz|info|name|aero|arpa|coop|museum|int|pro|travel|mobi|[a-zA-Z]{2})$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter a valid email address.',
      });
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter a valid 10-digit phone number.',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:8001/api/appointments', {
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        service: form.serviceType,
        time: form.timeSlot,
        date: form.date,
        clinicArea: form.clinicArea
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      });
      
      if (response.data) {
        Swal.fire({
          icon: 'success',
          title: 'Appointment Booked!',
          text: 'You will receive a confirmation shortly.',
        });
        setForm({ 
          fullName: '', 
          email: '', 
          phone: '', 
          clinicArea: '', 
          date: '', 
          timeSlot: '', 
          serviceType: '' 
        });
      }
    } catch (err) {
      console.error('Appointment submission error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: err.response?.data?.message || 'Failed to book appointment. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBackgroundImage = () => {
    switch(currentImage) {
      case 1: return 'url(/images/image6.jpg)';
      case 2: return 'url(/images/bg_booking.jpg)';
      case 3: return 'url(/images/image11.jpg)';
      case 4: return 'url(/images/image2.jpg)';
      case 5: return 'url(/images/image4.jpg)';
      case 6: return 'url(/images/image10.jpg)';
      default: return 'url(/images/bg_booking.jpg)';
    }
  };

  return (
    <div className="appointment-page-container">
      <div 
        className="appointment-hero"
        style={{ backgroundImage: getBackgroundImage() }}
      >
        <div className="hero-overlay">
          <h1>Book Your Dental Appointment</h1>
          <p>Experience pain-free dentistry with our expert team</p>
        </div>
      </div>

      <Container className="appointment-form-section" fluid>
        <Row className="justify-content-center">
          <Col xs={12} md={7} lg={6} className="form-container">
            <div className="form-header">
              <h2>Schedule Your Visit</h2>
              <p>Fill out the form below to reserve your appointment</p>
            </div>
            <Form onSubmit={handleSubmit} className="appointment-form">
              <FloatingLabel controlId="fullName" label="Full Name *" className="mb-3">
                <Form.Control
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </FloatingLabel>
              <FloatingLabel controlId="email" label="Email *" className="mb-3">
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
              </FloatingLabel>
              <FloatingLabel controlId="phone" label="Phone Number *" className="mb-3">
                <Form.Control
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </FloatingLabel>
              <FloatingLabel controlId="clinicArea" label="Clinic Area *" className="mb-3">
                <Form.Select
                  name="clinicArea"
                  value={form.clinicArea}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select area</option>
                  {clinicAreas.map((area, idx) => (
                    <option key={idx} value={area}>{area}</option>
                  ))}
                </Form.Select>
              </FloatingLabel>
              <Row>
                <Col xs={12} md={6}>
                  <FloatingLabel controlId="date" label="Date *" className="mb-3">
                    <Form.Control
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </FloatingLabel>
                </Col>
                <Col xs={12} md={6}>
                  <FloatingLabel controlId="timeSlot" label="Time Slot *" className="mb-3">
                    <Form.Select
                      name="timeSlot"
                      value={form.timeSlot}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((slot, idx) => (
                        <option key={idx} value={slot}>{slot}</option>
                      ))}
                    </Form.Select>
                  </FloatingLabel>
                </Col>
              </Row>
              <FloatingLabel controlId="serviceType" label="Service Type *" className="mb-3">
                <Form.Select
                  name="serviceType"
                  value={form.serviceType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select service</option>
                  {services.map((service, idx) => (
                    <option key={idx} value={service}>{service}</option>
                  ))}
                </Form.Select>
              </FloatingLabel>
              <Button
                type="submit"
                className="submit-btn w-100"
                disabled={isSubmitting}
                variant="success"
                size="lg"
              >
                {isSubmitting ? <><Spinner animation="border" size="sm" /> Booking...</> : 'Confirm Appointment'}
              </Button>
            </Form>
          </Col>
          <Col xs={12} md={5} className="benefits-sidebar mt-4 mt-md-0">
            <h3>Why Choose Us?</h3>
            <ul className="benefits-list">
              <li>
                <span className="benefit-icon">🦷</span>
                <div>
                  <h4>Expert Dentists</h4>
                  <p>Qualified professionals with years of experience</p>
                </div>
              </li>
              <li>
                <span className="benefit-icon">💺</span>
                <div>
                  <h4>Comfortable Environment</h4>
                  <p>Modern equipment and pain-free treatments</p>
                </div>
              </li>
              <li>
                <span className="benefit-icon">⏱️</span>
                <div>
                  <h4>Flexible Scheduling</h4>
                  <p>Evening and weekend appointments available</p>
                </div>
              </li>
              <li>
                <span className="benefit-icon">💰</span>
                <div>
                  <h4>Affordable Care</h4>
                  <p>Competitive pricing and payment plans</p>
                </div>
              </li>
            </ul>
            <div className="emergency-banner">
              <h4>Dental Emergency?</h4>
              <p>Call us immediately at <strong>87786 00419</strong></p>
              <p>We'll accommodate you as soon as possible</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AppointmentForm;