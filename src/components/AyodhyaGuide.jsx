import React from 'react';
import { MapPin, Navigation, Compass, ExternalLink, Clock } from 'lucide-react';
import { useHotelContent } from '../context/HotelContext';
import { AYODHYA_HIGHLIGHTS, HOTEL_INFO } from '../data/hotelData';

export default function AyodhyaGuide() {
  const { content } = useHotelContent();
  const guideList = content?.guide || AYODHYA_HIGHLIGHTS;
  const hotelInfo = content?.settings || HOTEL_INFO;

  return (
    <section id="ayodhya" className="guide-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Compass size={14} />
            <span>Divine Destination</span>
          </div>
          <h2 className="section-title">
            Explore <span>Ayodhya Dham</span> With Ease
          </h2>
          <p className="section-desc">
            Situated directly along the Muhavara Bypass, Hotel Swastika Inn offers smooth vehicle movement to Ayodhya's revered pilgrimage sites and transit points without traffic congestion.
          </p>
        </div>

        {/* Landmarks Grid */}
        <div className="landmarks-grid">
          {guideList.map((place, index) => (
            <div key={index} className="landmark-card" data-cms-target={`guide.${index}`}>
              <div className="landmark-top">
                <span className="landmark-type">{place.type}</span>
                <span className="landmark-distance" data-cms-target={`guide.${index}.distance`}>
                  <Clock size={13} />
                  <span>{place.distance}</span>
                </span>
              </div>

              <h3 className="landmark-name" data-cms-target={`guide.${index}.name`}>{place.name}</h3>
              <p className="landmark-desc" data-cms-target={`guide.${index}.desc`}>{place.description}</p>

              <div className="landmark-footer">
                <MapPin size={14} className="pin-icon" />
                <span>Quick highway &amp; bypass approach</span>
              </div>
            </div>
          ))}
        </div>

        {/* Location Banner */}
        <div className="guide-cta-card">
          <div className="cta-icon-box">
            <Navigation size={28} className="nav-pin" />
          </div>
          <div className="cta-text-box">
            <h4>Planning Your Temple Darshan or Airport Pickup?</h4>
            <p>Our front desk staff is available 24/7 to arrange local e-rickshaws, private cabs, and provide verified darshan schedule guidance.</p>
          </div>
          <div className="cta-actions">
            <a 
              href={HOTEL_INFO.googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary cta-dir-btn"
            >
              <span>Get Directions</span>
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .guide-section {
          padding: 6rem 0;
          background: var(--bg-secondary);
          position: relative;
        }
        .landmarks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3.5rem;
        }
        .landmark-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          transition: var(--transition);
        }
        .landmark-card:hover {
          transform: translateY(-4px);
          border-color: var(--gold-primary);
          box-shadow: 0 12px 30px rgba(70, 45, 15, 0.1), 0 0 20px rgba(184, 138, 36, 0.12);
        }
        .landmark-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .landmark-type {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--gold-dark);
        }
        .landmark-distance {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(184, 138, 36, 0.1);
          border: 1px solid rgba(184, 138, 36, 0.35);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.775rem;
          font-weight: 700;
          color: var(--gold-dark);
        }
        .landmark-name {
          font-family: var(--font-serif);
          font-size: 1.3rem;
          color: var(--text-primary);
          margin-bottom: 0.6rem;
          line-height: 1.25;
        }
        .landmark-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1.25rem;
          flex: 1;
        }
        .landmark-footer {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.775rem;
          color: var(--text-muted);
          border-top: 1px solid rgba(150, 110, 50, 0.12);
          padding-top: 0.75rem;
        }
        .pin-icon {
          color: var(--gold-primary);
        }

        /* CTA Card */
        .guide-cta-card {
          background: linear-gradient(135deg, #ffffff 0%, #fbf5eb 100%);
          border: 1.5px solid rgba(184, 138, 36, 0.35);
          border-radius: var(--radius-md);
          padding: 2rem 2.5rem;
          display: flex;
          align-items: center;
          gap: 2rem;
          box-shadow: 0 8px 30px rgba(70, 45, 15, 0.08);
        }
        .cta-icon-box {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-full);
          background: rgba(184, 138, 36, 0.12);
          border: 1px solid var(--border-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .nav-pin {
          color: var(--gold-dark);
        }
        .cta-text-box {
          flex: 1;
        }
        .cta-text-box h4 {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          color: var(--text-primary);
          margin-bottom: 0.35rem;
        }
        .cta-text-box p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        @media (max-width: 850px) {
          .guide-cta-card {
            flex-direction: column;
            text-align: center;
            padding: 2rem 1.5rem;
          }
          .cta-actions {
            width: 100%;
          }
          .cta-dir-btn {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
