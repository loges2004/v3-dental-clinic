"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "bootstrap/dist/css/bootstrap.min.css"
import { Container, Row, Col, Form, Button, FloatingLabel } from "react-bootstrap"
import "./AppointmentForm.css"
import Swal from 'sweetalert2'

const timeSlots = [
  "09:30",
  "10:30",
  "11:30",
  "12:30",
  "01:30",
  "02:30",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:30",
]

const services = [
  "Dental Check-ups & Cleaning",
  "Fillings & Root Canal Treatment",
  "Crowns, Bridges & Extractions",
  "Braces, Aligners & Smile Designing",
  "Extractions & Wisdom Tooth Removal",
  "Teeth Whitening",
  "Pediatric Dentistry",
  "Full Mouth Rehabilitation",
]

const clinicAreas = ["Kannappa nagar", "Sai baba colony", "RS puram"]

const benefits = [
  {
    icon: "🩺",
    title: "Expert Dentists",
    description: "Qualified professionals with years of experience",
  },
  {
    icon: "✅",
    title: "Comfortable Environment",
    description: "Modern equipment and pain-free treatments",
  },
  {
    icon: "🕐",
    title: "Flexible Scheduling",
    description: "Evening and weekend appointments available",
  },
  {
    icon: "📞",
    title: "24/7 Emergency Care",
    description: "Round-the-clock support for dental emergencies",
  },
]

const AppointmentForm = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    clinicArea: "",
    date: "",
    timeSlot: "",
    serviceType: "",
  })

  const scrollRef = useRef(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!form.fullName.trim()) newErrors.fullName = "Full name is required"
      if (!form.email.trim()) newErrors.email = "Email is required"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email format"
      if (!form.phone.trim()) newErrors.phone = "Phone number is required"
      else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) newErrors.phone = "Phone must be 10 digits"
    }

    if (step === 2) {
      if (!form.clinicArea) newErrors.clinicArea = "Please select a clinic area"
      if (!form.date) newErrors.date = "Please select a date"
      if (!form.timeSlot) newErrors.timeSlot = "Please select a time slot"
    }

    if (step === 3) {
      if (!form.serviceType) newErrors.serviceType = "Please select a service"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && currentStep < 3) {
      nextStep()
    }
    if (isRightSwipe && currentStep > 1) {
      prevStep()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep(3)) return

    setIsSubmitting(true)

    try {
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:8001/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
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
      })

      if (response.ok) {
        setCurrentStep(4)
        Swal.fire({
          icon: 'success',
          title: 'Appointment Confirmed!',
          text: "Your appointment has been successfully booked. You'll receive a confirmation email shortly.",
          confirmButtonText: 'OK',
        }).then(() => {
          resetForm()
        })
      } else {
        throw new Error("Failed to book appointment")
      }
    } catch (error) {
      console.error("Appointment submission error:", error)
      alert("Failed to book appointment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setForm({
      fullName: "",
      email: "",
      phone: "",
      clinicArea: "",
      date: "",
      timeSlot: "",
      serviceType: "",
    })
    setCurrentStep(1)
    setErrors({})
  }

  const stepVariants = {
    hidden: { opacity: 0, x: isMobile ? 30 : 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isMobile ? -30 : -50 },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.05 : 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: isMobile ? 15 : 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="appointment-container">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: isMobile ? 0.95 : 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: isMobile ? 0.8 : 0.6 }}
        className="hero-section"
      >
        <div className="hero-overlay">
          <motion.div
            initial={{ y: isMobile ? 30 : 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: isMobile ? 0.6 : 0.8 }}
            className="hero-content"
          >
            <h1>Book Your Dental Appointment</h1>
            <p>Experience pain-free dentistry with our expert team</p>
            {isMobile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mobile-swipe-hint"
              >
                <p>👆 Swipe to navigate through steps</p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Enhanced floating elements for mobile */}
        <motion.div
          animate={{
            y: [0, isMobile ? -5 : -10, 0],
            rotate: [0, isMobile ? 2 : 5, 0],
          }}
          transition={{ duration: isMobile ? 2 : 3, repeat: Number.POSITIVE_INFINITY }}
          className="floating-element floating-1"
        />
        <motion.div
          animate={{
            y: [0, isMobile ? 8 : 10, 0],
            rotate: [0, isMobile ? -2 : -3, 0],
          }}
          transition={{ duration: isMobile ? 3 : 4, repeat: Number.POSITIVE_INFINITY }}
          className="floating-element floating-2"
        />
      </motion.div>

      <Container fluid className="main-content">
        <Row className="content-grid">
          {/* Main Form */}
          <Col xs={12} lg={8} className="form-section">
            <motion.div
              initial={{ opacity: 0, y: isMobile ? 30 : 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: isMobile ? 0.6 : 0.8 }}
              className="form-card"
              onTouchStart={isMobile ? handleTouchStart : undefined}
              onTouchMove={isMobile ? handleTouchMove : undefined}
              onTouchEnd={isMobile ? handleTouchEnd : undefined}
            >
              {/* Enhanced animated background elements for mobile */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, isMobile ? 1.05 : 1.1, 1],
                }}
                transition={{
                  duration: isMobile ? 15 : 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="bg-element bg-element-1"
              />
              <motion.div
                animate={{
                  rotate: [360, 0],
                  scale: [1, isMobile ? 0.95 : 0.9, 1],
                }}
                transition={{
                  duration: isMobile ? 12 : 15,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="bg-element bg-element-2"
              />

              <div className="form-header">
                <h2>Schedule Your Visit</h2>
                <p>Complete the form in 3 easy steps</p>

                {/* Enhanced Progress Bar for mobile */}
                <div className="progress-container">
                  <div className="progress-bar">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="progress-step-container">
                        <motion.div
                          className={`progress-step ${currentStep >= step ? "active" : ""}`}
                          animate={{
                            scale: currentStep === step ? (isMobile ? 1.15 : 1.1) : 1,
                          }}
                          transition={{ duration: 0.3 }}
                          whileTap={isMobile ? { scale: 0.95 } : {}}
                        >
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
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: isMobile ? 0.4 : 0.6 }}
                      className="form-step"
                    >
                      <div className="step-header">
                        <h3>Personal Information</h3>
                        <p>Tell us about yourself</p>
                      </div>

                      <Form className="form-fields">
                        <motion.div whileFocus={{ scale: isMobile ? 1.02 : 1 }}>
                          <FloatingLabel controlId="fullName" label="👤 Full Name *" className="mb-3">
                            <Form.Control
                              type="text"
                              value={form.fullName}
                              onChange={(e) => handleChange("fullName", e.target.value)}
                              placeholder="Enter your full name"
                              isInvalid={!!errors.fullName}
                              className="bootstrap-input"
                            />
                            {errors.fullName && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="invalid-feedback d-block"
                              >
                                ⚠️ {errors.fullName}
                              </motion.div>
                            )}
                          </FloatingLabel>
                        </motion.div>

                        <motion.div whileFocus={{ scale: isMobile ? 1.02 : 1 }}>
                          <FloatingLabel controlId="email" label="📧 Email Address *" className="mb-3">
                            <Form.Control
                              type="email"
                              value={form.email}
                              onChange={(e) => handleChange("email", e.target.value)}
                              placeholder="Enter your email address"
                              isInvalid={!!errors.email}
                              className="bootstrap-input"
                            />
                            {errors.email && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="invalid-feedback d-block"
                              >
                                ⚠️ {errors.email}
                              </motion.div>
                            )}
                          </FloatingLabel>
                        </motion.div>

                        <motion.div whileFocus={{ scale: isMobile ? 1.02 : 1 }}>
                          <FloatingLabel controlId="phone" label="📞 Phone Number *" className="mb-3">
                            <Form.Control
                              type="tel"
                              value={form.phone}
                              onChange={(e) => handleChange("phone", e.target.value)}
                              placeholder="Enter your phone number"
                              isInvalid={!!errors.phone}
                              className="bootstrap-input"
                            />
                            {errors.phone && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="invalid-feedback d-block"
                              >
                                ⚠️ {errors.phone}
                              </motion.div>
                            )}
                          </FloatingLabel>
                        </motion.div>
                      </Form>

                      <div className="form-actions">
                        <motion.div className="w-100">
                          <Button
                            onClick={nextStep}
                            className="btn-custom btn-primary w-100"
                            size="lg"
                            as={motion.button}
                            whileTap={{ scale: 0.98 }}
                            whileHover={{ scale: isMobile ? 1 : 1.02 }}
                          >
                            <motion.div
                              className="btn-gradient"
                              animate={{ x: [-100, 100] }}
                              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                            />
                            Next Step →
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Appointment Details */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: isMobile ? 0.4 : 0.6 }}
                      className="form-step"
                    >
                      <div className="step-header">
                        <h3>Appointment Details</h3>
                        <p>Choose your preferred time and location</p>
                      </div>

                      <Form className="form-fields">
                        <Row>
                          <Col xs={12} md={6}>
                            <motion.div whileFocus={{ scale: isMobile ? 1.02 : 1 }}>
                              <FloatingLabel controlId="clinicArea" label="📍 Clinic Area *" className="mb-3">
                                <Form.Select
                                  value={form.clinicArea}
                                  onChange={(e) => handleChange("clinicArea", e.target.value)}
                                  isInvalid={!!errors.clinicArea}
                                  className="bootstrap-input"
                                >
                                  <option value="">Select clinic area</option>
                                  {clinicAreas.map((area) => (
                                    <option key={area} value={area}>
                                      {area}
                                    </option>
                                  ))}
                                </Form.Select>
                                {errors.clinicArea && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="invalid-feedback d-block"
                                  >
                                    ⚠️ {errors.clinicArea}
                                  </motion.div>
                                )}
                              </FloatingLabel>
                            </motion.div>
                          </Col>

                          <Col xs={12} md={6}>
                            <motion.div whileFocus={{ scale: isMobile ? 1.02 : 1 }}>
                              <FloatingLabel controlId="date" label="📅 Preferred Date *" className="mb-3">
                                <Form.Control
                                  type="date"
                                  value={form.date}
                                  onChange={(e) => handleChange("date", e.target.value)}
                                  min={new Date().toISOString().split("T")[0]}
                                  isInvalid={!!errors.date}
                                  className="bootstrap-input"
                                />
                                {errors.date && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="invalid-feedback d-block"
                                  >
                                    ⚠️ {errors.date}
                                  </motion.div>
                                )}
                              </FloatingLabel>
                            </motion.div>
                          </Col>
                        </Row>

                        <div className="mb-3">
                          <Form.Label className="fw-semibold text-muted mb-3">🕐 Available Time Slots *</Form.Label>
                          <div className="time-slots">
                            {timeSlots.map((slot) => (
                              <motion.button
                                key={`left-${slot}`}
                                type="button"
                                whileHover={{ scale: isMobile ? 1 : 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleChange("timeSlot", slot)}
                                className={`btn time-slot ${form.timeSlot === slot ? "btn-primary selected" : "btn-outline-primary"}`}
                              >
                                {slot}
                              </motion.button>
                            ))}
                          </div>
                          {errors.timeSlot && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-danger mt-2 d-flex align-items-center"
                            >
                              ⚠️ {errors.timeSlot}
                            </motion.div>
                          )}
                        </div>
                      </Form>

                      <div className="form-actions">
                        <Row className="g-2">
                          <Col xs={6}>
                            <Button
                              onClick={prevStep}
                              variant="outline-secondary"
                              size="lg"
                              className="w-100"
                              as={motion.button}
                              whileTap={{ scale: 0.98 }}
                            >
                              ← Previous
                            </Button>
                          </Col>
                          <Col xs={6}>
                            <Button
                              onClick={nextStep}
                              className="btn-custom btn-primary w-100"
                              size="lg"
                              as={motion.button}
                              whileTap={{ scale: 0.98 }}
                              whileHover={{ scale: isMobile ? 1 : 1.02 }}
                            >
                              <motion.div
                                className="btn-gradient"
                                animate={{ x: [-100, 100] }}
                                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                              />
                              Next Step →
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Service Selection */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: isMobile ? 0.4 : 0.6 }}
                      className="form-step"
                    >
                      <div className="step-header">
                        <h3>Select Service</h3>
                        <p>Choose the dental service you need</p>
                      </div>

                      <Form className="form-fields">
                        <div className="service-list">
                          {services.map((service, index) => (
                            <motion.div
                              key={`left-${service}`}
                              initial={{ opacity: 0, x: isMobile ? -20 : 0 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="mb-2"
                            >
                              <Button
                                type="button"
                                variant={form.serviceType === service ? "primary" : "outline-primary"}
                                size="lg"
                                className={`w-100 text-start service-item ${form.serviceType === service ? "selected" : ""}`}
                                onClick={() => handleChange("serviceType", service)}
                                as={motion.button}
                                whileHover={{ scale: isMobile ? 1 : 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="d-flex justify-content-between align-items-center">
                                  <span>{service}</span>
                                  {form.serviceType === service && (
                                    <motion.span
                                      className="checkmark"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring", stiffness: 500 }}
                                    >
                                      ✓
                                    </motion.span>
                                  )}
                                </div>
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                        {errors.serviceType && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-danger mt-2 d-flex align-items-center"
                          >
                            ⚠️ {errors.serviceType}
                          </motion.div>
                        )}
                      </Form>

                      <div className="form-actions">
                        <Row className="g-2">
                          <Col xs={6}>
                            <Button
                              onClick={prevStep}
                              variant="outline-secondary"
                              size="lg"
                              className="w-100"
                              as={motion.button}
                              whileTap={{ scale: 0.98 }}
                            >
                              ← Previous
                            </Button>
                          </Col>
                          <Col xs={6}>
                            <Button
                              onClick={handleSubmit}
                              disabled={isSubmitting}
                              variant="success"
                              size="lg"
                              className="w-100 btn-custom"
                              as={motion.button}
                              whileTap={{ scale: 0.98 }}
                              whileHover={{ scale: isMobile ? 1 : 1.02 }}
                            >
                              <motion.div
                                className="btn-gradient btn-gradient-green"
                                animate={{ x: [-100, 100] }}
                                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                              />
                              {isSubmitting ? (
                                <>
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                    className="spinner-border spinner-border-sm me-2"
                                  />
                                  Booking...
                                </>
                              ) : (
                                "Confirm Appointment ✓"
                              )}
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </Col>

          {/* Benefits Sidebar - Mobile Optimized */}
          <Col xs={12} lg={4} className="sidebar-section">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="sidebar-content">
              <motion.div variants={itemVariants} className="benefits-card">
                <h3>Why Choose Us?</h3>
                <div className="benefits-list">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="benefit-item"
                      whileHover={{ scale: isMobile ? 1 : 1.02 }}
                    >
                      <div className="benefit-icon">{benefit.icon}</div>
                      <div className="benefit-content">
                        <h4>{benefit.title}</h4>
                        <p>{benefit.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="emergency-card">
                <div className="emergency-header">
                  <div className="emergency-icon">📞</div>
                  <h4>Dental Emergency?</h4>
                </div>
                <p>Call us immediately at</p>
                <motion.div
                  className="emergency-number"
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: ["0 0 0 0 rgba(251, 191, 36, 0.4)", "0 0 0 10px rgba(251, 191, 36, 0)"],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  87786 00419
                </motion.div>
                <p className="emergency-note">We'll accommodate you as soon as possible</p>
              </motion.div>
            </motion.div>
          </Col>
        </Row>

        {/* Mobile-Optimized Animated Image Gallery Section */}
        <motion.div ref={scrollRef} className="gallery-section">
          <div className="gallery-header">
            <motion.h2
              initial={{ opacity: 0, y: isMobile ? 30 : 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Modern Dental Facility
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              State-of-the-art equipment and comfortable environment
            </motion.p>
          </div>

          <div className="gallery-container">
            {/* Mobile-optimized gallery layout */}
            {isMobile ? (
              <div className="mobile-gallery-vertical">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <motion.div
                    key={`mobile-${index}`}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        duration: 0.6,
                        delay: index * 0.15,
                        ease: "easeOut",
                      },
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="mobile-gallery-item-vertical"
                  >
                    <motion.div
                      className="image-container"
                      whileInView={{
                        rotateY: [0, 5, 0],
                        scale: [0.95, 1, 0.98],
                      }}
                      transition={{
                        duration: 0.8,
                        delay: index * 0.1,
                      }}
                    >
                      <img
                        src={`https://via.placeholder.com/350x250/${index <= 3 ? "4F46E5" : "10B981"}/FFFFFF?text=${index <= 3 ? "Dental+Facility" : "Treatment+Room"}+${index <= 3 ? index : index - 3}`}
                        alt={`${index <= 3 ? "Dental facility" : "Treatment room"} ${index <= 3 ? index : index - 3}`}
                        className="img-fluid"
                      />
                      <motion.div
                        className="image-overlay"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: index * 0.2 + 0.3 }}
                      >
                        <motion.div
                          className="overlay-content"
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.2 + 0.5 }}
                        >
                          <h5>{index <= 3 ? "Modern Equipment" : "Comfortable Rooms"}</h5>
                          <p>{index <= 3 ? "Advanced dental technology" : "Relaxing treatment environment"}</p>
                        </motion.div>
                      </motion.div>
                    </motion.div>

                    {/* Decorative elements */}
                    <motion.div
                      className="decoration-left"
                      initial={{ x: -30, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
                    />
                    <motion.div
                      className="decoration-right"
                      initial={{ x: 30, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.6, duration: 0.5 }}
                    />
                  </motion.div>
                ))}

                {/* Floating animation elements */}
                <motion.div
                  className="floating-scroll-element"
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </div>
            ) : (
              <>
                {/* Desktop gallery layout */}
                <div className="gallery-row gallery-left">
                  {[1, 2, 3].map((index) => (
                    <motion.div
                      key={`left-${index}`}
                      initial={{ x: -200, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{
                        duration: 0.8,
                        delay: index * 0.2,
                        type: "spring",
                        stiffness: 100,
                      }}
                      className="gallery-item"
                    >
                      <img
                        src={`https://via.placeholder.com/320x240/4F46E5/FFFFFF?text=Dental+Facility+${index}`}
                        alt={`Dental facility ${index}`}
                        className="img-fluid"
                      />
                    </motion.div>
                  ))}
                </div>
                <div className="gallery-row gallery-right">
                  {[4, 5, 6].map((index) => (
                    <motion.div
                      key={`right-${index}`}
                      initial={{ x: 200, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{
                        duration: 0.8,
                        delay: (index - 3) * 0.2,
                        type: "spring",
                        stiffness: 100,
                      }}
                      className="gallery-item"
                    >
                      <img
                        src={`https://via.placeholder.com/320x240/10B981/FFFFFF?text=Treatment+Room+${index - 3}`}
                        alt={`Treatment room ${index - 3}`}
                        className="img-fluid"
                      />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </Container>
    </div>
  )
}

export default AppointmentForm

