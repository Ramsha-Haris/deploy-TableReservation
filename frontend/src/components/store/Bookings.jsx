// Bookings.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderActions from './BookingSubComponents/BookingHeaderActions';
import StatusTabs from './BookingSubComponents/BookingStatusTabs';
import Filters from './BookingSubComponents/BookingFilters';
import BookingsTable from './BookingSubComponents/BookingsTable';
import EmptyState from './BookingSubComponents/BookingEmptyState';

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
    const aVal = a[key], bVal = b[key];
    if (key === 'date') return direction === 'asc' ? new Date(aVal) - new Date(bVal) : new Date(bVal) - new Date(aVal);
    const aStr = aVal?.toString().toLowerCase() || '', bStr = bVal?.toString().toLowerCase() || '';
    if (aStr < bStr) return direction === 'asc' ? -1 : 1;
    if (aStr > bStr) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredBookings = sortedBookings.filter(b => {
    const date = new Date(b.date);
    const matchSearch = b.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      (Array.isArray(b.tableName) ? b.tableName : [b.tableName]).some(t => t?.toString().includes(searchText));
    const matchStatus = activeTab === 'All' || b.bookingStatus?.toLowerCase() === activeTab.toLowerCase();
    const inRange = (!startDate || date >= new Date(startDate)) && (!endDate || date <= new Date(endDate));
    const isToday = b.date?.split('T')[0] === todayStr;
    return matchSearch && matchStatus && inRange && (!showTodayOnly || isToday);
  });

  const statusCounts = bookings.reduce((acc, b) => {
    const s = b.bookingStatus || 'Unknown';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const allStatuses = ['All', ...new Set(bookings.map(b => b.bookingStatus))];

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container">
        <HeaderActions />
        <StatusTabs
          allStatuses={allStatuses}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          getStatusColor={getStatusColor}
          bookings={bookings}
          statusCounts={statusCounts}
        />
        <Filters
          searchText={searchText}
          setSearchText={setSearchText}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          showTodayOnly={showTodayOnly}
          setShowTodayOnly={setShowTodayOnly}
        />
        {filteredBookings.length > 0 ? (
          <BookingsTable
            bookings={filteredBookings}
            formatTime={formatTime}
            getStatusColor={getStatusColor}
            requestSort={requestSort}
            sortConfig={sortConfig}
            setBookings={setBookings}
          />
        ) : <EmptyState />}
      </div>
    </div>
  );
};

export default Bookings;
