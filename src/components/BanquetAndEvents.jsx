import React from 'react';
import { Users, Sparkles, CheckCircle2, Calendar, Phone, ArrowRight } from 'lucide-react';
import { useHotelContent } from '../context/HotelContext';
import { BANQUET_DATA, HOTEL_INFO } from '../data/hotelData';

export default function BanquetAndEvents({ onOpenBooking }) {
  const { content } = useHotelContent();
  const venuesList = content?.banquets || BANQUET_DATA;
  const hotelInfo = content?.settings || HOTEL_INFO;

  return (
    <section id="banquets" className="banquet-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={14} />
            <span>Grand Celebrations</span>
          </div>
          <h2 className="section-title">
            Banquets &amp; Lawns For <span>Unforgettable Occasions</span>
          </h2>
          <p className="section-desc">
            Host magnificent weddings, ring ceremonies, birthday milestones, and corporate seminars at Ayodhya's most versatile celebratory destination.
          </p>
        </div>

        {/* Venues Showcase Cards */}
        <div className="venues-grid">
          {venuesList.map((venue) => (
            <div key={venue.id} className="venue-card">
              {/* Dual Image Preview */}
              <div className="venue-images-wrap">
                <div className="venue-main-img-box">
                  <img 
                    src={venue.image} 
                    alt={venue.title} 
                    className="venue-img-main"
                    loading="lazy"
                  />
                  <div className="venue-capacity-badge">
                    <Users size={14} />
                    <span>{venue.capacity}</span>
                  </div>
                </div>
                <div className="venue-secondary-img-box">
                  <img 
                    src={venue.secondaryImage} 
                    alt={`${venue.title} setup`} 
                    className="venue-img-sub"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Venue Details */}
              <div className="venue-content">
                <div className="venue-best-for">
                  <Sparkles size={13} className="venue-sparkle-icon" />
                  <span>{venue.bestFor}</span>
                </div>

                <h3 className="venue-title">{venue.title}</h3>
                <p className="venue-desc">{venue.description}</p>

                {/* Features Checklist */}
                <div className="venue-features-grid">
                  {venue.features.map((feature, i) => (
                    <div key={i} className="venue-feature-item">
                      <CheckCircle2 size={15} className="feature-check-icon" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Venue Action Buttons */}
                <div className="venue-actions">
                  <button 
                    onClick={() => onOpenBooking({ eventVenue: venue.title })} 
                    className="btn btn-primary venue-inquire-btn"
                  >
                    <Calendar size={16} />
                    <span>Inquire For This Venue</span>
                  </button>

                  <a 
                    href={`tel:${hotelInfo.phonePrimary}`} 
                    className="btn btn-secondary venue-call-btn"
                  >
                    <Phone size={15} />
                    <span>Speak to Event Manager</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Celebration Highlights Banner */}
        <div className="events-catering-banner">
          <div className="catering-content">
            <div className="catering-tag">Catering &amp; Decor Solutions</div>
            <h3 className="catering-title">Turnkey Wedding &amp; Party Planning</h3>
            <p className="catering-desc">
              From exquisite vegetarian multi-cuisine buffet arrangements to traditional floral umbrella photo corners and live acoustic stages, our experienced hospitality staff ensures every ceremony is executed flawlessly.
            </p>
          </div>
          <div className="catering-cta">
            <button 
              onClick={() => onOpenBooking({ eventVenue: 'Full Hotel & Lawn Booking' })} 
              className="btn btn-primary"
            >
              <span>Book Full Venue Package</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .banquet-section {
          padding: 6.5rem 0;
          background: var(--bg-secondary);
          position: relative;
        .venues-grid {
          display: flex;
          flex-direction: column;
          gap: 3.5rem;
          margin-bottom: 4rem;
        }
        .venue-card {
          background: #ffffff;
          border: 1.5px solid rgba(160, 120, 50, 0.16);
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          box-shadow: 0 8px 30px rgba(70, 45, 15, 0.08);
          transition: var(--transition);
        }
        .venue-card:hover {
          border-color: var(--gold-primary);
          box-shadow: 0 16px 45px rgba(70, 45, 15, 0.14), 0 0 30px rgba(184, 138, 36, 0.15);
        }
        .venue-images-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: #f5ede2;
        }
        .venue-main-img-box {
          position: relative;
          height: 320px;
          overflow: hidden;
        }
        .venue-img-main {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .venue-card:hover .venue-img-main {
          transform: scale(1.03);
        }
        .venue-capacity-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(10px);
          padding: 0.4rem 0.9rem;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--gold-dark);
          border: 1px solid rgba(184, 138, 36, 0.4);
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
        }
        .venue-secondary-img-box {
          height: 140px;
          overflow: hidden;
        }
        .venue-img-sub {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .venue-card:hover .venue-img-sub {
          transform: scale(1.05);
        }

        .venue-content {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .venue-best-for {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--gold-dark);
          font-size: 0.825rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }
        .venue-sparkle-icon {
          color: var(--gold-primary);
        }
        .venue-title {
          font-family: var(--font-serif);
          font-size: 2rem;
          color: var(--text-primary);
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        .venue-desc {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.75rem;
        }
        .venue-features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem 1rem;
          margin-bottom: 2rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(150, 110, 50, 0.12);
        }
        .venue-feature-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .feature-check-icon {
          color: var(--gold-primary);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .venue-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .venue-inquire-btn {
          flex: 1.3;
        }
        .venue-call-btn {
          flex: 1;
        }

        /* Catering Banner */
        .events-catering-banner {
          background: linear-gradient(135deg, #fffdf9 0%, #f9f2e6 100%);
          border: 1.5px solid rgba(184, 138, 36, 0.38);
          border-radius: var(--radius-md);
          padding: 2.25rem 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          box-shadow: 0 10px 30px rgba(70, 45, 15, 0.08);
        }
        .catering-tag {
          color: var(--gold-dark);
          font-size: 0.825rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.35rem;
        }
        .catering-title {
          font-family: var(--font-serif);
          font-size: 1.65rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        .catering-desc {
          font-size: 0.925rem;
          color: var(--text-secondary);
          max-width: 720px;
          line-height: 1.5;
        }

        @media (max-width: 992px) {
          .venue-card {
            grid-template-columns: 1fr;
          }
          .venue-images-wrap {
            flex-direction: row;
          }
          .venue-main-img-box {
            height: 240px;
            flex: 2;
          }
          .venue-secondary-img-box {
            height: 240px;
            flex: 1;
          }
          .venue-content {
            padding: 1.75rem;
          }
          .events-catering-banner {
            flex-direction: column;
            text-align: center;
            padding: 2rem;
          }
          .catering-desc {
            margin: 0 auto;
          }
        }
        @media (max-width: 600px) {
          .venue-features-grid {
            grid-template-columns: 1fr;
          }
          .venue-images-wrap {
            flex-direction: column;
          }
          .venue-main-img-box {
            height: 200px;
          }
          .venue-secondary-img-box {
            height: 120px;
          }
          .venue-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
}
