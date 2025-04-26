import React, { useEffect } from 'react';

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <h1 className="splash-title">AMCO Automobiles</h1>
        <p className="splash-subtitle">PVT. LTD</p>
        <p className="splash-dealer">Authorised Dealer of Ashok Leyland</p>
        <div className="splash-bar"></div>
      </div>
    </div>
  );
};

export default SplashScreen; 