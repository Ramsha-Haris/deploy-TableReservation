// StatusTabs.jsx
const BookingStatusTabs = ({ allStatuses, activeTab, setActiveTab, getStatusColor, bookings, statusCounts }) => (
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
);

export default BookingStatusTabs;