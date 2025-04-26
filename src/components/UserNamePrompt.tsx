import React, { useState } from 'react';
import { IoArrowForward } from 'react-icons/io5';

interface UserNamePromptProps {
  onSave: (name: string) => void;
}

const UserNamePrompt: React.FC<UserNamePromptProps> = ({ onSave }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim().length < 2) {
      setError('Please enter a valid name');
      return;
    }
    
    onSave(name.trim());
  };

  return (
    <div className="user-prompt-overlay">
      <div className="user-prompt-container">
        <h2 className="user-prompt-title">Welcome to AMCO Automobiles</h2>
        <p className="user-prompt-text">Please enter your name to continue</p>
        
        <form onSubmit={handleSubmit} className="user-prompt-form">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            placeholder="Your name"
            className="user-prompt-input"
            autoFocus
          />
          {error && <p className="user-prompt-error">{error}</p>}
          
          <button 
            type="submit" 
            className="user-prompt-button"
            disabled={!name.trim()}
          >
            Continue <IoArrowForward size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserNamePrompt; 