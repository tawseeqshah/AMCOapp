// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import UserLogin from './components/UserLogin';
import Layout from './components/Layout';
import Home from './pages/HomePage';
import Proforma from './pages/ProformaPage';
import Punch from './pages/LeadsPage';
import VehicleSearch from './pages/VehicleSearchPage';
import './index.css';

// Create a simple theme context
type ThemeType = 'light' | 'dark';

export const ThemeContext = React.createContext<{
  theme: ThemeType;
  toggle: () => void;
}>({
  theme: 'light',
  toggle: () => {},
});

// Create user context
export const UserContext = React.createContext<{
  userName: string;
  updateUserName: (name: string) => void;
}>({
  userName: '',
  updateUserName: () => {},
});

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeType>(
    localStorage.getItem('theme') as ThemeType || 'light'
  );
  const [showSplash, setShowSplash] = useState(true);
  const [userName, setUserName] = useState<string>(
    localStorage.getItem('userName') || ''
  );
  const [isAuthenticated, setIsAuthenticated] = useState(!!userName);
  
  const toggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const updateUserName = (name: string) => {
    setUserName(name);
    localStorage.setItem('userName', name);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!isAuthenticated) {
    return <UserLogin onLogin={updateUserName} />;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <UserContext.Provider value={{ userName, updateUserName }}>
        <div className="app-container">
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/proforma" element={<Proforma />} />
              <Route path="/punch" element={<Punch />} />
              <Route path="/vehicle-search" element={<VehicleSearch />} />
            </Routes>
          </Layout>
        </div>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;