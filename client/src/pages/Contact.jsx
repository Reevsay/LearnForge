import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  return (
    <div className="contact-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <div className="logo-icon">🧠</div>
            <span className="logo-text">SmartLearn</span>
          </Link>
          
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/learning-path" className="nav-link">Learning Paths</Link>
            <Link to="/quiz-generator" className="nav-link">Quiz Generator</Link>
            <Link to="/resources" className="nav-link">Resources</Link>
            <Link to="/contact" className="nav-link active">Contact</Link>
            <Link to="/login" className="btn-secondary">Login</Link>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section className="contact-header">
        <div className="container">
          <div className="header-content">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <span>›</span>
              <span>Contact Us</span>
            </div>
            <h1 className="page-title">Get in Touch</h1>
            <p className="page-description">
              Have questions or need support? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-container">
              <div className="form-header">
                <h2>Send us a Message</h2>
                <p>Fill out the form below and we'll get back to you within 24 hours.</p>
              </div>

              {submitted ? (
                <div className="success-message">
                  <div className="success-icon">✅</div>
                  <h3>Message Sent Successfully!</h3>
                  <p>Thank you for contacting us. We'll get back to you soon.</p>
                  <button 
                    className="btn-primary"
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="feature">Feature Request</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className={`btn-primary large ${isSubmitting ? 'loading' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <span className="arrow">→</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="contact-info">
              <div className="info-card">
                <div className="info-icon">📧</div>
                <h3>Email Us</h3>
                <p>Send us an email and we'll respond within 24 hours.</p>
                <a href="mailto:yashveer140ahlawat@gmail.com" className="info-link">
                  yashveer140ahlawat@gmail.com
                </a>
              </div>

              <div className="info-card">
                <div className="info-icon">�</div>
                <h3>Visit Us</h3>
                <p>Come visit our campus for an in-person meeting.</p>
                <address className="info-link">
                  BML Munjal University<br />
                  67th KM Milestone, NH-8<br />
                  Gurgaon, Haryana 122413<br />
                  India
                </address>
              </div>

              <div className="social-section">
                <h3>Follow Us</h3>
                <div className="social-links">
                  <a href="#" className="social-link" title="Facebook">📘</a>
                  <a href="#" className="social-link" title="Twitter">🐦</a>
                  <a href="#" className="social-link" title="LinkedIn">💼</a>
                  <a href="#" className="social-link" title="Instagram">📷</a>
                  <a href="#" className="social-link" title="YouTube">📺</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Find answers to common questions about SmartLearn</p>
          </div>

          <div className="faq-grid">
            <div className="faq-item">
              <h3>How does the AI learning path generation work?</h3>
              <p>Our AI analyzes your learning goals, current knowledge level, and preferences to create a personalized learning journey with recommended resources and milestones.</p>
            </div>

            <div className="faq-item">
              <h3>Can I customize my learning path?</h3>
              <p>Absolutely! You can modify, add, or remove topics from your learning path at any time. The AI will adapt and suggest improvements based on your changes.</p>
            </div>

            <div className="faq-item">
              <h3>Is there a free trial available?</h3>
              <p>Yes, we offer a 14-day free trial with full access to all features. No credit card required to get started.</p>
            </div>

            <div className="faq-item">
              <h3>How accurate are the AI-generated quizzes?</h3>
              <p>Our AI generates quizzes with 95%+ accuracy, validated by educational experts. Questions are tailored to your learning level and progress.</p>
            </div>

            <div className="faq-item">
              <h3>Can I track my learning progress?</h3>
              <p>Yes, our dashboard provides detailed analytics including completion rates, quiz scores, time spent learning, and personalized recommendations.</p>
            </div>

            <div className="faq-item">
              <h3>Is my data secure and private?</h3>
              <p>We use enterprise-grade security with end-to-end encryption. Your learning data is never shared with third parties and remains completely private.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <div className="logo-icon">🧠</div>
                <span className="logo-text">SmartLearn</span>
              </div>
              <p className="footer-description">
                Empowering learners worldwide with AI-driven education technology.
              </p>
            </div>
            
            <div className="footer-section">
              <h4>Platform</h4>
              <Link to="/learning-path">Learning Paths</Link>
              <Link to="/quiz-generator">Quiz Generator</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
            
            <div className="footer-section">
              <h4>Company</h4>
              <Link to="/about">About Us</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/blog">Blog</Link>
            </div>
            
            <div className="footer-section">
              <h4>Support</h4>
              <Link to="/contact">Contact Us</Link>
              <Link to="/help">Help Center</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 SmartLearn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
