import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Menu, X } from 'lucide-react';
import { useHotelContent } from '../context/HotelContext';
import { HOTEL_INFO } from '../data/hotelData';

export default function Navbar({ onOpenBooking, onOpenAdmin }) {
  const { content } = useHotelContent();
  const hotelInfo = content?.settings || HOTEL_INFO;

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Rooms & Suites', href: '#rooms' },
    { name: 'Banquet & Lawn', href: '#banquets' },
    { name: 'The Experience', href: '#experience' },
    { name: 'Ayodhya Guide', href: '#ayodhya' },
    { name: 'Location & Contact', href: '#contact' },
  ];

  return (
    <header className={`navbar-header ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container-wide navbar-container">
        {/* Brand Logo */}
        <a href="#" className="navbar-brand">
          <img 
            src="/images/logo-icon.jpeg" 
            alt="Hotel Swastika Inn Logo" 
            className="brand-logo-img"
          />
          <div className="brand-text">
            <span className="brand-name">SWASTIKA INN</span>
            <span className="brand-sub">HOTEL • BANQUET • LAWN</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="nav-link">
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="navbar-actions">
          <a 
            href={`tel:${hotelInfo.phonePrimary}`} 
            className="phone-quick-link" 
            title="Call Hotel Directly"
          >
            <Phone size={16} className="phone-icon" />
            <span className="phone-text">{hotelInfo.phoneDisplayPrimary}</span>
          </a>

          <button 
            onClick={() => onOpenBooking({})} 
            className="btn btn-primary nav-book-btn"
          >
            <Calendar size={16} />
            <span>Book A Stay</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <div className="mobile-nav-links">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="mobile-cta-group">
              <a 
                href={`tel:${hotelInfo.phonePrimary}`} 
                className="btn btn-secondary mobile-phone-btn"
              >
                <Phone size={16} />
                <span>Call {hotelInfo.phoneDisplayPrimary}</span>
              </a>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking({});
                }} 
                className="btn btn-primary"
              >
                <Calendar size={16} />
                <span>Reserve Room / Banquet</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .navbar-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: all 0.3s ease;
          padding: 1.1rem 0;
          background: rgba(252, 250, 247, 0.92);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(184, 138, 36, 0.16);
          box-shadow: 0 2px 14px rgba(70, 45, 15, 0.04);
        }
        .navbar-scrolled {
          padding: 0.75rem 0;
          background: rgba(255, 253, 249, 0.98);
          backdrop-filter: blur(16px);
          border-bottom: 1.5px solid rgba(184, 138, 36, 0.32);
          box-shadow: 0 6px 24px rgba(70, 45, 15, 0.08);
        }
        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .brand-logo-img {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          object-fit: cover;
          border: 1px solid var(--border-gold);
          box-shadow: 0 4px 12px rgba(184, 138, 36, 0.2);
        }
        .brand-text {
          display: flex;
          flex-direction: column;
        }
        .brand-name {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--text-primary);
          line-height: 1.1;
        }
        .brand-sub {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: var(--gold-dark);
        }
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 1.75rem;
        }
        .nav-link {
          font-size: 0.925rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: var(--transition);
          position: relative;
        }
        .nav-link:hover {
          color: var(--gold-dark);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--gold-gradient);
          transition: width 0.2s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .phone-quick-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          padding: 0.5rem 0.85rem;
          border-radius: var(--radius-sm);
          background: rgba(184, 138, 36, 0.09);
          border: 1px solid rgba(184, 138, 36, 0.25);
          transition: var(--transition);
        }
        .phone-quick-link:hover {
          color: var(--gold-dark);
          border-color: var(--gold-primary);
          background: rgba(184, 138, 36, 0.18);
        }
        .phone-icon {
          color: var(--gold-primary);
        }
        .nav-book-btn {
          padding: 0.65rem 1.35rem;
          font-size: 0.875rem;
        }
        .mobile-toggle-btn {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: 0.5rem;
        }
        .mobile-menu-drawer {
          display: none;
        }

        @media (max-width: 992px) {
          .desktop-nav, .phone-quick-link {
            display: none;
          }
          .mobile-toggle-btn {
            display: block;
          }
          .mobile-menu-drawer {
            display: block;
            background: #fdfaf5;
            border-bottom: 2px solid var(--gold-primary);
            padding: 1.5rem;
            box-shadow: 0 12px 30px rgba(70, 45, 15, 0.12);
          }
          .mobile-nav-links {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .mobile-nav-link {
            font-size: 1.05rem;
            font-weight: 600;
            color: var(--text-primary);
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(150, 110, 50, 0.1);
          }
          .mobile-cta-group {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin-top: 1rem;
          }
        }
      `}</style>
    </header>
  );
}
