import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SelectTable from './TableBookingSubComponents/SelectTable';
import GuestDetailsInput from './TableBookingSubComponents/GuestDetailsinput';
import { useAuth } from 'context/AuthContext';



const reservationTags = ['VIP', 'Regular', 'Family', 'Party'];

const TableBookingForm = ({ editing = false, booking = {} }) => {
  const { user } = useAuth();
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({
    bookingNumber: booking.bookingNumber || '',
    id: booking._id || '',
    firstName: booking.firstName || '',
    lastName: booking.lastName || '',
    guestContactDetails: booking.guestContactDetails || '',
    CapacityCovers: booking.CapacityCovers || '',
    date: booking.date ? booking.date.split('T')[0] : '',
    timeSlot: booking.timeSlot || '',
    bookingDuration: booking.bookingDuration || '',
    tableName: booking.tableName || [],
    bookingType: booking.bookingType || '',
    bookingNotes: booking.bookingNotes || '',
    reservationTag: booking.reservationTag || [],
    bookingStatus: booking.bookingStatus || 'Not Confirmed'
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const debounceTimeout = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await axios.get('/api/host/book-table-data', {
          withCredentials: true
        });
        setTables(res.data.tables || []);
      } catch (error) {
        console.error('Error fetching tables:', error);
        toast.error('Failed to load tables');
      }
    };
    fetchTables();
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!form.date || !form.timeSlot) return;
      try {
        const res = await axios.get(`/api/store/check-table-availability`, {
          params: { date: form.date, timeSlot: form.timeSlot }
        });
        const booked = res.data.bookedTableCodes || [];
        console.log('Booked tables:', booked); // Add this

        // Update table availability based on booked list
        setTables((prev) =>
          prev.map((t) => ({
            ...t,
            isAvailable: !booked.includes(t.tableCode),
          }))
        );
      } catch (err) {
        console.error('Availability error:', err);
      }
    };
    fetchAvailability();
  }, [form.date, form.timeSlot]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'reservationTag') {
      const updated = checked
        ? [...form.reservationTag, value]
        : form.reservationTag.filter((v) => v !== value);
      setForm({ ...form, reservationTag: updated });
    } else if (type === 'radio') {
      setForm({ ...form, [name]: value });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const fetchSuggestions = (value) => {
    setForm((prev) => ({ ...prev, firstName: value }));
    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      try {
        const res = await axios.get(`/api/store/firstname-suggestions?q=${encodeURIComponent(value)}`);
        const suggestionsData = Array.isArray(res.data) ? res.data : [];
        setSuggestions(suggestionsData);
        setShowSuggestions(suggestionsData.length > 0);
      } catch (err) {
        console.error('Suggestion error:', err);
      }
    }, 300);
  };

  const selectSuggestion = (selected) => {
    setForm((prev) => ({
      ...prev,
      firstName: selected.firstName,
      lastName: selected.secondName || '',
      guestContactDetails: selected.contact || ''
    }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      id: form.id || booking._id,
      ...(editing
        ? { editedBy: user?.id }
        : { createdBy: user?.id }),
    };



    const url = editing
      ? '/api/store/TableBookingForm'
      : '/api/store/create-booking';

    try {
      const res = await axios.post(url, data, {
        withCredentials: true
      });

      if (res.status === 200 || res.status === 201) {
        toast.success(editing ? 'Booking updated!' : 'Booking successful!');
        setTimeout(() => navigate('/store/bookings'), 1500);
      } else {
        toast.error('Error saving booking');
      }
    } catch (error) {
      toast.error('Submission failed! Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow border-0">
        <div className="card-header bg-primary text-white fw-bold">
          {editing ? 'Edit Table Booking' : 'Table Reservation'}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="bookingNumber" value={form.bookingNumber} />

            <div className="row g-4">
              <div className="col-md-4">
                <GuestDetailsInput
                  form={form}
                  onFormChange={handleChange}
                  suggestions={suggestions}
                  showSuggestions={showSuggestions}
                  highlightIndex={highlightIndex}
                  fetchSuggestions={fetchSuggestions}
                  selectSuggestion={selectSuggestion}
                  setHighlightIndex={setHighlightIndex}
                />
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="form-control"
                    min={new Date().toISOString().split('T')[0]} // 👈 disables past dates
                  />

                </div>





                {/* //************************************ */}


                <div className="mb-3">
                  <label className="form-label">Time Slot</label>
                  <select
                    name="timeSlot"
                    value={form.timeSlot}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select Time</option>
                    {generateTimeSlots('10:00', '22:00', 30).map((t, i) => (
                      <option key={i} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                {/* =========================== */}

                {/* <div className="mb-3">
                  <label className="form-label">Guests</label>
                  <input
                    type="number"
                    name="CapacityCovers"
                    value={form.CapacityCovers}
                    onChange={handleChange}
                    className="form-control"
                    min="1"
                    max="20"
                  />
                </div> */}

                <div className="mb-3">
                  <label className="form-label d-block">Booking Type</label>
                  {['Walk-in', 'On Call'].map((type, i) => (
                    <div key={i} className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="bookingType"
                        value={type}
                        checked={form.bookingType === type}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">{type}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-md-4">
                {/* <div className="mb-3">
                  <label className="form-label">Time Slot</label>
                  <select
                    name="timeSlot"
                    value={form.timeSlot}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select Time</option>
                    {generateTimeSlots('10:00', '22:00', 30).map((t, i) => (
                      <option key={i} value={t}>{t}</option>
                    ))}
                  </select>
                </div> */}
                <div className="mb-3">
                  <label className="form-label">Guests</label>
                  <input
                    type="number"
                    name="CapacityCovers"
                    value={form.CapacityCovers}
                    onChange={handleChange}
                    className="form-control"
                    min="1"
                    max="20"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Duration (Hours)</label>
                  <input
                    type="number"
                    name="bookingDuration"
                    value={form.bookingDuration}
                    onChange={handleChange}
                    className="form-control"
                    min="1"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Booking Status</label>
                  <select
                    name="bookingStatus"
                    value={form.bookingStatus}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Not Confirmed">Not Confirmed</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Wait List">Wait List</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <SelectTable
                tables={tables}
                selectedTables={form.tableName}
                guestCount={parseInt(form.CapacityCovers) || 0}
                onChange={(updated) => setForm({ ...form, tableName: updated })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Reservation Tags</label>
              <div className="d-flex flex-wrap gap-3">
                {reservationTags.map((tag, i) => (
                  <div key={i} className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="reservationTag"
                      value={tag}
                      checked={form.reservationTag.includes(tag)}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">{tag}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Reservation Notes</label>
              <textarea
                name="bookingNotes"
                value={form.bookingNotes}
                onChange={handleChange}
                className="form-control"
                rows={3}
              />
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary px-4">
                {editing ? 'Update Table Booking' : 'Book Table'}
              </button>
            </div>
            {editing && (
              <div className="mb-4">
                <label className="form-label">Created By</label>
                <input
                  type="text"
                  className="form-control"
                  value={user?.firstName || 'Unknown'}
                  readOnly
                />
              </div>
            )}

          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default TableBookingForm;

function generateTimeSlots(startTime, endTime, intervalMinutes) {
  const timeSlots = [];
  let currentTime = new Date(`2000-01-01T${startTime}`);
  const endTimeObj = new Date(`2000-01-01T${endTime}`);

  while (currentTime <= endTimeObj) {
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const hours12 = (currentTime.getHours() % 12) || 12;
    const ampm = currentTime.getHours() >= 12 ? 'PM' : 'AM';
    const formattedTime12 = `${hours12}:${minutes} ${ampm}`;
    timeSlots.push(formattedTime12);
    currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
  }

  return timeSlots;
}
