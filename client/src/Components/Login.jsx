import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const response = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Check if role exists in the response
      if (data.user && data.user.role) {
        const userRole = data.user.role; // Get role from the response

        // Store user role in localStorage
        localStorage.setItem('userRole', userRole); 

        // Navigate based on user role
        if (userRole === 'superadmin') {
          navigate('/superadmin-dashboard');
        } else if (userRole === 'assetmanager') {
          navigate('/assetmanager-dashboard');
        } else if (userRole === 'employee') {
          navigate('/employee-dashboard');
        } else {
          navigate('/default-dashboard');
        }
      } else {
        alert('User role not found in response.');
      }
    } else {
      alert(data.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
      <p className="register-prompt">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
