import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate(); // For navigation after successful registration

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    if (!role) {
      alert('Please select a role before registering.');
      return;
    }

    const response = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store the role in localStorage after registration
      localStorage.setItem('userRole', role); 
      alert('Registration successful! You can now log in.');
      navigate('/login'); // Navigate to login page after successful registration
    } else {
      alert(data.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <label htmlFor="role">Role</label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required 
        >
          <option value="">Select role</option>
          <option value="superadmin">Super Admin</option>
          <option value="assetmanager">Asset Manager</option>
          <option value="employee">Employee</option>
        </select>

        <button type="submit">Register</button>
      </form>
      <p className="login-prompt">
        Already have an account? <Link to="/login">Login here</Link> 
      </p>
    </div>
  );
};

export default Register;
