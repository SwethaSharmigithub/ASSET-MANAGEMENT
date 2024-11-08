import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Register from './Components/Register'; 
import Login from './Components/Login'; 
import Admindashboard from './Admin/Admindashboard'

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />  
        <Route path="/login" element={<Login />} /> 
        <Route path="/superadmin-dashboard" element={<Admindashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
