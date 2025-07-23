const BookingFilters = ({ searchText, setSearchText, startDate, setStartDate, endDate, setEndDate, showTodayOnly, setShowTodayOnly }) => (
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
);

export default BookingFilters;