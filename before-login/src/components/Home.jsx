import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Clock, Shield, Users, Heart, Calendar, Phone, Star } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const services = [
    { icon: Video, title: 'Video Consultations', desc: 'Connect with certified doctors through secure HD video calls from anywhere.' },
    { icon: Calendar, title: 'Easy Scheduling', desc: 'Book appointments instantly and manage your healthcare on your schedule.' },
    { icon: Shield, title: 'Secure & Private', desc: 'HIPAA-compliant platform ensuring your medical data stays confidential.' },
    { icon: Clock, title: '24/7 Availability', desc: 'Access healthcare professionals round the clock for urgent medical needs.' },
    { icon: Heart, title: 'Prescription Services', desc: 'Get digital prescriptions sent directly to your preferred pharmacy.' },
    { icon: Users, title: 'Specialist Network', desc: 'Connect with specialists across various medical fields instantly.' }
  ];

  const specialties = [
    { name: 'Primary Care', icon: '🏥' },
    { name: 'Mental Health', icon: '🧠' },
    { name: 'Dermatology', icon: '💊' },
    { name: 'Pediatrics', icon: '👶' },
    { name: 'Nutrition', icon: '🥗' }
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: '#2c3e50' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #e0f7f4 0%, #f0fffe 50%, #ffffff 100%)',
        padding: '80px 50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          border: '2px dashed rgba(20, 184, 166, 0.2)',
          borderRadius: '50%',
          left: '-50px',
          top: '50px'
        }} />
        <div style={{
          position: 'absolute',
          width: '100px',
          height: '100px',
          background: 'rgba(20, 184, 166, 0.1)',
          borderRadius: '20px',
          right: '100px',
          bottom: '50px',
          transform: 'rotate(45deg)'
        }} />

        {/* Hero Content */}
        <div style={{ maxWidth: '550px', zIndex: 2 }}>
          <h1 style={{
            fontSize: '52px',
            lineHeight: '1.2',
            marginBottom: '20px',
            color: '#1a252f'
          }}>
            We're Committed to Your Health & Wellness
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#5a6c7d',
            marginBottom: '30px',
            lineHeight: '1.6'
          }}>
            Experience quality healthcare from the comfort of your home. Connect with certified medical professionals through secure video consultations.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button onClick={() => navigate('/Signup')} style={{
              background: '#14b8a6',
              color: 'white',
              padding: '15px 35px',
              borderRadius: '30px',
              border: 'none',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#0f766e'}
            onMouseLeave={(e) => e.target.style.background = '#14b8a6'}>
              Book Appointment
            </button>
            <button onClick={() => navigate('/AboutUs')} style={{
              background: 'transparent',
              color: '#14b8a6',
              padding: '15px 35px',
              border: '2px solid #14b8a6',
              borderRadius: '30px',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#14b8a6';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#14b8a6';
            }}>
              Learn More
            </button>
          </div>
        </div>

        {/* Hero Image with Doctor */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            width: '450px',
            height: '450px',
            background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 60px rgba(20, 184, 166, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&h=500&fit=crop" 
              alt="Doctor consultation"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            
            {/* Stat Badge */}
            <div style={{
              position: 'absolute',
              top: '50px',
              right: '-50px',
              background: 'white',
              padding: '15px 25px',
              borderRadius: '15px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#e0f7f4',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={24} color="#14b8a6" />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#5a6c7d' }}>Active Patients</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a252f' }}>50k+</div>
              </div>
            </div>

            {/* Journal Badge */}
            <div style={{
              position: 'absolute',
              top: '120px',
              right: '-80px',
              background: '#1a252f',
              color: 'white',
              padding: '20px',
              borderRadius: '15px',
              textAlign: 'center',
              minWidth: '100px'
            }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold' }}>24/7</div>
              <div style={{ fontSize: '12px', marginTop: '5px' }}>Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 50px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '40px'
          }}>
            {services.slice(0, 3).map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} style={{
                  textAlign: 'center',
                  padding: '40px 30px',
                  background: '#f8fffe',
                  borderRadius: '20px',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(20, 184, 166, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <Icon size={40} color="white" />
                  </div>
                  <h3 style={{ fontSize: '22px', marginBottom: '15px', color: '#1a252f' }}>
                    {service.title}
                  </h3>
                  <p style={{ color: '#5a6c7d', lineHeight: '1.6' }}>
                    {service.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section with Real Image */}
      <section style={{
        padding: '80px 50px',
        background: 'linear-gradient(135deg, #f0fffe 0%, #ffffff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '60px'
      }}>
        <div style={{
          width: '450px',
          height: '500px',
          borderRadius: '30px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(20, 184, 166, 0.2)'
        }}>
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=600&fit=crop" 
            alt="Medical professionals"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '30px',
            background: 'white',
            padding: '15px 20px',
            borderRadius: '15px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '14px', color: '#5a6c7d', marginBottom: '5px' }}>Patient Satisfaction</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Star size={20} fill="#ffc107" color="#ffc107" />
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a252f' }}>4.9/5</span>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '600px' }}>
          <div style={{ color: '#14b8a6', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
            ABOUT TELEMED
          </div>
          <h2 style={{ fontSize: '42px', marginBottom: '20px', color: '#1a252f', lineHeight: '1.2' }}>
            Reliable & High-Quality Healthcare Services
          </h2>
          <p style={{ fontSize: '16px', color: '#5a6c7d', marginBottom: '30px', lineHeight: '1.8' }}>
            Experience healthcare reimagined through secure telemedicine consultations with board-certified physicians. Our platform combines cutting-edge technology with compassionate care to deliver medical services when and where you need them most.
          </p>
          <p style={{ fontSize: '16px', color: '#5a6c7d', marginBottom: '30px', lineHeight: '1.8' }}>
            Whether you need a routine checkup, specialist consultation, or urgent care, our network of healthcare professionals is ready to provide personalized treatment plans tailored to your unique needs.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#e0f7f4',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield size={24} color="#14b8a6" />
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#1a252f' }}>Secure Platform</div>
                <div style={{ fontSize: '14px', color: '#5a6c7d' }}>HIPAA compliant</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#e0f7f4',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Phone size={24} color="#14b8a6" />
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#1a252f' }}>Quick Response</div>
                <div style={{ fontSize: '14px', color: '#5a6c7d' }}>15 min average</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ padding: '80px 50px', background: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ color: '#14b8a6', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
            OUR SERVICES
          </div>
          <h2 style={{ fontSize: '42px', color: '#1a252f' }}>
            Comprehensive Healthcare Solutions
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '30px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {specialties.map((specialty, index) => (
            <div key={index} style={{
              background: index === 0 ? '#14b8a6' : '#f8fffe',
              padding: '40px 20px',
              borderRadius: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              color: index === 0 ? 'white' : '#1a252f'
            }}
            onMouseEnter={(e) => {
              if (index !== 0) {
                e.currentTarget.style.background = '#14b8a6';
                e.currentTarget.style.color = 'white';
              }
              e.currentTarget.style.transform = 'translateY(-10px)';
            }}
            onMouseLeave={(e) => {
              if (index !== 0) {
                e.currentTarget.style.background = '#f8fffe';
                e.currentTarget.style.color = '#1a252f';
              }
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>{specialty.icon}</div>
              <div style={{ fontWeight: '600', fontSize: '16px' }}>{specialty.name}</div>
            </div>
          ))}
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
          Ready to Experience Better Healthcare?
        </h2>
        <p style={{ fontSize: '18px', marginBottom: '40px', opacity: 0.9 }}>
          Join thousands of patients who trust Telemed for their healthcare needs
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button onClick={() => navigate('/Signup')} style={{
            background: 'white',
            color: '#14b8a6',
            padding: '15px 40px',
            borderRadius: '30px',
            border: 'none',
            fontWeight: '600',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
            Get Started Today
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
            gap: '8px'
          }}>
            <Phone size={18} />
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;