import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateTable = () => {
  const [formData, setFormData] = useState({
    tableCode: '',
    tableCapacity: '',
    location: '',
    branch: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/host/add-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          tableCode: Number(formData.tableCode),
          tableCapacity: Number(formData.tableCapacity),
        }),
      });

      if (res.ok) {
        navigate('/host/host-table-list');
      } else {
        setMessage('Error creating table.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Server error.');
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="card mx-auto shadow-lg" style={{ maxWidth: '600px' }}>
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Create Table</h2>

            {message && (
              <div className="alert alert-warning text-center py-2" role="alert">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="tableCode" className="form-label">
                  Table Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="tableCode"
                  name="tableCode"
                  value={formData.tableCode}
                  onChange={handleChange}
                  required
                  placeholder="Enter Table Code"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="tableCapacity" className="form-label">
                  Table Capacity
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="tableCapacity"
                  name="tableCapacity"
                  value={formData.tableCapacity}
                  onChange={handleChange}
                  required
                  placeholder="Enter Capacity"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="location" className="form-label">
                  Location
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Enter Location"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="branch" className="form-label">
                  Select Branch
                </label>
                <select
                  className="form-select"
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Branch --</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                </select>
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-primary px-4">
                  Create Table
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTable;
