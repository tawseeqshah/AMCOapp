import React, { useState } from 'react';
import { IoArrowForward, IoLockClosed } from 'react-icons/io5';

interface UserLoginProps {
  onLogin: (name: string) => void;
}

// Predefined users and their passwords
const USERS = [
  { id: 1, name: 'Mr. Altaf', password: 'AL56#2' },
  { id: 2, name: 'Mr. Mushtaq', password: 'MU93@7' },
  { id: 3, name: 'Mr. Riyaz', password: 'RI24$8' },
  { id: 4, name: 'Mr. Zaffar', password: 'ZA78%3' },
  { id: 5, name: 'Mr. Zakir', password: 'ZK12*9' },
  { id: 6, name: 'Admin', password: 'AD45&6' },
];

const UserLogin: React.FC<UserLoginProps> = ({ onLogin }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) {
      setError('Please select a user');
      return;
    }

    if (!password) {
      setError('Please enter a password');
      return;
    }
    
    const user = USERS.find(u => u.name === selectedUser);
    
    if (!user || user.password !== password) {
      setError('Password error! Please contact the administrator.');
      return;
    }
    
    onLogin(selectedUser);
  };

  return (
    <div className="user-prompt-overlay">
      <div className="user-prompt-container">
        <h2 className="user-prompt-title">AMCO Automobiles</h2>
        <p className="user-prompt-text">Please login to continue</p>
        
        <form onSubmit={handleSubmit} className="user-prompt-form">
          <div className="input-group">
            <label htmlFor="user-select">Select User</label>
            <select
              id="user-select"
              value={selectedUser}
              onChange={(e) => {
                setSelectedUser(e.target.value);
                setError('');
              }}
              className="user-prompt-select"
            >
              <option value="">-- Select a user --</option>
              {USERS.map(user => (
                <option key={user.id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="input-group">
            <label htmlFor="password-input">Password</label>
            <div className="password-input-container">
              <IoLockClosed className="password-icon" />
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter your password"
                className="user-prompt-input"
              />
            </div>
          </div>
          
          {error && <p className="user-prompt-error">{error}</p>}
          
          <button 
            type="submit" 
            className="user-prompt-button"
            disabled={!selectedUser || !password}
          >
            Login <IoArrowForward size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin; 