import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSignup = async () => {
    try {
      await axios.post('http://localhost:5000/api/signup', {
        username,
        password,
        email
      });
      // After successful signup, clear input fields
      setUsername('');
      setPassword('');
      setEmail('');
    } catch (error) {
      console.error('Error during signup:', error.response.data.error);
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
      </div>
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </div>
      <button onClick={handleSignup}><Link to="/dashboard">Sign Up</Link></button>
    </div>
  );
};

export default Signup;
