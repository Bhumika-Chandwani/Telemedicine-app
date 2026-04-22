import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Calendar, Shield, Clock, Heart, Users, Stethoscope, Pill, Activity, FileText, MessageCircle, Phone } from 'lucide-react';

const Services = () => {
  const navigate = useNavigate();

  const mainServices = [
    {
      icon: Video,
      title: 'Video Consultations',
      description: 'Connect with certified doctors through secure HD video calls from the comfort of your home.',
      features: ['HD Video Quality', 'Screen Sharing', 'Chat Support', 'Recording Available']
    },
    {
      icon: Calendar,
      title: 'Easy Appointment Scheduling',
      description: 'Book appointments instantly with our user-friendly scheduling system.',
      features: ['Instant Booking', 'Calendar Integration', 'Reminder Notifications', 'Flexible Rescheduling']
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'HIPAA-compliant platform ensuring your medical data stays confidential and secure.',
      features: ['End-to-End Encryption', 'HIPAA Compliant', 'Secure Storage', 'Privacy First']
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Access healthcare professionals round the clock for urgent medical needs.',
      features: ['24/7 Support', 'Emergency Care', 'Quick Response', 'No Wait Time']
    },
    {
      icon: Heart,
      title: 'Prescription Services',
      description: 'Get digital prescriptions sent directly to your preferred pharmacy.',
      features: ['Digital Prescriptions', 'Pharmacy Integration', 'Refill Reminders', 'Med Tracking']
    },
    {
      icon: Users,
      title: 'Specialist Network',
      description: 'Access to a wide network of specialists across various medical fields.',
      features: ['Multi-Specialty', 'Board Certified', 'Expert Consultations', 'Second Opinions']
    }
  ];

  const specialties = [
    { icon: Stethoscope, name: 'Primary Care', color: '#14b8a6' },
    { icon: Activity, name: 'Mental Health', color: '#8b5cf6' },
    { icon: Pill, name: 'Dermatology', color: '#f59e0b' },
    { icon: Heart, name: 'Cardiology', color: '#ef4444' },
    { icon: Users, name: 'Pediatrics', color: '#3b82f6' },
    { icon: FileText, name: 'General Medicine', color: '#10b981' },
    { icon: MessageCircle, name: 'Nutrition', color: '#ec4899' },
    { icon: Phone, name: 'Urgent Care', color: '#f97316' }
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: '#2c3e50' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
        padding: '100px 50px',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          border: '2px dashed rgba(255,255,255,0.2)',
          borderRadius: '50%',
          right: '-100px',
          top: '-100px'
        }} />
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '30px',
          left: '50px',
          bottom: '50px',
          transform: 'rotate(45deg)'
        }} />
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '52px', marginBottom: '20px', fontWeight: 'bold' }}>
            Our Healthcare Services
          </h1>
          <p style={{ fontSize: '20px', opacity: 0.9, lineHeight: '1.6' }}>
            Comprehensive telemedicine solutions designed to provide you with quality healthcare whenever and wherever you need it.
          </p>
        </div>
      </section>

      {/* Main Services Section */}
      <section style={{ padding: '80px 50px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ color: '#14b8a6', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
              WHAT WE OFFER
            </div>
            <h2 style={{ fontSize: '42px', color: '#1a252f', marginBottom: '15px' }}>
              Comprehensive Medical Services
            </h2>
            <p style={{ fontSize: '18px', color: '#5a6c7d', maxWidth: '700px', margin: '0 auto' }}>
              From routine checkups to specialist consultations, we provide a full range of healthcare services through our secure telemedicine platform.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '40px'
          }}>
            {mainServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} style={{
                  background: '#f8fffe',
                  padding: '40px',
                  borderRadius: '20px',
                  transition: 'all 0.3s',
                  border: '2px solid transparent',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(20, 184, 166, 0.15)';
                  e.currentTarget.style.borderColor = '#14b8a6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'transparent';
                }}>
                  <div style={{
                    width: '70px',
                    height: '70px',
                    background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '25px'
                  }}>
                    <Icon size={35} color="white" />
                  </div>
                  <h3 style={{ fontSize: '24px', marginBottom: '15px', color: '#1a252f' }}>
                    {service.title}
                  </h3>
                  <p style={{ color: '#5a6c7d', lineHeight: '1.7', marginBottom: '20px' }}>
                    {service.description}
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {service.features.map((feature, idx) => (
                      <li key={idx} style={{
                        padding: '8px 0',
                        color: '#5a6c7d',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          background: '#14b8a6',
                          borderRadius: '50%',
                          display: 'inline-block'
                        }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section style={{
        padding: '80px 50px',
        background: 'linear-gradient(135deg, #f0fffe 0%, #ffffff 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ color: '#14b8a6', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
              MEDICAL SPECIALTIES
            </div>
            <h2 style={{ fontSize: '42px', color: '#1a252f', marginBottom: '15px' }}>
              Connect With Specialists
            </h2>
            <p style={{ fontSize: '18px', color: '#5a6c7d', maxWidth: '700px', margin: '0 auto' }}>
              Our network includes board-certified specialists across various medical fields ready to provide expert care.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            {specialties.map((specialty, index) => {
              const Icon = specialty.icon;
              return (
                <div key={index} style={{
                  background: 'white',
                  padding: '40px 30px',
                  borderRadius: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  border: '2px solid #f0f0f0'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.borderColor = specialty.color;
                  e.currentTarget.style.boxShadow = `0 10px 30px ${specialty.color}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#f0f0f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: `${specialty.color}15`,
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <Icon size={30} color={specialty.color} />
                  </div>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1a252f' }}>
                    {specialty.name}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
        padding: '80px 50px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h2 style={{ fontSize: '42px', marginBottom: '20px' }}>
          Ready to Get Started?
        </h2>
        <p style={{ fontSize: '18px', marginBottom: '40px', opacity: 0.9, maxWidth: '600px', margin: '0 auto 40px' }}>
          Book your first consultation today and experience healthcare reimagined through our comprehensive telemedicine platform.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/Signup')} style={{
            background: 'white',
            color: '#14b8a6',
            padding: '15px 40px',
            borderRadius: '30px',
            border: 'none',
            fontWeight: '600',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}>
            Book Appointment Now
          </button>
          <button onClick={() => navigate('/ContactUs')} style={{
            background: 'transparent',
            color: 'white',
            padding: '15px 40px',
            border: '2px solid white',
            borderRadius: '30px',
            fontWeight: '600',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'white';
            e.target.style.color = '#14b8a6';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = 'white';
          }}>
            <Phone size={18} />
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
};

export default Services;