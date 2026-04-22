import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <header style={{
      background: 'linear-gradient(135deg, #e0f7f4 0%, #ffffff 100%)',
      padding: '20px 50px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div 
        onClick={handleHomeClick} 
        style={{ fontSize: '28px', fontWeight: 'bold', color: '#14b8a6', cursor: 'pointer' }}
      >
        Telemed
      </div>

      <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#2c3e50', fontWeight: '500' }}>Home</Link>
        <Link to="/about" style={{ textDecoration: 'none', color: '#2c3e50', fontWeight: '500' }}>About Us</Link>
        <Link to="/services" style={{ textDecoration: 'none', color: '#2c3e50', fontWeight: '500' }}>Services</Link>
        <Link to="/contact" style={{ textDecoration: 'none', color: '#2c3e50', fontWeight: '500' }}>Contact Us</Link>
        <Link to="/viewusers" style={{ textDecoration: 'none', color: '#2c3e50', fontWeight: '500' }}>FAQ</Link>

        <Link 
          to="/login"
          style={{
            textDecoration: 'none',
            color: '#14b8a6',
            fontWeight: '600',
            padding: '10px 25px',
            border: '2px solid #14b8a6',
            borderRadius: '25px',
            transition: 'all 0.3s',
            display: 'inline-block'
          }}
        >
          Login
        </Link>

        <Link 
          to="/signup"
          style={{
            textDecoration: 'none',
            background: '#14b8a6',
            color: 'white',
            padding: '12px 30px',
            borderRadius: '25px',
            fontWeight: '600',
            transition: 'all 0.3s',
            display: 'inline-block'
          }}
        >
          Sign Up
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
