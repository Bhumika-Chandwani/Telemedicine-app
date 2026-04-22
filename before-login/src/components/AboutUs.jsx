import React from "react";
import "./AboutUs.css";

// Adjust the paths below based on your project structure
import aboutHero from "../assets/about-hero-telemed.jpg";
import aboutCare from "../assets/about-care-telemed.jpg";
import aboutMission from "../assets/about-mission-telemed.jpg";

const AboutUs = () => {
  return (
    <main className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-text">
          <p className="about-kicker">About Us</p>
          <h1>Welcome to TeleMed</h1>
          <p className="about-subtitle">
            A modern telemedicine platform designed to make healthcare more
            accessible, secure, and convenient for everyone.
          </p>
          <p className="about-body">
            We connect patients with verified medical professionals through
            online video consultations, voice calls, and instant appointment
            booking—right from the comfort of home.
          </p>
        </div>
        <div className="about-hero-image-wrapper">
          <img src={aboutHero} alt="Doctor consulting a patient" />
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-section about-section-alt">
        <div className="about-section-image">
          <img src={aboutMission} alt="Your Health. Our Mission." />
        </div>
        <div className="about-section-content">
          <h2>Our Mission</h2>
          <p>
            Our mission is to make healthcare accessible anytime and anywhere.
            We believe that distance shouldn’t be a barrier to quality medical
            care, and through technology, we bridge the gap between patients and
            healthcare professionals.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="about-section">
        <div className="about-section-content">
          <h2>What We Do</h2>
          <p>
            At TeleMed, users can connect with trusted healthcare professionals
            and receive guidance without the need to travel or wait in long
            queues.
          </p>
          <ul className="about-list">
            <li>Consult doctors through video and voice calls</li>
            <li>Get symptom-based predictions</li>
            <li>Book appointments with verified doctors</li>
            <li>Receive medical guidance and timely healthcare support</li>
          </ul>
          <p>
            Every doctor on our platform goes through a verification process by
            our admin team to ensure authenticity, qualification, and trust.
          </p>
        </div>
        <div className="about-section-image">
          <img src={aboutCare} alt="Doctor caring for a young patient" />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="about-section about-why">
        <h2>Why Choose Us</h2>
        <p className="about-body center">
          We are constantly working towards improving the healthcare experience
          using digital solutions and modern technology.
        </p>
        <div className="about-grid">
          <div className="about-card">
            <h3>Easy Appointments</h3>
            <p>Book consultations in just a few taps with a clean, simple UI.</p>
          </div>
          <div className="about-card">
            <h3>100% Verified Doctors</h3>
            <p>
              All doctors on TeleMed are verified for their credentials and
              experience.
            </p>
          </div>
          <div className="about-card">
            <h3>Secure Consultations</h3>
            <p>
              Encrypted video and voice calls keep your medical data safe and
              private.
            </p>
          </div>
          <div className="about-card">
            <h3>Save Time &amp; Travel</h3>
            <p>
              Get quality medical advice without long commutes or waiting rooms.
            </p>
          </div>
          <div className="about-card">
            <h3>Anywhere Access</h3>
            <p>Reach doctors from any city, town, or village using TeleMed.</p>
          </div>
          <div className="about-card">
            <h3>Symptom Support</h3>
            <p>
              Use symptom checking support to understand your concerns before
              talking to a doctor.
            </p>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="about-section about-vision">
        <h2>Our Vision</h2>
        <p>
          To make digital healthcare accessible across every city, town, and
          village — enabling people to receive trusted medical help instantly
          and securely.
        </p>
      </section>
    </main>
  );
};

export default AboutUs;
