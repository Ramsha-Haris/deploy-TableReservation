// BookingRow.jsx
import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';

// Props:
// - booking: single booking object
// - index: index number in the table
// - formatTime: function to format time from 24hr to AM/PM
// - getStatusColor: function to determine badge color based on status
// - setBookings: state updater to remove a booking after deletion

const BookingRow = ({ booking, index, formatTime, getStatusColor, setBookings }) => {
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      // Send DELETE (actually PATCH in this case) request
      await fetch(`/api/store/delete-reservation/${booking._id}`, { method: 'PATCH' });

      // Remove deleted booking from state
      setBookings(prev => prev.filter(b => b._id !== booking._id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <tr className="align-middle">
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
      <td>
        <div className="d-flex gap-2">
          {/* Edit Button */}
          <Link
            to={`/store/TableBookingForm/${booking._id}?editing=true`}
            className="btn btn-sm btn-outline-primary"
            title="Edit"
          >
            <Pencil size={16} />
          </Link>

          {/* Delete Button */}
          <button
            className="btn btn-sm btn-outline-danger"
            title="Delete"
            onClick={handleDelete}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BookingRow;
