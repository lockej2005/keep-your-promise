import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const history = useHistory();

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/signup', {
        username,
        password,
        email
      });

      console.log(response);  // Log the whole response to see its structure

      // After successful signup, clear input fields and navigate to dashboard
      setUsername('');
      setPassword('');
      setEmail('');
      history.push('/dashboard');
    } catch (error) {
      console.error('Error during signup:', error.response?.data?.error || error);
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
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default Signup;
