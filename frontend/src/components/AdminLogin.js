import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
import Swal from 'sweetalert2';
import { Helmet } from "react-helmet";

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const getApiBaseUrl = () => {
        return process.env.REACT_APP_API_BASE_URL || 'http://localhost:8001';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const apiUrl = `${getApiBaseUrl()}/api/auth/login`;
            const response = await axios.post(apiUrl, {
                email,
                password,
            });
            localStorage.setItem('jwtToken', response.data.jwtToken);
            Swal.fire({
                icon: 'success',
                title: 'Login successful!',
                text: 'Redirecting to dashboard...',
                timer: 1500,
                showConfirmButton: false,
            });
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 1500);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Invalid credentials. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Admin Login | V3 Dental Clinic</title>
                <meta name="description" content="Admin login page for V3 Dental Clinic. Secure access to manage appointments and clinic operations." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div 
                className="admin-login-container"
                style={{ backgroundImage: `url('/images/bg5.jpg')` }}
            >
                <div className="admin-login-card">
                    <h2 className="card-title text-center mb-4 position-relative">
                        <div className="d-inline-block position-relative">
                            <img 
                                src="/images/logo.png" 
                                alt="Dental Logo"
                                className="dental-logo-animate me-2"
                                style={{
                                    height: '32px',
                                    verticalAlign: 'text-bottom',
                                    animation: 'pulse 2s infinite'
                                }}
                            />
                            <span className="text-gradient">V3 Dentist Login</span>
                        </div>
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="emailInput" className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                id="emailInput"
                                aria-describedby="emailHelp"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="passwordInput" className="form-label">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                id="passwordInput"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="form-check mt-2">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="showPasswordCheck"
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                />
                                <label className="form-check-label" htmlFor="showPasswordCheck">Show Password</label>
                            </div>
                        </div>
                        <div className="d-grid gap-2 mt-4">
                            <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AdminLogin; 