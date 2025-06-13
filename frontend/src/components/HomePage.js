import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container, Offcanvas, Row, Col, Card, Button } from 'react-bootstrap';
import './HomePage.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

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

const doctors = [
  { name: 'Dr. Anish M', qualification: 'BDS', specialization: 'General Dentist', img: '/images/Anish.jpg', phone: '98765 43210' },
  { name: 'Dr.Nithishkumar', qualification: 'BDS', specialization: 'Dental surgeon', img: '/images/Nithish.jpg', phone: '81899 85733' },
  { name: 'Dr. Ashriene Jose PJ', qualification: 'BDS', specialization: 'General Dentist', img: '/images/Ashriene.jpg', phone: '99887 66554' },
];

const openingTimes = [
  { days: 'Monday to Sunday', times: '9.30am to 2.00pm, 4.00pm to 9.30pm' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = React.useState(false);

  const [currentImage, setCurrentImage] = React.useState(1);
  const getBackgroundImage = () => {
    switch(currentImage) {
      case 1: return 'url(/images/image6.jpg)';
      case 2: return 'url(/images/bg_booking.jpg)';
      case 3: return 'url(/images/image55.jpg)';
      case 4: return 'url(/images/image11.jpg)';
      case 5: return 'url(/images/image4.jpg)';
      case 6: return 'url(/images/image9.jpg)';
      default: return 'url(/images/bg_booking.jpg)';
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => prev >= 6 ? 1 : prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    AOS.init({ duration: 900, once: false });
  }, []);

  return (
    <div className="homepage-bootstrap">
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="md" fixed="top" className="shadow-sm py-2">
        <Container fluid>
          <div className="d-flex align-items-center w-100" style={{ minHeight: '40px' }}>
            <Navbar.Brand className="d-flex align-items-center mb-0 pb-0" style={{paddingBottom: 0, marginBottom: 0}}>
              <img src="/images/logo.png" alt="Logo" width="40" height="40" className="rounded-circle" style={{objectFit:'cover'}} />
            </Navbar.Brand>
            <div className="clinic-name-animated" style={{fontSize: '1.6rem', fontWeight: 'bold'}}>
              V3 DENTAL CLINIC
            </div>
            <div className="ms-auto">
              <Navbar.Toggle aria-controls="main-navbar-offcanvas" onClick={() => setShowOffcanvas(true)} />
            </div>
          </div>
          <Navbar.Offcanvas
            id="main-navbar-offcanvas"
            aria-labelledby="main-navbar-offcanvas-label"
            placement="end"
            show={showOffcanvas}
            onHide={() => setShowOffcanvas(false)}
            className="bg-dark text-light"
          >
            <Offcanvas.Header closeButton closeVariant="white">
              <Offcanvas.Title id="main-navbar-offcanvas-label" className="text-info">
                Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="ms-auto flex-column flex-md-row gap-2 gap-md-4 align-items-md-center">
                <Nav.Link className="text-light" onClick={() => {navigate('/'); setShowOffcanvas(false);}}>Home</Nav.Link>
                <Nav.Link className="text-light" onClick={() => {navigate('/appointment'); setShowOffcanvas(false);}}>Book Appointment</Nav.Link>
                <Nav.Link className="text-light" href="#services" onClick={() => setShowOffcanvas(false)}>Services</Nav.Link>
                <Nav.Link className="text-light" href="#doctors" onClick={() => setShowOffcanvas(false)}>Doctors</Nav.Link>
                <Nav.Link className="text-light" href="#contact" onClick={() => setShowOffcanvas(false)}>Contact</Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      {/* Clinic Tour Carousel */}
      <section
        className="clinic-image-section"
        style={{
          width: '100vw',
          height: '55vw',
          maxHeight: '400px',
          minHeight: '220px',
          backgroundImage: getBackgroundImage(),
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          margin: 0,
          padding: 0,
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          overflow: 'hidden',
        }}
      >
        {/* Optionally, add navigation dots or arrows here */}
      </section>

      {/* Highlighted Services & Opening Times */}
      <section className="py-5" style={{background: 'linear-gradient(90deg, #222 0%, #00bcd4 100%)'}}>
        <Container>
          <Row className="justify-content-center align-items-center g-4">
            <Col xs={12} md={7}>
              <h2 className="text-white fw-bold mb-4">Our Services</h2>
              <ul className="list-unstyled text-white fs-5 mb-4">
                {services.map((service, idx) => (
                  <li key={idx} className="mb-2">• {service}</li>
                ))}
              </ul>
            </Col>
            <Col xs={12} md={5} className="text-white">
              <div className="bg-dark bg-opacity-75 rounded p-4 text-center">
                <h4 className="fw-bold text-warning mb-2">Consultation Time</h4>
                {openingTimes.map((slot, idx) => (
                  <div key={idx}>
                    <div className="mb-1">{slot.days}</div>
                    <div className="fw-bold text-success">{slot.times}</div>
                  </div>
                ))}
                <div className="mt-3">
                  <span className="me-2">📞</span>
                  <span className="fw-bold">87786 00419 | 93616 29220</span>
                </div>
                <div className="mt-2">
                  <a
                    href="https://www.google.com/maps/place/V3+Dental+Clinic,+Kannusamy+Street,+Sanganoor+Main+Road,+Coimbatore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="open-maps-link"
                  >
                    <span role="img" aria-label="map">📍</span> Open in Google Maps
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Hero/Quote Section */}
      <section className="bg-primary text-white text-center py-5 hero-section">
        <Container>
          <h1 className="display-6 fw-bold mb-3">Creating Healthy Smiles, One Visit at a Time.</h1>
          <Button size="lg" variant="light" className="fw-bold px-4 py-2 mt-3" onClick={() => navigate('/appointment')}>
            Book Appointment
          </Button>
        </Container>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-4 text-primary fw-bold">Meet Our Doctors</h2>
          <Row className="justify-content-center g-4">
            {doctors.map((doc, idx) => (
              <Col xs={12} sm={6} md={4} key={idx} className="d-flex justify-content-center">
                <Card className="doctor-card text-center shadow-sm position-relative" style={{maxWidth: '320px', width: '100%'}} data-aos="zoom-in">
                  <Card.Img variant="top" src={doc.img} alt={doc.name} className="doctor-img mx-auto mt-3" style={{width: '90px', height: '90px', objectFit: 'cover', borderRadius: '50%', border: '3px solid #00bcd4'}} />
                  <Card.Body>
                    <Card.Title className="mb-1">{doc.name}</Card.Title>
                    <Card.Subtitle className="mb-1 text-muted">{doc.qualification}</Card.Subtitle>
                    <Card.Text className="mb-0">{doc.specialization}</Card.Text>
                    <Card.Text className="mt-2 mb-0"><strong>Contact:</strong> <a href={`tel:${doc.phone.replace(/\s/g, '')}`}>{doc.phone}</a></Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5 contact-section">
        <Container>
          <h2 className="text-center mb-4 contact-title" data-aos="fade-up">Contact Us</h2>
          <Row className="justify-content-center">
            <Col xs={12} md={6} className="mb-3">
              <Card className="shadow-sm border-0 contact-card" data-aos="fade-up">
                <Card.Body>
                  <Card.Text>
                    <strong>Address:</strong><br />
                    235, Kannusamy Street, Sanganoor Main Road,<br />Kannapa Nagar Junction, Coimbatore - 641027
                  </Card.Text>
                  <Card.Text>
                    <strong>Phone:</strong> <a href="tel:8778600419">87786 00419</a> | <a href="tel:9361629220">93616 29220</a><br />
                    <strong>Email:</strong> <a href="mailto:v3dentalclinic@gmail.com">v3dentalclinic@gmail.com</a>
                  </Card.Text>
                  <div className="mt-3">
                    <a
                      href="https://www.google.com/maps/place/V3+Dental+Clinic,+Kannusamy+Street,+Sanganoor+Main+Road,+Coimbatore"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="open-maps-link"
                    >
                      <span role="img" aria-label="map">📍</span> Open in Google Maps
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <div className="ratio ratio-16x9 rounded shadow-sm overflow-hidden position-relative" data-aos="zoom-in">
                <iframe
                  title="Clinic Location"
                  src="https://www.google.com/maps?q=V3+Dental+Clinic,+Kannusamy+Street,+Sanganoor+Main+Road,+Coimbatore&output=embed"
                  style={{ border: 0, borderRadius: '10px' }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="footer-section bg-dark text-white text-center py-3 mt-4">
        <Container>
          <small>&copy; {new Date().getFullYear()} V3 Dental Clinic. All rights reserved.</small>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage; 