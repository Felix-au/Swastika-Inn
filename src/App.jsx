import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RoomsSection from './components/RoomsSection';
import BanquetAndEvents from './components/BanquetAndEvents';
import HotelExperience from './components/HotelExperience';
import AyodhyaGuide from './components/AyodhyaGuide';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import RoomDetailModal from './components/RoomDetailModal';
import AdminDashboard from './admin/AdminDashboard';
import { HotelProvider, useHotelContent } from './context/HotelContext';
import { Phone, MessageCircle } from 'lucide-react';
import { HOTEL_INFO } from './data/hotelData';

function MainSiteContent() {
  const { content } = useHotelContent();
  const hotelInfo = content?.settings || HOTEL_INFO;

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingInitialData, setBookingInitialData] = useState({});
  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState(null);

  const handleOpenBooking = (initialData = {}) => {
    setBookingInitialData(initialData || {});
    setBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setBookingModalOpen(false);
  };

  const handleSelectRoom = (room) => {
    setSelectedRoomForDetail(room);
  };

  const handleCloseRoomDetail = () => {
    setSelectedRoomForDetail(null);
  };

  return (
    <div className="hotel-app">
      {/* Navigation Header */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section */}
        <Hero onOpenBooking={handleOpenBooking} />

        {/* Rooms & Suites Showcase */}
        <RoomsSection 
          onSelectRoom={handleSelectRoom}
          onOpenBooking={handleOpenBooking}
        />

        {/* Banquets & Lawns Showcase */}
        <BanquetAndEvents onOpenBooking={handleOpenBooking} />

        {/* Hotel Amenities & Experience */}
        <HotelExperience />

        {/* Ayodhya Spiritual & Transit Distance Guide */}
        <AyodhyaGuide />

        {/* Frequently Asked Questions (SEO & User Guide) */}
        <FaqSection />
      </main>

      {/* Footer & Contact */}
      <Footer onOpenBooking={handleOpenBooking} />

      {/* Booking & Reservation Modal */}
      <BookingModal 
        isOpen={bookingModalOpen}
        onClose={handleCloseBooking}
        initialData={bookingInitialData}
      />

      {/* Room Detail & Bathroom Gallery Modal */}
      <RoomDetailModal 
        room={selectedRoomForDetail}
        roomIndex={(content?.rooms || []).findIndex(r => r.id === selectedRoomForDetail?.id)}
        onClose={handleCloseRoomDetail}
        onOpenBooking={handleOpenBooking}
      />

      {/* Floating Mobile Sticky Contact Bar */}
      <div className="floating-mobile-bar">
        <a 
          href={`tel:${hotelInfo.phonePrimary}`} 
          className="floating-action-btn call-action"
        >
          <Phone size={18} />
          <span>Call Now</span>
        </a>

        <a 
          href={`https://wa.me/${hotelInfo.whatsappNumber}?text=Namaste!%20I%20would%20like%20to%20inquire%20about%20booking%20at%20Hotel%20Swastika%20Inn.`}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-action-btn wa-action"
        >
          <MessageCircle size={18} />
          <span>WhatsApp</span>
        </a>

        <button 
          onClick={() => handleOpenBooking({})}
          className="floating-action-btn book-action"
        >
          <span>Book Stay</span>
        </button>
      </div>

      <style>{`
        .hotel-app {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-base);
          color: var(--text-primary);
        }
        main {
          flex: 1;
        }

        /* Floating Mobile Bar */
        .floating-mobile-bar {
          display: none;
          position: fixed;
          bottom: 12px;
          left: 12px;
          right: 12px;
          z-index: 999;
          background: rgba(255, 252, 247, 0.96);
          backdrop-filter: blur(16px);
          border: 1.5px solid rgba(184, 138, 36, 0.45);
          border-radius: var(--radius-full);
          padding: 6px;
          box-shadow: 0 10px 30px rgba(45, 28, 12, 0.22);
          gap: 6px;
        }
        .floating-action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.65rem 0.5rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          border: none;
          cursor: pointer;
        }
        .call-action {
          background: rgba(184, 138, 36, 0.1);
          color: var(--text-primary);
          border: 1px solid rgba(184, 138, 36, 0.3);
        }
        .wa-action {
          background: #25d366;
          color: #ffffff;
        }
        .book-action {
          background: var(--gold-gradient);
          color: #1a140b;
        }

        @media (max-width: 768px) {
          .floating-mobile-bar {
            display: flex;
          }
          /* Extra bottom padding for mobile to not overlap footer */
          footer {
            padding-bottom: 5.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}

function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const urlParams = new URLSearchParams(window.location.search);
      if (
        path === '/admin' || 
        path === '/admin/' || 
        urlParams.get('admin') === 'true' || 
        window.location.hash === '#admin'
      ) {
        setIsAdminOpen(true);
      } else {
        setIsAdminOpen(false);
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);

    // Keyboard shortcut: Ctrl + Shift + A to open Admin Studio
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', checkAdminRoute);
    };
  }, []);

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.pathname.startsWith('/admin') || window.location.search.includes('admin') || window.location.hash === '#admin') {
      window.history.pushState(null, '', '/');
    }
  };

  return (
    <HotelProvider>
      <MainSiteContent />
      {isAdminOpen && (
        <AdminDashboard onClose={handleCloseAdmin} />
      )}
    </HotelProvider>
  );
}

export default App;
