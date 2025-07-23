import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Pencil, Trash2 } from 'lucide-react';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchText, setSearchText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [showTodayOnly, setShowTodayOnly] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('/api/store/get-all-bookings', {
          withCredentials: true,
        });
        setBookings(res.data.bookings || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'success';
      case 'cancelled': return 'danger';
      case 'wait list': return 'warning';
      case 'not confirmed': return 'secondary';
      case 'deleted': return 'dark';
      default: return 'dark';
    }
  };

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    return `${((h % 12) || 12)}:${minute} ${suffix}`;
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const sortedBookings = [...bookings].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (!key) return 0;

    const aValue = a[key];
    const bValue = b[key];

    if (key === 'date') {
      return direction === 'asc' ? new Date(aValue) - new Date(bValue) : new Date(bValue) - new Date(aValue);
    }

    const aStr = aValue?.toString().toLowerCase() || '';
    const bStr = bValue?.toString().toLowerCase() || '';

    if (aStr < bStr) return direction === 'asc' ? -1 : 1;
    if (aStr > bStr) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredBookings = sortedBookings.filter((b) => {
    const date = new Date(b.date);
    const matchesSearch = b.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      (Array.isArray(b.tableName) ? b.tableName : [b.tableName]).some(code => code?.toString().includes(searchText));
    const matchesStatus = activeTab === 'All' || b.bookingStatus?.toLowerCase() === activeTab.toLowerCase();
    const inDateRange = (!startDate || date >= new Date(startDate)) &&
      (!endDate || date <= new Date(endDate));
    const isToday = b.date?.split('T')[0] === todayStr;

    return matchesSearch && matchesStatus && inDateRange && (!showTodayOnly || isToday);
  });

  const statusCounts = bookings.reduce((acc, b) => {
    const status = b.bookingStatus || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const allStatuses = ['All', ...new Set(bookings.map(b => b.bookingStatus))];

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark mb-0">Bookings Dashboard</h2>
          <Link to="/store/book-table" className="btn btn-success">+ Add Booking</Link>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-3">
          {allStatuses.map((status) => (
            <li className="nav-item" key={status}>
              <button
                className={`nav-link ${activeTab === status ? 'active' : ''}`}
                onClick={() => setActiveTab(status)}
              >
                <span className={`badge bg-${getStatusColor(status)}`}>{status}</span>{' '}
                <small className="ms-1 text-muted">({status === 'All' ? bookings.length : statusCounts[status] || 0})</small>
              </button>
            </li>
          ))}
        </ul>

        {/* Filters */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search guest or table"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="col-md-3">
            <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="col-md-2 d-flex align-items-center">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="todayFilter"
                checked={showTodayOnly}
                onChange={(e) => setShowTodayOnly(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="todayFilter">
                Today's bookings
              </label>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            {filteredBookings.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover table-bordered mb-0">
                  <thead className="table-dark sticky-top">
                    <tr className="align-middle text-nowrap">
                      <th>#</th>
                      <th role="button" onClick={() => requestSort('firstName')} className="text-decoration-underline text-amber-100" title="Click to sort">
                        First Name {sortConfig.key === 'firstName' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th role="button" onClick={() => requestSort('date')} className="text-decoration-underline text-amber-100" title="Click to sort">
                        Date {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th role="button" onClick={() => requestSort('timeSlot')} className="text-decoration-underline text-amber-100" title="Click to sort">
                        Time {sortConfig.key === 'timeSlot' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th>Table(s)</th>
                      <th>Guests</th>
                      <th>Status</th>
                      {/* <th>Created By</th> */}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking, index) => (
                      <tr key={booking._id} className="align-middle">
                        <td>{index + 1}</td>
                        <td className="fw-semibold">{booking.firstName}</td>
                        <td>{booking.date?.split('T')[0]}</td>
                        <td>{formatTime(booking.timeSlot)}</td>
                        <td>{Array.isArray(booking.tableName) ? booking.tableName.join(', ') : booking.tableName}</td>
                        <td>{booking.CapacityCovers}</td>
                        <td>
                          <span className={`badge bg-${getStatusColor(booking.bookingStatus)}`}>
                            {booking.bookingStatus}
                          </span>
                        </td>
                        {/* <td>{booking.createdBy?.name || '—'}</td> */}
                        <td>
                          <div className="d-flex gap-2">
                            <Link
                              to={`/store/TableBookingForm/${booking._id}?editing=true`}
                              className="btn btn-sm btn-outline-primary"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </Link>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              title="Delete"
                              onClick={async (e) => {
                                e.preventDefault();
                                try {
                                  await fetch(`/api/store/delete-reservation/${booking._id}`, {
                                    method: "PATCH",
                                  });
                                  setBookings(prev => prev.filter(b => b._id !== booking._id));
                                } catch (err) {
                                  console.error("Delete failed", err);
                                }
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-muted p-5">
                <p className="mb-0">No bookings found for the selected filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
