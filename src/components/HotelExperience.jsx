import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Car, 
  Droplets, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2 
} from 'lucide-react';

import { useHotelContent } from '../context/HotelContext';

export default function HotelExperience() {
  const { content } = useHotelContent();
  const experienceData = content?.experience || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const experienceItems = [
    {
      id: 'lobby',
      title: 'Grand Lobby & 24/7 Reception',
      tag: 'Warm Welcomes',
      image: '/images/reception-desk.jpeg',
      description: 'Step into an inviting ambiance where dedicated front-desk staff greet you with traditional Ayodhya hospitality, assisting with seamless check-ins, local darshan tips, and 24/7 guest support.',
      icon: Clock,
      stats: '24/7 Front Desk',
      bullets: [
        'Round-the-clock CCTV surveillance & gated reception security',
        'Express check-in / check-out with personalized assistance',
        'Darshan timings, temple routes & verified local cab arrangements'
      ]
    },
    {
      id: 'parking',
      title: 'Secure Courtyard Parking',
      tag: 'Peace of Mind',
      image: '/images/parking-day.jpeg',
      description: 'Spacious on-site courtyard parking and wide vehicle driveway accommodating family sedans, SUVs, tourist tempo travelers, and event visitor fleets under continuous 24-hour security watch.',
      icon: Car,
      stats: '50+ Vehicles',
      bullets: [
        'Spacious on-site paved courtyard parking lot',
        'Wide unobstructed driveway for cars, SUVs & tempo travelers',
        'Well-illuminated boundary with 24-hour dedicated security guards'
      ]
    },
    {
      id: 'baths',
      title: 'Attached Western Bathrooms',
      tag: 'Hygiene & Comfort',
      image: '/images/bathroom-modern.jpeg',
      description: 'Every guest room features an attached private bathroom with dedicated instant hot water geysers, rain showers, chrome fixtures, natural ventilation, and fresh sanitized amenities.',
      icon: Droplets,
      stats: 'Hot Water Geysers',
      bullets: [
        'Instant hot water geysers installed in all guest rooms',
        'Modern rain shower heads & premium chrome mixer fittings',
        'Sanitized western commodes, fresh towels & daily housekeeping'
      ]
    }
  ];

  // Auto-revolve every 4 seconds; pauses on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % experienceItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, experienceItems.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + experienceItems.length) % experienceItems.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % experienceItems.length);
  };

  // Determine 3D carousel position relative to current active index
  const getCardStatus = (index) => {
    const diff = (index - currentIndex + experienceItems.length) % experienceItems.length;
    if (diff === 0) return 'center';
    if (diff === 1) return 'right';
    return 'left';
  };

  const handleCardClick = (status) => {
    if (status === 'left') handlePrev();
    if (status === 'right') handleNext();
  };

  return (
    <section id="experience" className="experience-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Award size={14} />
            <span>The Swastika Experience</span>
          </div>
          <h2 className="section-title" data-cms-target="experience.heading">
            {experienceData.heading || (
              <>Crafted For <span>Devotees, Travelers &amp; Families</span></>
            )}
          </h2>
          <p className="section-desc" data-cms-target="experience.subheading">
            {experienceData.subheading || "We blend the spiritual tranquility of Ayodhya with contemporary hotel amenities, ensuring your stay is peaceful, seamless, and dignified."}
          </p>
        </div>

        {/* 3D Revolving Carousel Stage */}
        <div 
          className="revolving-stage-container"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Side Arrow Navigation Buttons (Left & Right Only) */}
          <button 
            className="revolving-arrow-btn arrow-left" 
            onClick={handlePrev}
            aria-label="Revolve Left"
            title="Previous Feature"
          >
            <ChevronLeft size={24} />
          </button>

          <button 
            className="revolving-arrow-btn arrow-right" 
            onClick={handleNext}
            aria-label="Revolve Right"
            title="Next Feature"
          >
            <ChevronRight size={24} />
          </button>

          {/* 3D Carousel Stage */}
          <div className="revolving-track">
            {experienceItems.map((item, index) => {
              const status = getCardStatus(index);
              const Icon = item.icon;
              return (
                <div 
                  key={item.id}
                  className={`revolving-card ${status}`}
                  onClick={() => handleCardClick(status)}
                  role={status === 'center' ? 'region' : 'button'}
                  tabIndex={status === 'center' ? 0 : -1}
                  aria-label={item.title}
                  data-cms-target={`experience.${index}`}
                >
                  {/* Image Header with Stat Badge */}
                  <div className="card-img-wrap">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="card-img"
                      loading="lazy"
                      data-cms-target={`experience.${index}.image`}
                    />
                    <div className="card-stat-pill">
                      <Icon size={14} />
                      <span>{item.stats}</span>
                    </div>
                    {status !== 'center' && <div className="card-glass-veil" />}
                  </div>

                  {/* Body Content */}
                  <div className="card-body">
                    <div className="card-tag">{item.tag}</div>
                    <h3 className="card-title" data-cms-target={`experience.${index}.title`}>{item.title}</h3>
                    <p className="card-desc" data-cms-target={`experience.${index}.desc`}>{item.description}</p>

                    <div className="card-bullets">
                      {item.bullets.map((bullet, i) => (
                        <div key={i} className="card-bullet-row">
                          <CheckCircle2 size={15} className="bullet-chk" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .experience-section {
          padding: 6.5rem 0;
          background: var(--bg-base);
          position: relative;
          overflow: hidden;
        }

        /* 3D Revolving Stage */
        .revolving-stage-container {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          perspective: 1400px;
          perspective-origin: center 48%;
          padding: 1.5rem 0;
        }

        .revolving-track {
          position: relative;
          width: 100%;
          height: 520px;
          transform-style: preserve-3d;
        }

        /* Revolving Card Base */
        .revolving-card {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 660px;
          max-width: 90%;
          background: #ffffff;
          border-radius: var(--radius-lg);
          border: 1.5px solid rgba(160, 120, 50, 0.18);
          box-shadow: 0 16px 40px rgba(50, 30, 10, 0.12);
          overflow: hidden;
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          transition: transform 0.65s cubic-bezier(0.25, 1, 0.5, 1),
                      opacity 0.65s ease,
                      box-shadow 0.65s ease,
                      border-color 0.4s ease,
                      filter 0.65s ease;
          user-select: none;
        }

        /* Center Active Card: Front & Centered */
        .revolving-card.center {
          transform: translate3d(-50%, -50%, 0) scale(1) rotateY(0deg);
          z-index: 10;
          opacity: 1;
          filter: brightness(1);
          pointer-events: auto;
          border-color: rgba(184, 138, 36, 0.45);
          box-shadow: 0 24px 60px rgba(50, 30, 10, 0.18), 0 0 35px rgba(184, 138, 36, 0.12);
        }

        /* Left Card: Revolving Behind on the Left */
        .revolving-card.left {
          transform: translate3d(calc(-50% - 240px), -50%, -120px) scale(0.84) rotateY(20deg);
          z-index: 5;
          opacity: 0.62;
          filter: brightness(0.88);
          cursor: pointer;
        }
        .revolving-card.left:hover {
          opacity: 0.85;
          filter: brightness(0.95);
          transform: translate3d(calc(-50% - 230px), -50%, -90px) scale(0.87) rotateY(16deg);
        }

        /* Right Card: Revolving Behind on the Right */
        .revolving-card.right {
          transform: translate3d(calc(-50% + 240px), -50%, -120px) scale(0.84) rotateY(-20deg);
          z-index: 5;
          opacity: 0.62;
          filter: brightness(0.88);
          cursor: pointer;
        }
        .revolving-card.right:hover {
          opacity: 0.85;
          filter: brightness(0.95);
          transform: translate3d(calc(-50% + 230px), -50%, -90px) scale(0.87) rotateY(-16deg);
        }

        /* Glass Veil for Side Cards */
        .card-glass-veil {
          position: absolute;
          inset: 0;
          background: rgba(252, 250, 247, 0.25);
          backdrop-filter: blur(1.5px);
          pointer-events: none;
        }

        /* Card Image & Stat Badge */
        .card-img-wrap {
          position: relative;
          height: 100%;
          min-height: 520px;
          background: #f5ede2;
          overflow: hidden;
        }

        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .revolving-card.center:hover .card-img {
          transform: scale(1.04);
        }

        .card-stat-pill {
          position: absolute;
          bottom: 20px;
          left: 20px;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 0.45rem 0.95rem;
          border-radius: var(--radius-full);
          border: 1px solid rgba(184, 138, 36, 0.4);
          color: var(--gold-dark);
          font-weight: 700;
          font-size: 0.825rem;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
          z-index: 2;
        }

        /* Card Content */
        .card-body {
          padding: 2.75rem 2.25rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: #ffffff;
        }

        .card-tag {
          color: var(--gold-dark);
          font-size: 0.775rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 0.5rem;
        }

        .card-title {
          font-family: var(--font-serif);
          font-size: 1.85rem;
          color: var(--text-primary);
          line-height: 1.25;
          margin-bottom: 1rem;
        }

        .card-desc {
          font-size: 0.925rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.75rem;
        }

        .card-bullets {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          border-top: 1px solid rgba(150, 110, 50, 0.12);
          padding-top: 1.25rem;
        }

        .card-bullet-row {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.45;
        }

        .bullet-chk {
          color: var(--gold-primary);
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* Revolving Side Arrow Buttons */
        .revolving-arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 52px;
          height: 52px;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border: 1.5px solid rgba(160, 120, 50, 0.28);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 8px 24px rgba(70, 45, 15, 0.12);
          z-index: 25;
        }

        .arrow-left {
          left: 12px;
        }

        .arrow-right {
          right: 12px;
        }

        .revolving-arrow-btn:hover {
          background: var(--gold-primary);
          color: #1a140b;
          border-color: var(--gold-primary);
          transform: translateY(-50%) scale(1.08);
          box-shadow: 0 10px 30px rgba(184, 138, 36, 0.35);
        }

        .revolving-arrow-btn:active {
          transform: translateY(-50%) scale(0.98);
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .revolving-card {
            width: 580px;
          }
          .revolving-card.left {
            transform: translate3d(calc(-50% - 170px), -50%, -100px) scale(0.82) rotateY(16deg);
          }
          .revolving-card.right {
            transform: translate3d(calc(-50% + 170px), -50%, -100px) scale(0.82) rotateY(-16deg);
          }
        }

        @media (max-width: 768px) {
          .revolving-track {
            height: 560px;
          }
          .revolving-card {
            grid-template-columns: 1fr;
            width: 88%;
          }
          .card-img-wrap {
            height: 220px;
            min-height: 220px;
          }
          .card-body {
            padding: 1.75rem 1.4rem;
          }
          .card-title {
            font-size: 1.4rem;
          }
          .card-desc {
            font-size: 0.85rem;
            margin-bottom: 1rem;
          }
          .revolving-card.left {
            transform: translate3d(calc(-50% - 60px), -50%, -80px) scale(0.85) rotateY(10deg);
            opacity: 0.35;
          }
          .revolving-card.right {
            transform: translate3d(calc(-50% + 60px), -50%, -80px) scale(0.85) rotateY(-10deg);
            opacity: 0.35;
          }
          .revolving-arrow-btn {
            width: 42px;
            height: 42px;
          }
        }
      `}</style>
    </section>
  );
}
