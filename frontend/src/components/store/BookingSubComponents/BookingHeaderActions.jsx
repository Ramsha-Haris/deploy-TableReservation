import { Link } from 'react-router-dom';

const BookingHeaderActions = () => (
  <div className="d-flex justify-content-between align-items-center mb-4">
    <h2 className="fw-bold text-dark mb-0">Bookings Dashboard</h2>
    <Link to="/store/book-table" className="btn btn-success">+ Add Booking</Link>
  </div>
);

export default BookingHeaderActions;