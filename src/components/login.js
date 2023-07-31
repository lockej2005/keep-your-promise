import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', {
        username,
        password
      }, { withCredentials: true });

      if(response.status === 200) {
        localStorage.setItem('username', username);
        setUsername('');
        setPassword('');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error during login:', error.response.data.error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
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
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </div>
      <button onClick={handleLogin}>Log In</button>


      <Link to="/signup">
        <button>Sign Up</button>
      </Link>
    </div>
  );
};

export default Login;
