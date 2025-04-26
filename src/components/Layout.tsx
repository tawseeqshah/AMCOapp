// src/components/Layout.tsx
import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext, UserContext } from '../App';
import { IoHome, IoDocument, IoPersonAdd, IoMoon, IoSunny, IoLogOut } from 'react-icons/io5';

type Props = { children: React.ReactNode };

const Layout: React.FC<Props> = ({ children }) => {
  const { theme, toggle } = useContext(ThemeContext);
  const { updateUserName } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const isFormPage = location.pathname === '/proforma' || location.pathname === '/punch';

  const navItems = [
    { path: '/', label: 'Home', icon: <IoHome size={24} /> },
    { path: '/proforma', label: 'Proforma', icon: <IoDocument size={24} /> },
    { path: '/punch', label: 'Leads', icon: <IoPersonAdd size={24} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userName');
    updateUserName('');
    navigate('/');
    window.location.reload(); // Force reload to trigger login screen
  };

  return (
    <div className="app-container">
      <header className="header">
        <button 
          onClick={() => navigate('/')}
          className="home-button"
          aria-label="Go to home"
          title="Home"
        >
          <IoHome size={22} />
        </button>
        <div className="header-content">
          <h1>AMCO Automobiles PVT. LTD</h1>
        </div>
        <div className="header-actions">
          <button 
            onClick={toggle} 
            className="theme-toggle-button"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <IoMoon size={22} /> : <IoSunny size={22} />}
          </button>
          <button 
            onClick={() => setShowLogoutConfirm(true)} 
            className="theme-toggle-button"
            aria-label="Logout"
            title="Logout"
          >
            <IoLogOut size={22} />
          </button>
        </div>
      </header>

      {showLogoutConfirm && (
        <div className="logout-confirm-overlay">
          <div className="logout-confirm-box">
            <p>Are you sure you want to logout?</p>
            <div className="logout-confirm-actions">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="logout-cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="logout-confirm-btn"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <main className={`main-content ${isFormPage ? 'fullscreen' : ''}`}>
        {children}
      </main>

      {!isFormPage && (
        <nav className="bottom-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
};

export default Layout;