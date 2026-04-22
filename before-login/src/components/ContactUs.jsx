import React from "react";
import "./ContactUs.css";

const handleSubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    subject: form.subject.value,
    message: form.message.value,
    agree: form.querySelector('input[type="checkbox"]').checked
  };

  try {
    const res = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const body = await res.json();
      console.error('Backend error', body);
      alert('Submission failed: ' + (body.error || 'validation error'));
      return;
    }
    alert('Message sent — thanks!');
    form.reset();
  } catch (err) {
    console.error('Network error', err);
    alert('Network error — please try again');
  }
};


const ContactUs = () => {
  return (
    <div className="tm-contact-page">
      {/* Hero / Intro */}
      <section className="tm-contact-hero">
        <span className="tm-contact-pill">Contact Us</span>
        <h1 className="tm-contact-title">We’re here to help</h1>
        <p className="tm-contact-subtitle">
          Need help with online consultations, appointments, doctor registration,
          or technical support? Reach out and we’ll make your experience easier
          and faster.
        </p>
      </section>

      {/* Main Content */}
      <section className="tm-contact-layout">
        {/* Left: Information */}
        <div className="tm-contact-info">
          <div className="tm-contact-block">
            <h2 className="tm-block-title">Get in Touch</h2>
            <p className="tm-block-text">
              Our support team is available to guide you and make your experience
              smoother, more accessible, and convenient.
            </p>

            <div className="tm-contact-details">
              <div className="tm-contact-detail-row">
                <span className="tm-contact-label">Email</span>
                <a href="mailto:support@telemed.com" className="tm-contact-value">
                  support@telemed.com
                </a>
              </div>
              <div className="tm-contact-detail-row">
                <span className="tm-contact-label">Phone</span>
                <a href="tel:+919876543210" className="tm-contact-value">
                  +91 98765 43210
                </a>
              </div>
            </div>
          </div>

          <div className="tm-contact-block tm-contact-block-inline">
            <div>
              <h3 className="tm-block-subtitle">Support Hours</h3>
              <p className="tm-block-text">
                Monday – Saturday <br />
                10:00 AM to 7:00 PM
              </p>
              <p className="tm-block-caption">
                We aim to respond to all messages within 24 hours.
              </p>
            </div>

            <div>
              <h3 className="tm-block-subtitle">Office / Institution</h3>
              <p className="tm-block-text">
                TeleMed Healthcare Platform <br />
                [City, State] <br />
                [Country]
              </p>
            </div>
          </div>

          <div className="tm-contact-block">
            <h2 className="tm-block-title">We Value Your Feedback</h2>
            <p className="tm-block-text">
              Your suggestions help us improve our telemedicine services and offer a
              better health experience for everyone.
            </p>

            <div className="tm-contact-chips">
              <span className="tm-chip">Your health matters to us.</span>
              <span className="tm-chip">We’re always here to help.</span>
              <span className="tm-chip">Reach out anytime!</span>
              <span className="tm-chip">Connecting care with convenience.</span>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="tm-contact-form-card">
          <h2 className="tm-form-title">Send us a Message</h2>
          <p className="tm-form-subtitle">
            Have a question or suggestion? Fill out the form and we’ll get back
            to you as soon as possible.
          </p>

          <form className="tm-contact-form" onSubmit={handleSubmit} >
            <div className="tm-form-grid">
              <div className="tm-form-field">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="tm-form-field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="tm-form-grid">
              <div className="tm-form-field">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="tm-form-field">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  type="text"
                  placeholder="How can we help?"
                />
              </div>
            </div>

            <div className="tm-form-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows="5"
                placeholder="Type your message here..."
              />
            </div>

            <div className="tm-form-footer">
              <label className="tm-checkbox">
                <input type="checkbox" />
                <span>
                  I agree to be contacted by TeleMed regarding my enquiry.
                </span>
              </label>

              <button type="submit" className="tm-primary-button">
                Submit Message
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
