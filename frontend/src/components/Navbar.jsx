import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true); // true = collapsed

  const isActive = (path) =>
    location.pathname.startsWith(path) ? 'active text-white bg-primary' : 'text-light';

  const handleLogout = async () => {
    await logout();
    setIsNavCollapsed(true); // collapse after logout
    navigate('/login');
  };

  const handleNavClick = () => {
    setIsNavCollapsed(true); // collapse after clicking a nav link
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/" onClick={handleNavClick}>
          MyBookingApp
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
          aria-controls="mainNavbar"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`} id="mainNavbar">
          <ul className="navbar-nav ms-auto gap-2 align-items-lg-center">
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <span className="nav-link text-info">Welcome, {user?.firstName}</span>
                </li>
                <li className="nav-item">
                  <Link to="/store/bookings" className={`nav-link ${isActive('/store/bookings')}`} onClick={handleNavClick}>
                    Bookings
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/store/book-table" className={`nav-link ${isActive('/store/book-table')}`} onClick={handleNavClick}>
                    Book Table
                  </Link>
                </li>
              </>
            )}

            {isLoggedIn && user?.userType === 'host' && (
              <>
                <li className="nav-item">
                  <Link to="/host/add-table" className={`nav-link ${isActive('/host/add-table')}`} onClick={handleNavClick}>
                    Table Setup
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/host/host-table-list" className={`nav-link ${isActive('/host/host-table-list')}`} onClick={handleNavClick}>
                    Host Tables
                  </Link>
                </li>
              </>
            )}

            {isLoggedIn && (
              <li className="nav-item">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="nav-link text-white bg-danger rounded px-3 py-1 ms-lg-2 mt-2 mt-lg-0"
                  style={{ border: '1px solid #dc3545' }}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
