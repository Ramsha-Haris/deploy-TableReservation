// BookingsTable.jsx
import BookingRow from './BookingRow';

const BookingsTable = ({ bookings, formatTime, getStatusColor, requestSort, sortConfig, setBookings }) => (
  <div className="card shadow-sm border-0">
    <div className="card-body p-0">
      <div className="table-responsive">
        <table className="table table-hover table-bordered mb-0">
          <thead className="table-dark sticky-top">
            <tr className="align-middle text-nowrap">
              <th>#</th>
              <th role="button" onClick={() => requestSort('firstName')} className="text-decoration-underline" title="Click to sort">
                First Name {sortConfig.key === 'firstName' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th role="button" onClick={() => requestSort('date')} className="text-decoration-underline" title="Click to sort">
                Date {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th role="button" onClick={() => requestSort('timeSlot')} className="text-decoration-underline" title="Click to sort">
                Time {sortConfig.key === 'timeSlot' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th>Table(s)</th>
              <th>Guests</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <BookingRow
                key={booking._id}
                booking={booking}
                index={index}
                formatTime={formatTime}
                getStatusColor={getStatusColor}
                setBookings={setBookings}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default BookingsTable;
