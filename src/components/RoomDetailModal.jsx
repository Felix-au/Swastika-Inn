import React, { useState } from 'react';
import { X, Bed, Users, Droplets, CheckCircle2, Calendar, Phone } from 'lucide-react';
import { HOTEL_INFO } from '../data/hotelData';

export default function RoomDetailModal({ room, onClose, onOpenBooking }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!room) return null;

  const images = room.gallery && room.gallery.length > 0 
    ? room.gallery 
    : [room.heroImage];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="room-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Modal Grid */}
        <div className="room-modal-grid">
          {/* Gallery View */}
          <div className="room-modal-gallery">
            <div className="main-display-img-box">
              <img 
                src={images[activeImageIndex]} 
                alt={`${room.title} view`} 
                className="main-display-img"
              />
              <div className="gallery-counter">
                Photo {activeImageIndex + 1} of {images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="thumb-strip">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Details & Specs */}
          <div className="room-modal-info">
            <div className="modal-tag">{room.category} Accommodations</div>
            <h3 className="modal-title">{room.title}</h3>
            
            <div className="modal-quick-specs">
              <div className="spec-pill">
                <Bed size={15} />
                <span>{room.bedType}</span>
              </div>
              <div className="spec-pill">
                <Users size={15} />
                <span>{room.capacity}</span>
              </div>
              <div className="spec-pill">
                <span>{room.size}</span>
              </div>
            </div>

            <p className="modal-description">{room.description}</p>

            {/* Bathroom Highlight Box */}
            {room.bathroom && (
              <div className="bathroom-highlight-card">
                <div className="bath-card-header">
                  <Droplets size={16} className="bath-icon" />
                  <strong>Attached Private Bathroom</strong>
                </div>
                <p className="bath-features-text">{room.bathroom.features}</p>
              </div>
            )}

            {/* Room Features */}
            <div className="room-specs-block">
              <h5 className="specs-heading">In-Room Amenities &amp; Comforts</h5>
              <div className="specs-grid">
                {room.highlights.map((item, idx) => (
                  <div key={idx} className="spec-bullet">
                    <CheckCircle2 size={14} className="bullet-check" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="modal-action-row">
              <button
                onClick={() => {
                  onClose();
                  onOpenBooking({ roomId: room.id });
                }}
                className="btn btn-primary modal-reserve-btn"
              >
                <Calendar size={16} />
                <span>Book This Room</span>
              </button>

              <a
                href={`tel:${HOTEL_INFO.phonePrimary}`}
                className="btn btn-secondary modal-call-btn"
              >
                <Phone size={15} />
                <span>Direct Call</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(4, 7, 13, 0.85);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          overflow-y: auto;
        }
        .room-modal-container {
          position: relative;
          background: var(--bg-card);
          border: 1px solid var(--border-gold);
          border-radius: var(--radius-lg);
          max-width: 960px;
          width: 100%;
          overflow: hidden;
          background: #fdfbf7;
          border: 1.5px solid rgba(184, 138, 36, 0.4);
          box-shadow: 0 25px 60px rgba(45, 28, 12, 0.35);
          animation: modalAppear 0.25s ease-out;
        }
        @keyframes modalAppear {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 20;
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .modal-close-btn:hover {
          background: var(--gold-primary);
          color: #1a140b;
          border-color: var(--gold-primary);
        }
        .room-modal-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
        }
        .room-modal-gallery {
          background: #f5ede2;
          display: flex;
          flex-direction: column;
        }
        .main-display-img-box {
          position: relative;
          height: 380px;
          background: #f5ede2;
        }
        .main-display-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .gallery-counter {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(30, 20, 10, 0.75);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          color: #ffffff;
        }
        .thumb-strip {
          display: flex;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #ece2d4;
          overflow-x: auto;
        }
        .thumb-btn {
          width: 68px;
          height: 52px;
          border-radius: 6px;
          border: 2px solid transparent;
          overflow: hidden;
          cursor: pointer;
          flex-shrink: 0;
          background: #f5ede2;
          padding: 0;
          transition: var(--transition);
        }
        .thumb-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .thumb-btn.active {
          border-color: var(--gold-primary);
        }

        .room-modal-info {
          padding: 2.25rem;
          display: flex;
          flex-direction: column;
          max-height: 85vh;
          overflow-y: auto;
        }
        .modal-tag {
          color: var(--gold-dark);
          font-size: 0.775rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.35rem;
        }
        .modal-title {
          font-family: var(--font-serif);
          font-size: 1.85rem;
          color: var(--text-primary);
          line-height: 1.2;
          margin-bottom: 0.85rem;
        }
        .modal-quick-specs {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
          margin-bottom: 1.25rem;
        }
        .spec-pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.75rem;
          background: rgba(184, 138, 36, 0.09);
          border: 1px solid rgba(184, 138, 36, 0.3);
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--gold-dark);
        }
        .modal-description {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .bathroom-highlight-card {
          background: rgba(184, 138, 36, 0.08);
          border: 1px solid rgba(184, 138, 36, 0.35);
          border-radius: var(--radius-sm);
          padding: 1rem;
          margin-bottom: 1.5rem;
        }
        .bath-card-header {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          color: var(--gold-dark);
          font-size: 0.875rem;
          font-weight: 700;
          margin-bottom: 0.35rem;
        }
        .bath-icon {
          color: var(--gold-primary);
        }
        .bath-features-text {
          font-size: 0.825rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .room-specs-block {
          margin-bottom: 2rem;
        }
        .specs-heading {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
        }
        .specs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }
        .spec-bullet {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.825rem;
          color: var(--text-muted);
        }
        .bullet-check {
          color: var(--gold-primary);
          flex-shrink: 0;
        }

        .modal-action-row {
          display: flex;
          gap: 0.75rem;
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(150, 110, 50, 0.12);
        }
        .modal-reserve-btn {
          flex: 1.5;
        }
        .modal-call-btn {
          flex: 1;
        }

        @media (max-width: 820px) {
          .room-modal-grid {
            grid-template-columns: 1fr;
          }
          .main-display-img-box {
            height: 260px;
          }
          .room-modal-info {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
