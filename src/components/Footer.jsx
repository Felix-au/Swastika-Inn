import React from 'react';
import { Phone, Mail, MapPin, Clock, ExternalLink, Lock } from 'lucide-react';
import { useHotelContent } from '../context/HotelContext';
import { HOTEL_INFO } from '../data/hotelData';

export default function Footer({ onOpenBooking }) {
  const { content } = useHotelContent();
  const hotelInfo = content?.settings || HOTEL_INFO;

  return (
    <footer id="contact" className="site-footer">
      <div className="container">
        {/* Top Callout Box */}
        <div className="footer-callout">
          <div className="callout-text">
            <span className="callout-tag">Direct Hotel Reservations</span>
            <h3 className="callout-title">Experience Warm Ayodhya Hospitality</h3>
            <p className="callout-desc">
              Whether visiting for divine temple pilgrimage, family vacations, or hosting weddings and banquets, our team is ready to welcome you.
            </p>
          </div>
          <div className="callout-buttons">
            <button 
              onClick={() => onOpenBooking({})} 
              className="btn btn-primary"
            >
              <span>Book Your Stay</span>
            </button>
            <a 
              href={`tel:${hotelInfo.phonePrimary}`} 
              className="btn btn-secondary"
            >
              <Phone size={15} />
              <span>Call Reception</span>
            </a>
          </div>
        </div>

        {/* Footer Main Grid */}
        <div className="footer-main-grid">
          {/* Col 1: Brand & Identity */}
          <div className="footer-col brand-col">
            <div className="footer-brand-header">
              <img 
                src="/images/logo-icon.jpeg" 
                alt="Hotel Swastika Inn" 
                className="footer-logo"
                data-cms-target="settings.logo"
              />
              <div>
                <h4 className="footer-brand-title" data-cms-target="settings.hotelName">SWASTIKA INN</h4>
                <span className="footer-brand-subtitle" data-cms-target="settings.subtitle">ROOMS • BANQUET • LAWN</span>
              </div>
            </div>
            <p className="footer-about">
              A premium destination in Ayodhya Dham providing comfortable AC guest suites, modern attached western baths, full banquet facilities, and lush lawns along Muhavara Bypass.
            </p>
            <div className="check-times-box" data-cms-target="settings.timings">
              <div className="check-time-item">
                <Clock size={13} className="time-icon" />
                <span>Check-in: <strong>{hotelInfo.checkInTime}</strong></span>
              </div>
              <div className="check-time-item">
                <Clock size={13} className="time-icon" />
                <span>Check-out: <strong>{hotelInfo.checkOutTime}</strong></span>
              </div>
            </div>
          </div>

          {/* Col 2: Contact Information */}
          <div className="footer-col">
            <h5 className="footer-heading">Contact &amp; Location</h5>
            <div className="footer-contact-list">
              <div className="contact-item" data-cms-target="settings.address">
                <MapPin size={18} className="contact-icon" />
                <div>
                  <strong>Address</strong>
                  <p>{hotelInfo.address}</p>
                </div>
              </div>
              <div className="contact-item" data-cms-target="settings.phone">
                <Phone size={18} className="contact-icon" />
                <div>
                  <strong>Phone Numbers</strong>
                  <p>
                    <a href={`tel:${hotelInfo.phonePrimary}`}>{hotelInfo.phoneDisplayPrimary}</a> <br />
                    <a href={`tel:${hotelInfo.phoneSecondary}`}>{hotelInfo.phoneDisplaySecondary}</a>
                  </p>
                </div>
              </div>
              <div className="contact-item" data-cms-target="settings.email">
                <Mail size={18} className="contact-icon" />
                <div>
                  <strong>Email Inquiry</strong>
                  <p>
                    <a href={`mailto:${hotelInfo.email}`}>{hotelInfo.email}</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="footer-col">
            <h5 className="footer-heading">Accommodations</h5>
            <ul className="footer-links">
              <li><a href="#rooms">Executive King Suite</a></li>
              <li><a href="#rooms">Family Triple Suite (Room 107)</a></li>
              <li><a href="#rooms">Deluxe King / Double</a></li>
              <li><a href="#rooms">Damask Twin Room</a></li>
              <li><a href="#rooms">Standard Queen Room</a></li>
              <li><a href="#banquets">Grand Indoor Banquet Hall</a></li>
              <li><a href="#banquets">Royal Celebration Lawn</a></li>
            </ul>
          </div>

          {/* Col 4: Google Review QR Code */}
          <div className="footer-col qr-col">
            <h5 className="footer-heading">Google Reviews</h5>
            <div className="qr-card">
              <img 
                src="/images/google-qr.jpeg" 
                alt="Swastika Inn Google Review QR Code" 
                className="qr-img"
              />
              <span className="qr-label">Scan to view or leave a Google Review</span>
              <a 
                href={hotelInfo.googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="map-direction-link"
              >
                <span>Open in Google Maps</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p>© 2026 Hotel Swastika Inn &amp; Banquet &amp; Lawn. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <span className="footer-location-tag">
              Near Muhavara Bypass, Ayodhya Dham, U.P. 224123
            </span>
            <a href="/admin" className="staff-portal-link" title="Manager Studio Portal">
              <Lock size={12} /> Staff Studio
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: #1c150e;
          border-top: 1.5px solid rgba(184, 138, 36, 0.35);
          padding: 5rem 0 2rem 0;
          position: relative;
        }
        .footer-callout {
          background: linear-gradient(135deg, #ffffff 0%, #fbf5eb 100%);
          border: 1.5px solid rgba(184, 138, 36, 0.4);
          border-radius: var(--radius-md);
          padding: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 4.5rem;
          box-shadow: 0 14px 40px rgba(25, 15, 5, 0.35);
        }
        .callout-tag {
          color: var(--gold-dark);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.35rem;
          display: block;
        }
        .callout-title {
          font-family: var(--font-serif);
          font-size: 1.85rem;
          color: var(--text-primary);
          margin-bottom: 0.4rem;
        }
        .callout-desc {
          font-size: 0.925rem;
          color: var(--text-secondary);
          max-width: 600px;
        }
        .callout-buttons {
          display: flex;
          gap: 1rem;
          flex-shrink: 0;
        }

        .footer-main-grid {
          display: grid;
          grid-template-columns: 1.3fr 1.2fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 4rem;
        }
        .footer-col {
          display: flex;
          flex-direction: column;
        }
        .footer-brand-header {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin-bottom: 1.25rem;
        }
        .footer-logo {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          border: 1px solid var(--border-gold);
        }
        .footer-brand-title {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          color: #fcf9f2;
          line-height: 1.1;
        }
        .footer-brand-subtitle {
          font-size: 0.65rem;
          color: #f7d479;
          font-weight: 700;
          letter-spacing: 0.12em;
        }
        .footer-about {
          font-size: 0.875rem;
          color: #d1c5b8;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .check-times-box {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(184, 138, 36, 0.25);
          border-radius: var(--radius-sm);
          padding: 0.75rem;
          font-size: 0.8rem;
          color: #ded4c7;
        }
        .check-time-item {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }
        .time-icon {
          color: #f7d479;
        }

        .footer-heading {
          font-size: 0.95rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #f7d479;
          margin-bottom: 1.5rem;
          position: relative;
          padding-bottom: 0.5rem;
        }
        .footer-heading::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 28px;
          height: 2px;
          background: var(--gold-primary);
        }
        .footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.875rem;
        }
        .contact-icon {
          color: #f7d479;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .contact-item strong {
          display: block;
          color: #ffffff;
          font-size: 0.8rem;
          margin-bottom: 2px;
        }
        .contact-item p {
          color: #c9bcaf;
          line-height: 1.4;
        }
        .contact-item a:hover {
          color: #f7d479;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .footer-links a {
          font-size: 0.875rem;
          color: #c9bcaf;
          transition: var(--transition);
        }
        .footer-links a:hover {
          color: #f7d479;
          padding-left: 4px;
        }

        .qr-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(184, 138, 36, 0.25);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.75rem;
        }
        .qr-img {
          width: 110px;
          height: 110px;
          border-radius: 8px;
          background: #ffffff;
          padding: 4px;
        }
        .qr-label {
          font-size: 0.75rem;
          color: #c9bcaf;
          line-height: 1.3;
        }
        .map-direction-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #f7d479;
          margin-top: 0.25rem;
        }
        .map-direction-link:hover {
          text-decoration: underline;
        }

        .footer-bottom-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(184, 138, 36, 0.2);
          font-size: 0.825rem;
          color: #a89a8c;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-bottom-links {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        @media (max-width: 1024px) {
          .footer-main-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2.5rem;
          }
          .footer-callout {
            flex-direction: column;
            text-align: center;
          }
          .callout-desc {
            margin: 0 auto;
          }
        }
        @media (max-width: 600px) {
          .footer-main-grid {
            grid-template-columns: 1fr;
          }
          .callout-buttons {
            flex-direction: column;
            width: 100%;
          }
          .footer-bottom-bar {
            flex-direction: column;
            text-align: center;
          }
        }

        .staff-portal-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: rgba(255, 255, 255, 0.45);
          font-size: 0.75rem;
          text-decoration: none;
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          transition: all 0.2s ease;
          margin-left: 0.75rem;
        }

        .staff-portal-link:hover {
          color: var(--gold-light);
          border-color: rgba(197, 155, 39, 0.5);
          background: rgba(197, 155, 39, 0.1);
        }
      `}</style>
    </footer>
  );
}
