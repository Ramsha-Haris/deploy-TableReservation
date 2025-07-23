import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import TableManagement from './components/host/HostTableList';
import AddTable from './components/host/AddTable';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Bookings from './components/store/Bookings';
import TableBookingForm from './components/store/TableBookingForm';
import EditBooking from './components/store/EditBooking';

const AppContent = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/signup'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/host/host-table-list" element={<TableManagement />} />
        <Route path="/host/add-table" element={<AddTable />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/store/bookings" element={<Bookings />} />
        <Route path="/store/book-table" element={<TableBookingForm />} />
        <Route path="/store/TableBookingForm/:BookingId" element={<EditBooking />} />


      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
