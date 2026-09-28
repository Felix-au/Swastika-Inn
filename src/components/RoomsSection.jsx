import React from 'react';
import { Users, Bed, Droplets, Tv, Wind, CheckCircle2, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { ROOMS_DATA } from '../data/hotelData';

export default function RoomsSection({ onSelectRoom, onOpenBooking }) {
  return (
    <section id="rooms" className="rooms-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={14} />
            <span>Curated Accommodations</span>
          </div>
          <h2 className="section-title">
            Comfort Designed For <span>Rest &amp; Rejuvenation</span>
          </h2>
          <p className="section-desc">
            Each room at Hotel Swastika Inn is equipped with split air conditioning, modern western attached bathrooms with hot water geysers, smart entertainment, and immaculate linens.
          </p>
        </div>

        {/* Rooms Grid - Centered Symmetrical Layout */}
        <div className="rooms-grid">
          {ROOMS_DATA.map((room) => (
            <div key={room.id} className="room-card">
              {/* Image & Badges */}
              <div className="room-img-container">
                <img 
                  src={room.heroImage} 
                  alt={room.title} 
                  className="room-img"
                  loading="lazy"
                />
                <div className="room-badges-top">
                  <span className="room-tag-pill">{room.tag}</span>
                  <span className="room-capacity-pill">
                    <Users size={12} />
                    <span>{room.capacity}</span>
                  </span>
                </div>
                <button 
                  className="quick-view-overlay-btn"
                  onClick={() => onSelectRoom(room)}
                  title="View Photos & Attached Bathroom"
                >
                  <Eye size={15} />
                  <span>Photos &amp; Bathroom</span>
                </button>
              </div>

              {/* Room Content */}
              <div className="room-card-body">
                <div className="room-meta-row">
                  <span className="room-spec-item">
                    <Bed size={14} className="meta-icon" />
                    <span>{room.bedType}</span>
                  </span>
                  <span className="room-spec-item">
                    <Droplets size={14} className="meta-icon" />
                    <span>Attached Bath &amp; Geyser</span>
                  </span>
                </div>

                <h3 className="room-card-title">{room.title}</h3>
                <p className="room-card-desc">{room.description}</p>

                {/* Amenities Badges */}
                <div className="room-amenities-list">
                  <div className="room-amenity">
                    <Wind size={13} className="amenity-icon" />
                    <span>Split AC</span>
                  </div>
                  <div className="room-amenity">
                    <Droplets size={13} className="amenity-icon" />
                    <span>Hot Water Geyser</span>
                  </div>
                  <div className="room-amenity">
                    <Tv size={13} className="amenity-icon" />
                    <span>Smart LED TV</span>
                  </div>
                  <div className="room-amenity">
                    <CheckCircle2 size={13} className="amenity-icon" />
                    <span>Room Service</span>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="room-card-footer">
                  <button 
                    onClick={() => onSelectRoom(room)} 
                    className="btn btn-secondary card-detail-btn"
                  >
                    <Eye size={14} />
                    <span>Details &amp; Bath</span>
                  </button>

                  <button 
                    onClick={() => onOpenBooking({ roomId: room.id })} 
                    className="btn btn-primary card-book-btn"
                  >
                    <span>Reserve</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .rooms-section {
          padding: 6.5rem 0;
          background: var(--bg-base);
          position: relative;
        }
        /* Rooms Grid - Symmetrical Centered Layout */
        .rooms-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 2rem;
          max-width: 1220px;
          margin: 0 auto;
        }
        .room-card {
          flex: 0 1 calc(33.333% - 1.4rem);
          width: calc(33.333% - 1.4rem);
          min-width: 320px;
          max-width: 380px;
          background: #ffffff;
          border: 1.5px solid rgba(160, 120, 50, 0.16);
          border-radius: var(--radius-md);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px rgba(70, 45, 15, 0.06);
        }
        .room-card:hover {
          transform: translateY(-8px);
          border-color: var(--gold-primary);
          box-shadow: 0 16px 36px rgba(70, 45, 15, 0.13), 0 0 25px rgba(184, 138, 36, 0.15);
        }
        .room-img-container {
          position: relative;
          width: 100%;
          height: 240px;
          background: #f5ede2;
          overflow: hidden;
        }
        .room-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .room-card:hover .room-img {
          transform: scale(1.05);
        }
        .room-badges-top {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          pointer-events: none;
        }
        .room-tag-pill {
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(8px);
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--gold-dark);
          border: 1px solid rgba(184, 138, 36, 0.4);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .room-capacity-pill {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(8px);
          padding: 0.3rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-primary);
          border: 1px solid var(--border-subtle);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .quick-view-overlay-btn {
          position: absolute;
          bottom: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(184, 138, 36, 0.35);
          color: var(--text-primary);
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-full);
          font-size: 0.775rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }
        .quick-view-overlay-btn:hover {
          background: var(--gold-primary);
          color: #1a140b;
          border-color: var(--gold-primary);
        }

        .room-card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .room-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          font-size: 0.8rem;
          color: var(--gold-dark);
          font-weight: 600;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .room-spec-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .meta-icon {
          color: var(--gold-primary);
        }
        .room-card-title {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          color: var(--text-primary);
          margin-bottom: 0.6rem;
          line-height: 1.25;
        }
        .room-card-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1.25rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .room-amenities-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(150, 110, 50, 0.12);
        }
        .room-amenity {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .amenity-icon {
          color: var(--gold-primary);
        }
        .room-card-footer {
          display: flex;
          gap: 0.75rem;
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(150, 110, 50, 0.12);
        }
        .card-detail-btn {
          flex: 1;
          padding: 0.65rem 1rem;
          font-size: 0.85rem;
        }
        .card-book-btn {
          flex: 1.2;
          padding: 0.65rem 1rem;
          font-size: 0.85rem;
        }

        @media (max-width: 1080px) {
          .room-card {
            flex: 0 1 calc(50% - 1rem);
            width: calc(50% - 1rem);
            max-width: 440px;
          }
        }
        @media (max-width: 720px) {
          .room-card {
            flex: 0 1 100%;
            width: 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
