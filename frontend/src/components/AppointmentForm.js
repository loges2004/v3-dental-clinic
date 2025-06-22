"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "bootstrap/dist/css/bootstrap.min.css"
import { Container, Row, Col, Form, Button, FloatingLabel, Alert } from "react-bootstrap"
import "./AppointmentForm.css"
import Swal from 'sweetalert2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTooth,
  faTeeth,
  faStethoscope,
  faUserDoctor,
  faSyringe,
  faCalendarCheck,
  faFileMedical,
  faBriefcaseMedical
} from '@fortawesome/free-solid-svg-icons';

import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const availableIcons = [
    faTooth,
    faTeeth,
    faStethoscope,
    faUserDoctor,
    faSyringe,
    faCalendarCheck,
    faFileMedical,
    faBriefcaseMedical
];
  
const iconsToRender = [...availableIcons]
    .sort(() => Math.random() - 0.5); // Shuffle to make it non-repetitive

const servicesList = [
    "Dental Check-ups & Cleaning",
    "Fillings & Root Canal Treatment",
    "Crowns, Bridges & Extractions",
    "Braces, Aligners & Smile Designing",
    "Extractions & Wisdom Tooth Removal",
    "Teeth Whitening",
    "Pediatric Dentistry",
    "Full Mouth Rehabilitation",
];

const timeSlots = [
  "09:30", "10:30", "11:30", "12:30", "01:30", "02:30", 
  "04:00", "05:00", "06:00", "07:00", "08:00", "09:00"
];

const clinicAreas = [
  "Kannappa nagar",
  // "Sai baba colony",
  // "RS puram"
];

const benefits = [
  { icon: "🩺", title: "Expert Dentists", description: "Qualified professionals with years of experience" },
  { icon: "✅", title: "Comfortable Environment", description: "Modern equipment and pain-free treatments" },
  { icon: "🕐", title: "Flexible Scheduling", description: "Evening and weekend appointments available" },
  { icon: "📞", title: "24/7 Emergency Care", description: "Round-the-clock support for dental emergencies" },
];

const galleryImages = [
  { id: 1, src: "/images/image6.jpg", alt: "Modern dental chair and equipment" },
  { id: 2, src: "/images/img2.jpg", alt: "Waiting area of patients" },
  { id: 3, src: "/images/img3.jpg", alt: "Dentist consulting with a patient" },
  { id: 4, src: "/images/image7.jpg", alt: "Advanced dental technology" },
  { id: 5, src: "/images/image2.jpg", alt: "Comfortable patient seating" },
  { id: 5, src: "/images/image3.jpg", alt: "Comfortable patient seating" },
  { id: 6, src: "/images/image10.jpg", alt: "Professional dental tools" },

];

const AppointmentForm = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isMobile, setIsMobile] = useState(false)
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    clinicArea: "",
    date: "",
    timeSlot: "",
    serviceType: "",
  })
  const scrollRef = useRef(null);
  const desktopGalleryRef = useRef(null);
  const mobileGalleryRef = useRef(null);
  const animationFrameId = useRef(null);
  const scrollDirection = useRef(1);

  // Get API base URL dynamically
  const getApiBaseUrl = () => {
    // Check if we're in development or production
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      // Development - try to detect the correct IP
      return 'http://localhost:8001';
    } else {
      // Production - use environment variable or Railway URL
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      if (backendUrl) {
        return backendUrl;
      }
      
      // Fallback: use Railway URL (replace with your actual Railway URL)
      return 'https://your-railway-app-name.railway.app';
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const animateScroll = useCallback(() => {
    const scrollSpeed = 1.2; // Adjust for desired speed
    const galleryEl = window.innerWidth <= 768 ? mobileGalleryRef.current : desktopGalleryRef.current;

    if (galleryEl) {
        const { scrollLeft, scrollWidth, clientWidth } = galleryEl;

        // When it reaches the end, reverse direction
        if (scrollLeft >= scrollWidth - clientWidth - 1) {
            scrollDirection.current = -1;
        }
        // When it reaches the start, go forward again
        else if (scrollLeft <= 0) {
            scrollDirection.current = 1;
        }

        galleryEl.scrollLeft += scrollSpeed * scrollDirection.current;
        animationFrameId.current = requestAnimationFrame(animateScroll);
    }
  }, []);

  useEffect(() => {
    const galleryEl = window.innerWidth <= 768 ? mobileGalleryRef.current : desktopGalleryRef.current;

    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                cancelAnimationFrame(animationFrameId.current); // Ensure no multiple loops
                animationFrameId.current = requestAnimationFrame(animateScroll);
            } else {
                cancelAnimationFrame(animationFrameId.current);
            }
        },
        { threshold: 0.1 }
    );

    if (galleryEl) {
        observer.observe(galleryEl);
    }

    return () => {
        if (galleryEl) {
            observer.unobserve(galleryEl);
        }
        cancelAnimationFrame(animationFrameId.current);
    };
  }, [isMobile, animateScroll]);

  const validateField = useCallback((name, value) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (!value) error = 'Full Name is required.';
        break;
      case 'phone':
        if (!value) error = 'Phone Number is required.';
        else if (!/^\d{10,15}$/.test(value)) error = 'Please enter a valid phone number (10-15 digits).';
        break;
      case 'email':
        if (value && !/\S+@\S+\.\S+/.test(value)) error = 'Email is not valid.';
        break;
      case 'clinicArea':
        if (!value) error = 'Clinic Area is required.';
        break;
      case 'date':
        if (!value) error = 'Please select a date.';
        break;
      case 'timeSlot':
        if (!value) error = 'Please select a time slot.';
        break;
      case 'serviceType':
        if (!value) error = 'Please select a service.';
        break;
      default:
        break;
    }
    return error;
  }, []);

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, form[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleNextStep = () => {
    let isValid = true;
    const currentErrors = { ...errors };

    const fieldsToValidate = {
      1: ['fullName', 'phone'],
      2: ['clinicArea', 'date', 'timeSlot'],
      3: ['serviceType'],
    }[currentStep];

    if (fieldsToValidate) {
        fieldsToValidate.forEach(field => {
          const error = validateField(field, form[field]);
          if (error) {
            isValid = false;
            currentErrors[field] = error;
          }
        });
        
        setErrors(currentErrors);
        setTouched(prev => {
            const newTouched = {...prev};
            fieldsToValidate.forEach(field => { newTouched[field] = true; });
            return newTouched;
        });
    }

    if (isValid) {
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Prevent double submission
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      // Show loading state
      Swal.fire({
        title: 'Booking Appointment...',
        text: 'Please wait while we process your request',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const apiUrl = `${getApiBaseUrl()}/api/appointments`;
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Accept": "application/json",
          "Cache-Control": "no-cache"
        },
        credentials: "include",
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          service: form.serviceType,
          time: form.timeSlot,
          date: form.date,
          clinicArea: form.clinicArea,
        }),
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
        const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          // Ignore parsing error
        }
        throw new Error(errorMessage);
      }

      await response.json();

      // Close loading dialog
      Swal.close();

      setCurrentStep(4);
      Swal.fire({
        icon: 'success',
        title: 'Appointment Confirmed!',
        text: "Your appointment has been successfully booked. You'll receive a confirmation email shortly.",
        confirmButtonText: 'OK',
        allowOutsideClick: false,
      }).then(resetForm);

    } catch (error) {
      // Close loading dialog
      Swal.close();
      
      let errorMessage = error.message;
      let errorTitle = 'Booking Failed';
      
      // Handle specific error cases
      if (error.message.includes("already exists")) {
        errorMessage = "This appointment slot is already booked. Please choose another time.";
        errorTitle = 'Duplicate Appointment';
      } else if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        errorMessage = "Network connection error. Please check your internet connection and try again.";
        errorTitle = 'Connection Error';
      } else if (error.message.includes("CORS")) {
        errorMessage = "Server connection issue. Please try again or contact support.";
        errorTitle = 'Server Error';
      } else if (error.message.includes("timeout")) {
        errorMessage = "Request timed out. Please try again.";
        errorTitle = 'Timeout Error';
      } else if (error.message.includes("localhost")) {
        errorMessage = "Cannot connect to server. Please ensure you're on the same network as the server.";
        errorTitle = 'Network Error';
      }
      
      Swal.fire({ 
        icon: 'error', 
        title: errorTitle, 
        text: errorMessage,
        confirmButtonText: 'Try Again',
        allowOutsideClick: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({ fullName: "", email: "", phone: "", clinicArea: "", date: "", timeSlot: "", serviceType: "" });
    setCurrentStep(1);
    setErrors({});
    setTouched({});
  };

  const stepVariants = {
    hidden: { opacity: 0, x: isMobile ? 30 : 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isMobile ? -30 : -50 },
  };
  
  const today = new Date().toISOString().split('T')[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <div className="appointment-form-wrapper">
      <div className="appointment-container">
        <div className="appointment-header">
          <div className="floating-icons-container">
            {iconsToRender.map((icon, i) => <FontAwesomeIcon key={i} icon={icon} className={`floating-icon icon-${i+1}`} />)}
          </div>
          <img src="/images/logo.png" alt="V3 Dental Clinic Logo" className="animated-logo clinic-logo" />
          <h1 className="clinic-title">V3 Dental Clinic</h1>
          <div className="clinic-subtitle">Book Your Appointment</div>
        </div>

        <Container fluid className="main-content">
          <Row className="content-grid">
            <Col xs={12} lg={8} className="form-section">
              <motion.div
                initial={{ opacity: 0, y: isMobile ? 30 : 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: isMobile ? 0.6 : 0.8 }}
                className="form-card"
              >
                <div className="form-header">
                  <h2>Schedule Your Visit</h2>
                  <p>Complete the form in 3 easy steps</p>
                  <div className="progress-container">
                    <div className="progress-bar">
                      {[1, 2, 3].map((step) => (
                        <div key={step} className="progress-step-container">
                          <motion.div className={`progress-step-circle ${currentStep >= step ? "active" : ""}`} animate={{ scale: currentStep === step ? (isMobile ? 1.15 : 1.1) : 1 }}>
                            {currentStep > step ? "✓" : step}
                          </motion.div>
                          {step < 3 && <div className={`progress-line ${currentStep > step ? "active" : ""}`} />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-content">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="form-step">
                        <div className="step-header"><h3>Personal Information</h3><p>Tell us about yourself</p></div>
                        <Form className="form-fields">
                          <FloatingLabel controlId="fullName" label="👤 Full Name" className="mb-3 required">
                            <Form.Control type="text" name="fullName" value={form.fullName} onChange={(e) => handleChange(e.target.name, e.target.value)} onBlur={handleBlur} isInvalid={touched.fullName && !!errors.fullName} isValid={touched.fullName && !errors.fullName} placeholder=" " />
                            {touched.fullName && errors.fullName && <div className="invalid-feedback d-block">⚠️ {errors.fullName}</div>}
                          </FloatingLabel>
                          <FloatingLabel controlId="email" label="📧 Email Address (Optional)" className="mb-3">
                            <Form.Control type="email" name="email" value={form.email} onChange={(e) => handleChange(e.target.name, e.target.value)} onBlur={handleBlur} isInvalid={touched.email && !!errors.email} isValid={touched.email && !errors.email && form.email} placeholder=" " />
                            {touched.email && errors.email && <div className="invalid-feedback d-block">⚠️ {errors.email}</div>}
                          </FloatingLabel>
                          <FloatingLabel controlId="phone" label="📞 Phone Number" className="mb-3 required">
                            <Form.Control type="tel" name="phone" value={form.phone} onChange={(e) => handleChange(e.target.name, e.target.value)} onBlur={handleBlur} isInvalid={touched.phone && !!errors.phone} isValid={touched.phone && !errors.phone} placeholder=" " />
                            {touched.phone && errors.phone && <div className="invalid-feedback d-block">⚠️ {errors.phone}</div>}
                          </FloatingLabel>
                        </Form>
                        <div className="form-actions">
                          <Button onClick={handleNextStep} className="btn-custom btn-primary w-100" size="lg">Next Step →</Button>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                       <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="form-step">
                        <div className="step-header"><h3>Appointment Details</h3><p>Choose your preferred time and location</p></div>
                        <Alert variant="info" className="mb-3"><FontAwesomeIcon icon={faWhatsapp} className="me-2" />Enter valid WhatsApp number and email for confirmation message</Alert>
                        
                        <Form className="form-fields">
                            <FloatingLabel controlId="clinicArea" label="📍 Clinic Area" className="mb-3 required">
                                <Form.Select name="clinicArea" value={form.clinicArea} onChange={(e) => handleChange(e.target.name, e.target.value)} onBlur={handleBlur} isInvalid={touched.clinicArea && !!errors.clinicArea} isValid={touched.clinicArea && !errors.clinicArea}>
                                    <option value="">Select clinic area</option>
                                    {clinicAreas.map((area) => <option key={area} value={area}>{area}</option>)}
                                </Form.Select>
                                {touched.clinicArea && errors.clinicArea && <div className="invalid-feedback d-block">⚠️ {errors.clinicArea}</div>}
                            </FloatingLabel>
                            <FloatingLabel controlId="date" label="📅 Preferred Date" className="mb-3 required">
                                <Form.Control type="date" name="date" value={form.date} min={today} onChange={(e) => handleChange(e.target.name, e.target.value)} onBlur={handleBlur} isInvalid={touched.date && !!errors.date} isValid={touched.date && !errors.date} placeholder=" " />
                                {touched.date && errors.date && <div className="invalid-feedback d-block">⚠️ {errors.date}</div>}
                            </FloatingLabel>
                            <div className="mb-3 required">
                                <Form.Label className="fw-semibold text-muted mb-3">🕐 Available Time Slots</Form.Label>
                                <div className="time-slots">
                                    {timeSlots.map((slot) => <Button key={slot} type="button" onClick={() => handleChange("timeSlot", slot)} className={`btn time-slot ${form.timeSlot === slot ? "btn-primary selected" : "btn-outline-primary"}`}>{slot}</Button>)}
                                </div>
                                {touched.timeSlot && errors.timeSlot && <div className="text-danger mt-2 d-flex align-items-center">⚠️ {errors.timeSlot}</div>}
                            </div>
                        </Form>
                        <div className="form-actions">
                            <Button onClick={prevStep} variant="outline-primary" size="lg" className="w-50 btn-previous">← Previous</Button>
                            <Button onClick={handleNextStep} className="btn-custom btn-primary w-50" size="lg">Next Step →</Button>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                       <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="form-step">
                        <div className="step-header"><h3>Select Service</h3><p>Choose the dental service you need</p></div>
                        <Form className="form-fields">
                            <div className="service-list required" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {servicesList.map((service, index) => (
                                    <div
                                      key={index}
                                      role="button"
                                      tabIndex={0}
                                      className={`service-item ${form.serviceType === service ? "selected" : ""}`}
                                      onClick={() => handleChange("serviceType", service)}
                                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleChange("serviceType", service)}
                                    >
                                      <div className="d-flex justify-content-between align-items-center">
                                        <span>{service}</span>
                                        {form.serviceType === service && (
                                          <span className="checkmark">✓</span>
                                        )}
                                      </div>
                                    </div>
                                ))}
                            </div>
                             {touched.serviceType && errors.serviceType && <div className="text-danger mt-2 d-flex align-items-center">⚠️ {errors.serviceType}</div>}
                        </Form>
                        <div className="form-actions">
                            <Button onClick={prevStep} variant="outline-primary" size="lg" className="w-50 btn-previous">← Previous</Button>
                            <Button onClick={handleSubmit} disabled={isSubmitting} variant="success" size="lg" className="w-50 btn-custom">{isSubmitting ? 'Booking...' : 'Confirm Appointment ✓'}</Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </Col>

            <Col xs={12} lg={4} className="info-section">
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <motion.h3 variants={itemVariants} className="info-title">Why Choose Us?</motion.h3>
                {benefits.map((benefit, i) => (
                  <motion.div key={i} variants={itemVariants} className="benefit-card">
                    <div className="benefit-icon">{benefit.icon}</div>
                    <div className="benefit-text">
                      <h5>{benefit.title}</h5>
                      <p>{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
                <motion.div variants={itemVariants} className="emergency-card">
                  <div className="emergency-header">
                    <div className="emergency-icon">📞</div>
                    <h4>Dental Emergency?</h4>
                  </div>
                  <p>Call us immediately at</p>
                  <motion.a 
                    href="tel:8778600419"
                    className="emergency-number"
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: ["0 0 0 0 rgba(220, 53, 69, 0.5)", "0 0 0 12px rgba(220, 53, 69, 0)"],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    87786 00419
                  </motion.a>
                  <p className="emergency-note">We'll accommodate you as soon as possible</p>
                </motion.div>
              </motion.div>
            </Col>
          </Row>
          
          <motion.div ref={scrollRef} className="gallery-section">
            <div className="gallery-header">
                <motion.h2 initial={{ opacity: 0, y: isMobile ? 30 : 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    Our Modern Dental Facility
                </motion.h2>
                <motion.p initial={{ opacity: 0, y: isMobile ? 20 : 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                    State-of-the-art equipment and comfortable environment
                </motion.p>
            </div>

            <div className="gallery-container">
                <div className="mobile-gallery" ref={mobileGalleryRef}>
                    {galleryImages.map((image, index) => (
                        <motion.div key={`mobile-${image.id}`} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: index * 0.1 }} className="mobile-gallery-item">
                            <img src={image.src} alt={image.alt} />
                        </motion.div>
                    ))}
                </div>

                <div className="desktop-gallery" ref={desktopGalleryRef}>
                    {galleryImages.map((image, index) => (
                        <motion.div key={`desktop-${image.id}`} initial={{ x: -100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, delay: index * 0.15, type: "spring", stiffness: 80 }} className="gallery-item">
                                <img src={image.src} alt={image.alt} />
                            </motion.div>
                        ))}
                </div>
            </div>
            
            {/* Animated Features Section */}
            <motion.div 
              className="features-highlight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="features-container">
                <motion.span 
                  className="feature-text"
                  initial={{ opacity: 0, x: -30, scale: 0.8 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  animate={{ 
                    textShadow: ["0 0 0px rgba(59, 130, 246, 0)", "0 0 10px rgba(59, 130, 246, 0.3)", "0 0 0px rgba(59, 130, 246, 0)"]
                  }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.4, 
                    type: "spring", 
                    stiffness: 100,
                    textShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  🔬 Advanced Dental Technology
                </motion.span>
                
                <motion.span 
                  className="feature-separator"
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.6, 
                    type: "spring", 
                    stiffness: 200,
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  
                </motion.span>
                
                <motion.span 
                  className="feature-text"
                  initial={{ opacity: 0, x: 30, scale: 0.8 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  whileHover={{ scale: 1.1, rotate: -2 }}
                  animate={{ 
                    textShadow: ["0 0 0px rgba(139, 92, 246, 0)", "0 0 10px rgba(139, 92, 246, 0.3)", "0 0 0px rgba(139, 92, 246, 0)"]
                  }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.8, 
                    type: "spring", 
                    stiffness: 100,
                    textShadow: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }
                  }}
                >
                  😌 Relaxing Treatment Environment
                </motion.span>
              </div>
            </motion.div>
          </motion.div>
          
        </Container>
      </div>
    </div>
  );
}

export default AppointmentForm;

