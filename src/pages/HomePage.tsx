import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoDocument, IoPersonAdd, IoCarSport } from 'react-icons/io5';
import { UserContext } from '../App';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { userName } = useContext(UserContext);

  const greeting = useMemo(() => {
    const hours = new Date().getHours();
    
    if (hours < 12) {
      return 'Good Morning';
    } else if (hours < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  }, []);

  return (
    <div className="home-container">
      <h1 className="home-title">
        <span className="greeting">{greeting}, {userName}</span>
      </h1>
      
      <div className="cards-container">
        <div 
          className="card"
          onClick={() => navigate('/proforma')}
        >
          <div className="card-stripe proforma-stripe"></div>
          <div className="card-content">
            <div className="card-icon proforma-icon">
              <IoDocument size={28} />
            </div>
            <div className="card-text">
              <h3>Get Proforma</h3>
              <p>Request proforma documents</p>
            </div>
          </div>
        </div>
        
        <div
          className="card"
          onClick={() => navigate('/punch')}
        >
          <div className="card-stripe leads-stripe"></div>
          <div className="card-content">
            <div className="card-icon leads-icon">
              <IoPersonAdd size={28} />
            </div>
            <div className="card-text">
              <h3>Punch Leads</h3>
              <p>Add new customer leads</p>
            </div>
          </div>
        </div>
        
        <div
          className="card"
          onClick={() => navigate('/vehicle-search')}
        >
          <div className="card-stripe vehicle-stripe"></div>
          <div className="card-content">
            <div className="card-icon vehicle-icon">
              <IoCarSport size={28} />
            </div>
            <div className="card-text">
              <h3>Vehicle Information</h3>
              <p>Search vehicle details by CBN or name</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;