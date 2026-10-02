import React, { useState } from 'react';
import { Calendar, Users, Home, MapPin, Sparkles, MessageCircle, ArrowRight, ShieldCheck, Car, Droplets } from 'lucide-react';
import { useHotelContent } from '../context/HotelContext';
import { HOTEL_INFO, ROOMS_DATA } from '../data/hotelData';

export default function Hero({ onOpenBooking }) {
  const { content } = useHotelContent();
  const heroData = content?.hero || {};
  const hotelInfo = content?.settings || HOTEL_INFO;
  const roomsList = content?.rooms || ROOMS_DATA;

  const [selectedRoom, setSelectedRoom] = useState(roomsList[0]?.id || 'executive-king');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  const handleQuickSearch = (e) => {
    e.preventDefault();
    onOpenBooking({
      roomId: selectedRoom,
      checkIn,
      checkOut,
      guests
    });
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut) - new Date(checkIn);
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };
  const nights = calculateNights();

  return (
    <section id="hero" className="hero-section">
      {/* Background Image with Warm Illuminated Facade */}
      <div className="hero-bg-container">
        <img 
          src={heroData.backgroundImage || "/images/hero-facade-night.jpeg"} 
          alt="Hotel Swastika Inn Ayodhya Grand Illuminated Facade" 
          className="hero-bg-image"
          data-cms-target="hero.image"
        />
        <div className="hero-overlay"></div>
      </div>

      <div className="container hero-content">
        {/* Welcome Tag */}
        <div className="hero-badge animate-fade-in" data-cms-target="hero.badge">
          <Sparkles size={15} className="hero-badge-icon" />
          <span>{heroData.badge || "Devotion • Luxury • Hospitality in Ayodhya Dham"}</span>
        </div>

        {/* Main Title */}
        <h1 className="hero-title animate-slide-up" data-cms-target="hero.title">
          {heroData.titlePrefix || "Experience Serene Comfort &"} <br />
          <span className="gold-text">{heroData.titleSuffix || "Grand Celebrations"}</span> at Swastika Inn
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle" data-cms-target="hero.description">
          {heroData.description || "Located on the Muhavara Bypass, offering elegant air-conditioned suites, modern western bathrooms with hot water geysers, grand banquet halls, and sprawling celebration lawns."}
        </p>

        {/* Hero Quick Action Buttons */}
        <div className="hero-actions">
          <button 
            onClick={() => onOpenBooking({})} 
            className="btn btn-primary hero-btn"
          >
            <Calendar size={18} />
            <span>Book A Stay</span>
          </button>

          <a 
            href={`https://wa.me/${hotelInfo.whatsappNumber}?text=Namaste!%20I%20would%20like%20to%20inquire%20about%20room%20availability%20at%20Hotel%20Swastika%20Inn.`}
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-whatsapp hero-btn"
          >
            <MessageCircle size={18} />
            <span>WhatsApp Booking</span>
          </a>

          <a 
            href="#rooms" 
            className="btn btn-secondary hero-btn"
          >
            <span>Explore Rooms</span>
            <ArrowRight size={16} />
          </a>
        </div>

        {/* Quick Reservation Search Bar */}
        <div className="quick-booking-bar">
          <form onSubmit={handleQuickSearch} className="booking-form-grid">
            <div className="form-field">
              <label className="field-label">
                <Calendar size={14} className="field-icon" />
                <span>Check-in Date</span>
              </label>
              <input 
                type="date" 
                className="field-input" 
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="field-label">
                <Calendar size={14} className="field-icon" />
                <span>Check-out Date</span>
              </label>
              <input 
                type="date" 
                className="field-input" 
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="field-label">
                <Home size={14} className="field-icon" />
                <span>Accommodation</span>
              </label>
              <select 
                className="field-input select-input"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
              >
                {roomsList.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.title}
                  </option>
                ))}
                <option value="banquet-hall">Grand Banquet Hall (Event)</option>
                <option value="celebration-lawn">Celebration Lawn (Outdoor)</option>
              </select>
            </div>

            <div className="form-field">
              <label className="field-label">
                <Users size={14} className="field-icon" />
                <span>Guests</span>
              </label>
              <select 
                className="field-input select-input"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              >
                <option value="1">1 Adult</option>
                <option value="2">2 Adults</option>
                <option value="3">3 Guests (Triple)</option>
                <option value="4+">4+ Guests / Family</option>
                <option value="event">50+ (Event/Banquet)</option>
              </select>
            </div>

            <div className="form-action">
              <button type="submit" className="btn btn-primary check-avail-btn">
                <span>Check Availability</span>
              </button>
            </div>
          </form>

          {/* Interactive Dynamic Summary Strip */}
          <div className="booking-summary-strip">
            <span className="summary-pill">
              <Sparkles size={13} className="pill-sparkle" />
              {nights > 0 ? (
                <span><strong>{nights} Night{nights > 1 ? 's' : ''}</strong> Stay Selected • Best Direct Rate Guaranteed</span>
              ) : (
                <span>Direct Hotel Booking • No Intermediary Commission • Free Darshan Assistance</span>
              )}
            </span>
            <span className="support-phone">
              Call Desk: <strong>{HOTEL_INFO.phoneDisplayPrimary}</strong>
            </span>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="hero-trust-row" data-cms-target="hero.badges">
          {heroData.badges && heroData.badges.length > 0 ? (
            heroData.badges.map((b, idx) => (
              <div key={idx} className="trust-item">
                <ShieldCheck size={15} className="trust-icon" />
                <span>{b.text}</span>
              </div>
            ))
          ) : (
            <>
              <div className="trust-item">
                <MapPin size={15} className="trust-icon" />
                <span>Muhavara Bypass Corridor</span>
              </div>
              <div className="trust-item">
                <Droplets size={15} className="trust-icon" />
                <span>Attached Baths &amp; Geysers</span>
              </div>
              <div className="trust-item">
                <Car size={15} className="trust-icon" />
                <span>Spacious Courtyard Parking</span>
              </div>
              <div className="trust-item">
                <ShieldCheck size={15} className="trust-icon" />
                <span>24/7 Front Desk &amp; Security</span>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8.5rem 0 4rem 0;
          overflow: hidden;
        }
        .hero-bg-container {
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .hero-bg-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 38%;
          transform: scale(1.02);
          filter: brightness(0.92) contrast(1.06) saturate(1.08);
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg, 
            rgba(26, 17, 9, 0.52) 0%, 
            rgba(28, 18, 10, 0.42) 35%, 
            rgba(22, 14, 7, 0.68) 75%,
            rgba(252, 250, 247, 0.98) 100%
          );
        }
        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 1.25rem;
          background: rgba(255, 248, 235, 0.18);
          border: 1px solid rgba(230, 200, 117, 0.55);
          border-radius: var(--radius-full);
          color: #ffe699;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(8px);
        }
        .hero-badge-icon {
          color: #f5c443;
        }
        .hero-title {
          font-family: var(--font-serif);
          font-size: 3.6rem;
          line-height: 1.15;
          color: #ffffff;
          font-weight: 700;
          max-width: 950px;
          margin-bottom: 1.25rem;
        }
        .gold-text {
          background: linear-gradient(135deg, #fce594 0%, #ffd768 50%, #e2b74f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 1.15rem;
          color: rgba(255, 245, 235, 0.92);
          max-width: 760px;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        .hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 3rem;
        }
        .hero-btn {
          padding: 0.9rem 1.85rem;
          font-size: 0.95rem;
        }
        
        /* Quick Booking Bar */
        .quick-booking-bar {
          width: 100%;
          max-width: 1050px;
          background: rgba(255, 252, 247, 0.97);
          backdrop-filter: blur(20px);
          border: 1.5px solid rgba(184, 138, 36, 0.38);
          border-radius: var(--radius-md);
          padding: 1.35rem 1.6rem;
          box-shadow: 0 16px 45px rgba(35, 22, 8, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.8) inset;
          margin-bottom: 2.5rem;
        }
        .booking-form-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr) auto;
          gap: 1.1rem;
          align-items: flex-end;
        }
        .form-field {
          text-align: left;
        }
        .field-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.775rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--gold-dark);
          margin-bottom: 0.45rem;
        }
        .field-icon {
          color: var(--gold-primary);
        }
        .field-input {
          width: 100%;
          padding: 0.75rem 0.9rem;
          background: #ffffff;
          border: 1.5px solid rgba(184, 138, 36, 0.25);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 0.9rem;
          font-weight: 500;
          outline: none;
          transition: var(--transition);
        }
        .field-input:focus {
          border-color: var(--gold-primary);
          box-shadow: 0 0 0 3px rgba(184, 138, 36, 0.2);
        }
        .select-input option {
          background: #ffffff;
          color: var(--text-primary);
        }
        .check-avail-btn {
          width: 100%;
          padding: 0.8rem 1.5rem;
          height: 44px;
        }

        /* Booking Summary Strip */
        .booking-summary-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 1rem;
          padding-top: 0.85rem;
          border-top: 1px solid rgba(184, 138, 36, 0.16);
          font-size: 0.825rem;
          flex-wrap: wrap;
        }
        .summary-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          color: var(--text-secondary);
        }
        .pill-sparkle {
          color: var(--gold-primary);
          flex-shrink: 0;
        }
        .support-phone {
          color: var(--gold-dark);
          font-weight: 600;
        }

        /* Trust Row */
        .hero-trust-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }
        .trust-item {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.825rem;
          font-weight: 600;
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(10px);
          padding: 0.45rem 0.95rem;
          border-radius: var(--radius-full);
          border: 1px solid rgba(184, 138, 36, 0.28);
          box-shadow: 0 4px 12px rgba(70, 45, 15, 0.06);
          transition: var(--transition);
        }
        .trust-item:hover {
          transform: translateY(-2px);
          border-color: var(--gold-primary);
          background: #ffffff;
        }
        .trust-icon {
          color: var(--gold-primary);
        }

        @media (max-width: 992px) {
          .hero-title {
            font-size: 2.8rem;
          }
          .booking-form-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .form-action {
            grid-column: span 2;
          }
        }
        @media (max-width: 600px) {
          .hero-title {
            font-size: 2.2rem;
          }
          .hero-subtitle {
            font-size: 1rem;
          }
          .booking-form-grid {
            grid-template-columns: 1fr;
          }
          .form-action {
            grid-column: span 1;
          }
        }
      `}</style>
    </section>
  );
}
