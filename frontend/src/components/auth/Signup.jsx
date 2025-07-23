import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@api/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirm_password: '',
    userType: '',
    termsAccepted: false,
  });

  const [errorMessages, setErrorMessages] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessages([]);

    if (formData.password !== formData.confirm_password) {
      return setErrorMessages(['Passwords do not match.']);
    }

    if (!formData.termsAccepted) {
      return setErrorMessages(['You must accept the terms and conditions.']);
    }

    try {
      const { firstname, lastname, email, password, userType } = formData;

      await axios.post('/api/auth/signup', {
        firstname,
        lastname,
        email,
        password,
        confirm_password: formData.confirm_password,
        userType,
        termsAccepted: formData.termsAccepted ? 'on' : '',
      });

      toast.success('Signup successful! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (Array.isArray(errors)) {
        setErrorMessages(errors);
      } else {
        toast.error(err.response?.data?.message || 'Signup failed');
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow p-4 w-100" style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Sign up</h2>

        {errorMessages.length > 0 && (
          <div className="alert alert-danger">
            <ul className="mb-0 ps-3">
              {errorMessages.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your first name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your last name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter password"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="form-control"
              placeholder="Confirm password"
            />
          </div>

          <div className="mb-3">
            <label className="form-label d-block">User Type</label>
            {['user', 'host'].map((type) => (
              <div className="form-check form-check-inline" key={type}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="userType"
                  value={type}
                  checked={formData.userType === type}
                  onChange={handleChange}
                  id={`radio-${type}`}
                />
                <label className="form-check-label" htmlFor={`radio-${type}`}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              </div>
            ))}
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              name="termsAccepted"
              id="terms"
              checked={formData.termsAccepted}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="terms">
              I accept the terms and conditions
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Sign up
          </button>

          <div className="text-center mt-3">
            <span className="text-muted">Already have an account? </span>
            <a href="/login" className="text-decoration-none">Login</a>
          </div>
        </form>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </div>
  );
}
