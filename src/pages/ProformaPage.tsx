import React, { useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const ProformaPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Load Fillout script when component mounts
    const script = document.createElement('script');
    script.src = 'https://server.fillout.com/embed/v1/';
    script.async = true;
    document.body.appendChild(script);

    // Clean up script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="form-page">
      <div className="form-header">
        <button 
          onClick={() => navigate('/')}
          className="back-button"
          aria-label="Back to home"
          title="Back to home"
        >
          <IoArrowBack size={24} />
        </button>
        <h1 className="form-title">Get Proforma</h1>
      </div>
      
      <div className="form-container">
        <div style={{position:"fixed", top:"70px", left:"0", right:"0", bottom:"0"}}>
          <div 
            data-fillout-id="et7YhVjmLgus" 
            data-fillout-embed-type="fullscreen" 
            style={{width:"100%", height:"100%"}} 
            data-fillout-inherit-parameters
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProformaPage;