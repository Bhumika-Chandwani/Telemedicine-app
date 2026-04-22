import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: '#1a252f',
      color: 'white',
      padding: '60px 50px 30px'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '40px',
        maxWidth: '1200px',
        margin: '0 auto 40px'
      }}>
        {/* Company Info */}
        <div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#14b8a6', marginBottom: '15px' }}>
            Telemed
          </div>
          <p style={{ color: '#8892a0', lineHeight: '1.6', fontSize: '14px' }}>
            Your trusted partner in healthcare. Providing quality telemedicine services to connect you with the best medical professionals.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 style={{ fontSize: '18px', marginBottom: '20px', color: 'white' }}>Quick Links</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/" style={{ color: '#8892a0', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s' }}>Home</Link>
            <Link to="/AboutUs" style={{ color: '#8892a0', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s' }}>About Us</Link>
            <Link to="/ViewUsers" style={{ color: '#8892a0', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s' }}>Services</Link>
            <Link to="/ContactUs" style={{ color: '#8892a0', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s' }}>Contact Us</Link>
            <Link to="/ViewUsers" style={{ color: '#8892a0', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s' }}>FAQ</Link>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 style={{ fontSize: '18px', marginBottom: '20px', color: 'white' }}>Contact Info</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={18} color="#14b8a6" />
              <span style={{ color: '#8892a0', fontSize: '14px' }}>1-800-TELEMED</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={18} color="#14b8a6" />
              <span style={{ color: '#8892a0', fontSize: '14px' }}>support@telemed.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
              <MapPin size={18} color="#14b8a6" style={{ marginTop: '2px' }} />
              <span style={{ color: '#8892a0', fontSize: '14px' }}>Headquarters, Mumbai, India</span>
            </div>
          </div>
        </div>

        {/* Follow Us */}
        <div>
          <h3 style={{ fontSize: '18px', marginBottom: '20px', color: 'white' }}>Follow Us</h3>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '2px solid #14b8a6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}>
              <Facebook size={18} color="#14b8a6" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '2px solid #14b8a6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}>
              <Twitter size={18} color="#14b8a6" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '2px solid #14b8a6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}>
              <Linkedin size={18} color="#14b8a6" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '2px solid #14b8a6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}>
              <Youtube size={18} color="#14b8a6" />
            </a>
          </div>
          <p style={{ color: '#8892a0', fontSize: '14px', lineHeight: '1.6' }}>
            Stay connected with us for health tips and updates.
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '20px',
        textAlign: 'center',
        color: '#8892a0',
        fontSize: '14px'
      }}>
        <p>© 2024 Telemed. All rights reserved. | <Link to="/privacy" style={{ color: '#14b8a6', textDecoration: 'none' }}>Privacy Policy</Link> | <Link to="/terms" style={{ color: '#14b8a6', textDecoration: 'none' }}>Terms of Service</Link></p>
      </div>
    </footer>
  );
};

export default Footer;