"use client"

import React, { useState, useEffect, useRef } from "react"
import "./HomePage.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTooth,
  faSyringe,
  faCrown,
  faXRay,
  faStar,
  faChild,
  faHospitalUser
} from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebook, faWhatsapp, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { Helmet } from "react-helmet";

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  const servicesRef = useRef(null)
  const heroRef = useRef(null)

  const whyChooseRef = useRef(null)
  const contactRef = useRef(null)

  const whyChooseUs = [
    {
      icon: "🦷",
      title: "Expert Dentists",
      description: "Qualified professionals with years of experience",
      color: "blue-cyan",
    },
    {
      icon: "💺",
      title: "Comfortable Environment",
      description: "Modern equipment and pain-free treatments",
      color: "purple-pink",
    },
    {
      icon: "⏱️",
      title: "Flexible Scheduling",
      description: "Evening and weekend appointments available",
      color: "green-emerald",
    },
    {
      icon: "💰",
      title: "Affordable Care",
      description: "Competitive pricing and payment plans",
      color: "orange-red",
    },
  ]

  const serviceIcons = {
    tooth: faTooth,
    syringe: faSyringe,
    crown: faCrown,
    xray: faXRay,
    star: faStar,
    child: faChild,
    hospital: faHospitalUser,
  };
  

  const services = [
    {
      title: "Dental Check-ups & Cleaning",
      description: "Comprehensive oral health examination and professional cleaning",
      icon: "tooth",
      image: "/images/dental_cleaning.jpg",
    },
    {
      title: "Fillings & Root Canal Treatment",
      description: "Advanced restorative procedures for damaged teeth",
      icon: "syringe",
      image: "/images/dentalRootCanal.png",
    },
    {
      title: "Crowns, Bridges & Extractions",
      description: "Prosthetic solutions and surgical procedures",
      icon: "crown",
      image: "/images/dentalbridge.jpg",
    },
    {
      title: "Braces, Aligners & Smile Designing",
      description: "Orthodontic treatments for perfect smile alignment",
      icon: "tooth", // Braces icon is in Pro, fallback to tooth
      image: "/images/braces.jpg",
    },
    {
      title: "Extractions & Wisdom Tooth Removal",
      description: "Safe and painless tooth extraction procedures",
      icon: "xray",
      image: "/images/wisdom-tooth.jpg",
    },
    {
      title: "Teeth Whitening",
      description: "Professional whitening for brighter, whiter teeth",
      icon: "star",
      image: "/images/teeth_white.jpg",
    },
    {
      title: "Pediatric Dentistry",
      description: "Specialized dental care for children and teens",
      icon: "child",
      image: "/images/child-dentist-dental.webp",
    },
    {
      title: "Full Mouth Rehabilitation",
      description: "Complete restoration of oral health and function",
      icon: "hospital",
      image: "/images/Full_mouth_Rehabilitation.jpg",
    },
  ];
  

  const heroImages = [
    "/images/teeth_white.jpg",
    "/images/image11.jpg",
    "/images/bg_booking.jpg",
    "/images/anish2.jpg",
     "/images/image5.jpg"
  ]

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "-50px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")
        }
      })
    }, observerOptions)

    // Observe all sections
    const sections = document.querySelectorAll(".animate-section")
    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  // Add click outside handler for mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      const mobileMenu = document.querySelector('.mobile-menu')
      const mobileMenuBtn = document.querySelector('.mobile-menu-btn')
      
      if (mobileMenu && !mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Add escape key handler for mobile menu
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev)
  }

  // Auto-rotate carousel images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]); // Added heroImages.length as dependency
  
  return (
    <>
      <Helmet>
        <title>V3 Dental Clinic | Best Dental Care in Your City</title>
        <meta name="description" content="V3 Dental Clinic offers expert dentists, modern equipment, flexible scheduling, and affordable dental care. Book your appointment online for a healthy smile!" />
        <meta name="keywords" content="Dental Clinic, Dentist, Appointment, Oral Health, Teeth Cleaning, Root Canal, Braces, Wisdom Tooth, Pediatric Dentistry, Dental Care" />
        <meta property="og:title" content="V3 Dental Clinic | Best Dental Care in Your City" />
        <meta property="og:description" content="Book your appointment with expert dentists at V3 Dental Clinic. Modern, affordable, and patient-friendly dental care." />
        <meta property="og:type" content="website" />
      </Helmet>
      {/* Main Container */}
      <div className="homepage-container">
        {/* Floating Bubbles Container */}
        <div className="bubble-container"></div>

        {/* Fixed Navigation Header */}
        <header className="fixed-header">
          <nav className="navbar">
            <div className="nav-container">
              <div className="nav-content">
                <div className="nav-brand">
                  <div className="logo-container">
                    <img
                      src="/images/logo.png"
                      alt="V3 Dental Clinic Logo"
                      className="logo"
                    />
                  </div>
                </div>
                <div className="brand-text">
                  <h1 className="clinic-name">V3 DENTAL CLINIC</h1>
                  <p className="tagline">UNLEASH YOUR RADIANT SMILE</p>
                </div>
              </div>

              {/* Desktop Menu */}
              <div className="desktop-menu">
                ["Home", "Services", "Why Choose Us", "Contact"].map((item) =>
                  React.createElement(
                    "a",
                    {
                      key: item,
                      href: `#${item.toLowerCase().replace(/\s+/g, "-")}`,
                      className: "nav-link",
                    },
                    item,
                  ),
                )
                React.createElement(
                  "button",
                  {
                    className: "book-btn",
                    onClick: () => window.location.href = '/appointment',
                  },
                  React.createElement(
                    "svg",
                    {
                      width: "16",
                      height: "16",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                    },
                    React.createElement("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
                    React.createElement("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
                    React.createElement("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
                    React.createElement("line", { x1: "3", y1: "10", x2: "21", y2: "10" }),
                  ),
                  "Book Appointment",
                ),
              ),

              {/* Mobile Menu Button */}
              React.createElement(
                "button",
                {
                  className: `mobile-menu-btn ${isMenuOpen ? "active" : ""}`,
                  onClick: toggleMenu,
                  "aria-label": "Toggle mobile menu",
                },
                React.createElement("span"),
                React.createElement("span"),
                React.createElement("span"),
              ),
            ),
          ),

          {/* Mobile Menu */}
          React.createElement(
            "div",
            {
              className: `mobile-menu ${isMenuOpen ? "open" : ""}`,
              "aria-hidden": !isMenuOpen,
            },
            React.createElement(
              "div",
              { className: "mobile-menu-top-bar" },
              React.createElement("span", { className: "close-label" }, "Close"),
            ),
            React.createElement(
              "div",
              { className: "mobile-menu-content" },
              ["Home", "Services", "Why Choose Us", "Contact"].map((item) =>
                React.createElement(
                  "a",
                  {
                    key: item,
                    href: `#${item.toLowerCase().replace(/\s+/g, "-")}`,
                    className: "mobile-nav-link",
                    onClick: () => setIsMenuOpen(false),
                  },
                  item,
                ),
              ),
              React.createElement(
                "button",
                {
                  className: "mobile-book-btn",
                  onClick: () => window.location.href = '/appointment',
                },
                React.createElement(
                  "svg",
                  {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                  },
                  React.createElement("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
                  React.createElement("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
                  React.createElement("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
                  React.createElement("line", { x1: "3", y1: "10", x2: "21", y2: "10" }),
                ),
                "Book Appointment",
              ),
            ),
          ),
        ),
      ),

      {/* Simplified Hero Section */}
      React.createElement(
        "section",
        { ref: heroRef, className: "hero-section carousel-section", id: "home" },
        React.createElement(
          "div",
          { className: "hero-background" },
          React.createElement("div", {
            className: "hero-image",
            style: { backgroundImage: `url(${heroImages[currentImage]})` },
          }),
          React.createElement("div", { className: "hero-overlay" }),
        ),

        {/* Centered Carousel Indicators */}
        React.createElement(
          "div",
          { className: "hero-indicators" },
          heroImages.map((_, index) =>
            React.createElement("button", {
              key: index,
              className: `indicator ${index === currentImage ? "active" : ""}`,
              onClick: () => setCurrentImage(index),
            }),
          ),
        ),

        {/* Carousel Navigation Buttons */}
        React.createElement(
          "button",
          {
            className: "carousel-nav prev",
            onClick: () => setCurrentImage((prev) => (prev - 1 + heroImages.length) % heroImages.length),
            "aria-label": "Previous image",
          },
          React.createElement(
            "svg",
            {
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
            },
            React.createElement("polyline", { points: "15 18 9 12 15 6" })
          )
        ),
        React.createElement(
          "button",
          {
            className: "carousel-nav next",
            onClick: () => setCurrentImage((prev) => (prev + 1) % heroImages.length),
            "aria-label": "Next image",
          },
          React.createElement(
            "svg",
            {
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
            },
            React.createElement("polyline", { points: "9 18 15 12 9 6" })
          )
        ),

        {/* Hero Content */}
        React.createElement(
          "div",
          { className: "hero-content" },
          React.createElement(
            "div",
            { className: "hero-text" },
            React.createElement(
              "div",
              { className: "hero-badge" },
              React.createElement(
                "svg",
                {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                },
                React.createElement("polygon", {
                  points: "12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26",
                }),
              ),
              "Premium Dental Care",
            ),
            React.createElement(
              "h2",
              { className: "hero-title" },
              "Creating Healthy",
              React.createElement("br"),
              React.createElement("span", { className: "hero-highlight" }, "Smiles"),
            ),
            React.createElement(
              "span",
              { className: "hero-subtitle" },
              "One Visit at a Time"
            ),
            React.createElement(
              "p",
              { className: "hero-description" },
              "Experience world-class dental care with our expert team of professionals using cutting-edge technology",
            ),
            React.createElement(
              "div",
              { className: "hero-buttons" },
              React.createElement(
                "button",
                {
                  className: "hero-btn primary",
                  onClick: () => window.location.href = '/appointment',
                },
                React.createElement(
                  "svg",
                  {
                    width: "20",
                    height: "20",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                  },
                  React.createElement("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
                  React.createElement("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
                  React.createElement("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
                  React.createElement("line", { x1: "3", y1: "10", x2: "21", y2: "10" }),
                ),
                "Book Your Appointment",
              ),
              React.createElement(
                "button",
                {
                  className: "hero-btn secondary",
                  onClick: () => window.location.href = 'tel:9361629220',
                },
                React.createElement(
                  "svg",
                  {
                    width: "20",
                    height: "20",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                  },
                  React.createElement("path", {
                    d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
                  }),
                ),
                "Call Now",
              ),
            ),
          ),
        ),
      ),

      {/* Fixed Call and WhatsApp Buttons */}
      React.createElement(
        "div",
        { className: "fixed-contact-buttons" },
        React.createElement(
          "a",
          {
            href: "tel:+919361629220",
           className:"call-btn"
          },
          React.createElement(
            "svg",
            {
              width: "20",
              height: "20",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
            },
            React.createElement("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" }),
          ),
          "Call Us",
        ),
        React.createElement(
          "a",
          {
            href: "https://wa.me/918778600419?text=Enquiry%20For%20Dental%20Treatment%20Services",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "whatsapp-btn",
          },
          React.createElement(
            "svg",
            {
              width: "20",
              height: "20",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
            },
            React.createElement("path", { d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" }),
          ),
          "Connect Us",
        ),
      ),

      {/* Services Section */}
      React.createElement(
        "section",
        {
          id: "services",
          ref: servicesRef,
          className: "services-section animate-section",
        },
        React.createElement("div", { className: "services-bg" }),
        React.createElement(
          "div",
          { className: "container" },
          React.createElement(
            "div",
            { className: "section-header" },
            React.createElement(
              "div",
              { className: "section-badge" },
              React.createElement(
                "svg",
                {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                },
                React.createElement("polygon", {
                  points: "12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26",
                }),
              ),
              "Our Services",
            ),
            React.createElement(
              "h2",
              { className: "section-title" },
              "Comprehensive ",
              React.createElement("span", { className: "title-highlight" }, "Dental Services"),
            ),
            React.createElement(
              "p",
              { className: "section-description" },
              "From routine check-ups to advanced procedures, we provide complete dental care with the latest technology and techniques",
            ),
          ),

          React.createElement(
            "div",
            { className: "services-grid" },
            services.map((service, index) =>
              React.createElement(
                "div",
                {
                  key: index,
                  className: `service-card animate-slide-${index % 2 === 0 ? "left" : "right"}`,
                  style: { animationDelay: `${index * 0.15}s` },
                },
                React.createElement(
                  "div",
                  { className: "service-image" },
                  React.createElement("img", { src: service.image, alt: service.title }),
                  React.createElement("div", { className: "service-overlay" }),
                  React.createElement("div", { className: `service-icon ${service.color}` }, React.createElement(FontAwesomeIcon, { icon: serviceIcons[service.icon] })),
                ),
                React.createElement(
                  "div",
                  { className: "service-content" },
                  React.createElement("h3", { className: "service-title" }, service.title),
                  React.createElement("p", { className: "service-description" }, service.description),
                  React.createElement("div", { className: "service-divider" }),
                ),
              ),
            ),
          ),

          {/* Consultation Hours */}
          React.createElement(
            "div",
            { className: "consultation-card" },
            React.createElement(
              "div",
              { className: "consultation-content" },
              React.createElement(
                "div",
                { className: "consultation-icon" },
                React.createElement(
                  "svg",
                  {
                    width: "40",
                    height: "40",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                  },
                  React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
                  React.createElement("polyline", { points: "12,6 12,12 16,14" }),
                ),
              ),
              React.createElement(
                "div",
                { className: "consultation-header" },
                React.createElement("span", { className: "consultation-emoji" }, "⏰"),
                React.createElement("h3", { className: "consultation-title" }, "Consultation Hours"),
              ),
              React.createElement(
                "div",
                { className: "consultation-subtitle" },
                "We are open 7 days a week for your convenience."
              ),
              React.createElement(
                "div",
                { className: "consultation-schedule" },
                React.createElement(
                  "div",
                  { className: "schedule-item" },
                  React.createElement("p", { className: "schedule-day highlight" }, "Monday - Saturday"),
                  React.createElement("p", { className: "schedule-time highlight" }, "09:30 AM – 02:00 PM"),
                  React.createElement("p", { className: "schedule-time highlight" }, "04:00 PM – 09:30 PM"),
                ),
                React.createElement(
                  "div",
                  { className: "schedule-item" },
                  React.createElement("p", { className: "schedule-day highlight" }, "Sunday"),
                  React.createElement("p", { className: "schedule-time highlight" }, "09:30 AM – 01:00 PM"),
                ),
              ),
              React.createElement(
                "div",
                { className: "consultation-contact" },
                React.createElement(
                  "div",
                  { className: "contact-item highlight" },
                  React.createElement(
                    "svg",
                    {
                      width: "20",
                      height: "20",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                    },
                    React.createElement("path", {
                      d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
                    }),
                  ),
                  React.createElement("span", null, "87786 00419 | 93616 29220"),
                ),
                React.createElement(
                  "a",
                  {
                    href: "https://maps.app.goo.gl/yqS21NNiS5ALGvvs7",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "maps-link highlight",
                  },
                  React.createElement(
                    "svg",
                    {
                      width: "18",
                      height: "18",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                    },
                    React.createElement("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }),
                    React.createElement("circle", { cx: "12", cy: "10", r: "3" }),
                  ),
                  React.createElement("span", null, "📍 Open in Google Maps"),
                ),
              ),
            ),
          ),
        ),
      ),
      React.createElement(
        "section",
        {
          id: "why-choose-us",
          ref: whyChooseRef,
          className: "why-choose-section animate-section",
        },
        React.createElement(
          "div",
          { className: "container" },
          React.createElement(
            "div",
            { className: "section-header" },
            React.createElement(
              "div",
              { className: "section-badge" },
              React.createElement(
                "svg",
                {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                },
                React.createElement("polygon", {
                  points: "12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26",
                }),
              ),
              "Why Choose Us",
            ),
            React.createElement(
              "h2",
              { className: "section-title" },
              "Why Patients ",
              React.createElement("span", { className: "title-highlight" }, "Choose Us"),
            ),
            React.createElement(
              "p",
              { className: "section-description" },
              "We're committed to providing exceptional dental care with a focus on comfort, quality, and affordability",
            ),
          ),

          React.createElement(
            "div",
            { className: "why-choose-grid" },
            whyChooseUs.map((item, index) =>
              React.createElement(
                "div",
                {
                  key: index,
                  className: "why-choose-card",
                  style: { animationDelay: `${index * 0.2}s` },
                },
                React.createElement("div", { className: `why-choose-icon ${item.color}` }, item.icon),
                React.createElement("h3", { className: "why-choose-title" }, item.title),
                React.createElement("p", { className: "why-choose-description" }, item.description),
                React.createElement("div", { className: "why-choose-divider" }),
              ),
            ),
          ),
        ),
      ),

      {/* Contact Section */}
      React.createElement(
        "section",
        {
          id: "contact",
          ref: contactRef,
          className: "contact-section animate-section",
        },
        React.createElement("div", { className: "contact-bg" }),
        React.createElement(
          "div",
          { className: "container" },
          React.createElement(
            "div",
            { className: "section-header" },
            React.createElement(
              "div",
              { className: "section-badge" },
              [
                React.createElement(
                  "svg",
                  {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                  },
                  [
                    React.createElement("path", {
                      d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z",
                    }),
                    React.createElement("polyline", { points: "22,6 12,13 2,6" }),
                  ]
                ),
                "Contact Us",
              ]
            ),
            React.createElement(
              "h2",
              { className: "section-title" },
              "Get In ",
              React.createElement("span", { className: "title-highlight" }, "Touch"),
            ),
            React.createElement(
              "p",
              { className: "section-description" },
              "Ready to start your journey to better oral health? Contact us today to schedule your appointment",
            ),
          ),

          React.createElement(
            "div",
            { className: "contact-grid" },
            React.createElement(
              "div",
              { className: "contact-info" },
              React.createElement(
                "div",
                { className: "contact-item" },
                React.createElement(
                  "div",
                  { className: "contact-icon blue-green" },
                  React.createElement(
                    "svg",
                    {
                      width: "24",
                      height: "24",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                    },
                    React.createElement("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }),
                    React.createElement("circle", { cx: "12", cy: "10", r: "3" }),
                  ),
                ),
                React.createElement(
                  "div",
                  { className: "contact-details" },
                  React.createElement("h3", null, "Address"),
                  React.createElement(
                    "a",
                    {
                      href: "https://maps.app.goo.gl/yqS21NNiS5ALGvvs7",
                      target: "_blank",
                      rel: "noopener noreferrer",
                      style: { color: "#3b82f6", textDecoration: "underline", cursor: "pointer" }
                    },
                    "235, Kannusamy Street, Sanganoor Main Road,",
                    React.createElement("br"),
                    "Kannapa Nagar Junction, Coimbatore - 641027"
                  ),
                ),
              ),

              React.createElement(
                "div",
                { className: "contact-item" },
                React.createElement(
                  "div",
                  { className: "contact-icon green-blue" },
                  React.createElement(
                    "svg",
                    {
                      width: "24",
                      height: "24",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                    },
                    React.createElement("path", {
                      d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
                    }),
                  ),
                ),
                React.createElement(
                  "div",
                  { className: "contact-details" },
                  React.createElement("h3", null, "Phone"),
                  React.createElement(
                    "div",
                    null,
                    React.createElement("a", { href: "tel:8778600419" }, "87786 00419"),
                    React.createElement("a", { href: "tel:9361629220" }, "93616 29220"),
                  ),
                ),
              ),

              React.createElement(
                "div",
                { className: "contact-item" },
                React.createElement(
                  "div",
                  { className: "contact-icon purple-pink" },
                  React.createElement(
                    "svg",
                    {
                      width: "24",
                      height: "24",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                    },
                    React.createElement("path", {
                      d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z",
                    }),
                    React.createElement("polyline", { points: "22,6 12,13 2,6" }),
                  ),
                ),
                React.createElement(
                  "div",
                  { className: "contact-details" },
                  React.createElement("h3", null, "Email"),
                  React.createElement("a", { href: "mailto:v3dentalclinic@gmail.com" }, "v3dentalclinic@gmail.com"),
                ),
              ),

              React.createElement(
                "div",
                { className: "contact-item" },
                React.createElement(
                  "div",
                  { className: "contact-icon orange-red" },
                  React.createElement(
                    "svg",
                    {
                      width: "24",
                      height: "24",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                    },
                    React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
                    React.createElement("polyline", { points: "12,6 12,12 16,14" }),
                  ),
                ),
                              React.createElement(
                "div",
                { className: "contact-details" },
                React.createElement("h3", null, "Working Hours"),
                React.createElement(
                  "div",
                  null,
                  React.createElement("p", null, "Monday - Sunday"),
                  React.createElement("p", { className: "highlight" }, "9:30 AM - 2:00 PM"),
                  React.createElement("p", { className: "highlight" }, "4:00 PM - 9:30 PM"),
                ),
              ),
            ),

            {/* Social Media Links */}
            React.createElement(
              "div",
              { className: "social-media-section" },
              React.createElement(
                "div",
                { className: "social-media-header" },
                React.createElement("h3", null, "Follow Us"),
                React.createElement("p", null, "Stay connected with us on social media"),
              ),
              React.createElement(
                "div",
                { className: "social-media-grid" },
                React.createElement(
                  "a",
                  {
                    href: "https://www.facebook.com/share/16ie37fw3X/",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    "aria-label": "V3 Dental Clinic Facebook"
                  },
                  React.createElement(FontAwesomeIcon, { icon: faFacebook, style: { fontSize: '3rem', color: '#4267b2' } })
                ),
                React.createElement(
                  "a",
                  {
                    href: "https://www.instagram.com/v3dentalclinic?igsh=MW43c3N4NGxrdGEybw==",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    "aria-label": "V3 Dental Clinic Instagram"
                  },
                  React.createElement(FontAwesomeIcon, { icon: faInstagram, style: { fontSize: '3rem', color: '#e1306c' } })
                ),
                React.createElement(
                  "a",
                  {
                    href: "https://wa.me/918778600419?text=Enquiry%20for%20Dental%20Treatment%20Services",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    "aria-label": "V3 Dental Clinic WhatsApp"
                  },
                  React.createElement(FontAwesomeIcon, { icon: faWhatsapp, style: { fontSize: '3rem', color: '#25d366' } })
                ),
                React.createElement(
                  "a",
                  {
                    href: "https://youtube.com/@v3dentalclinic?si=EXhGgmR5BIekCybG",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    "aria-label": "V3 Dental Clinic YouTube"
                  },
                  React.createElement(FontAwesomeIcon, { icon: faYoutube, style: { fontSize: '3rem', color: '#ff0000' } })
                ),
              ),
            ),
          ),

            React.createElement(
              "div",
              { className: "contact-map" },
              React.createElement("div", { style: { position: "relative", width: "100%", height: "100%" } },
                React.createElement("iframe", {
                  src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.3!2d77.0!3d11.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDAwJzAwLjAiTiA3N8KwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890",
                  width: "100%",
                  height: "100%",
                  style: { border: 0 },
                  allowFullScreen: "",
                  loading: "lazy",
                  referrerPolicy: "no-referrer-when-downgrade",
                  title: "V3 Dental Clinic Location"
                }),
                React.createElement("a", {
                  href: "https://maps.app.goo.gl/yqS21NNiS5ALGvvs7",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 2,
                    background: "rgba(0,0,0,0)",
                    cursor: "pointer"
                  },
                  "aria-label": "Open in Google Maps"
                })
              ),
            ),
          ),
        ),
      ),

      {/* Footer */}
      React.createElement(
        "footer",
        { className: "footer" },
        React.createElement("div", { className: "footer-gradient" }),
        React.createElement(
          "div",
          { className: "container" },
          React.createElement(
            "div",
            { className: "footer-content" },
            React.createElement(
              "div",
              { className: "footer-brand" },
              React.createElement(
                "div",
                { className: "footer-logo" },
                React.createElement("img", { src: "/images/logo.png", alt: "V3 Dental Clinic Logo" }),
              ),
              React.createElement("h3", { className: "footer-title" }, "V3 DENTAL CLINIC"),
            ),
            React.createElement("p", { className: "footer-tagline" }, "Excellence in Dental Care"),
          ),
          React.createElement(
            "div",
            { className: "footer-bottom" },
            React.createElement(
              "p",
              { className: "copyright" },
              `© ${new Date().getFullYear()} V3 Dental Clinic. All Rights Reserved.`,
              React.createElement("span", { className: "footer-highlight" }, " Creating Healthy Smiles")
            ),
            React.createElement(
              "div",
              { className: "developer-credits" },
              React.createElement(
                "div",
                { className: "developer-info" },
                React.createElement(
                  "div",
                  { className: "lk-logo" },
                  React.createElement("span", { className: "lk-text" }, "LK"),
                ),
                React.createElement(
                  "div",
                  { className: "developer-texts" },
                  React.createElement("span", { className: "developer-text" }, "Designed & Developed by Logeshkumar"),
                  React.createElement("span", { className: "developer-contact" }, "📞 +91 97916 42972 | ✉️ logeshkumars777@gmail.com"),
                ),
              ),
            ),
          ),
        ),
      ),
    </>
  )
}

export default HomePage
