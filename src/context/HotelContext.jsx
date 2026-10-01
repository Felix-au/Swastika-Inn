import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  HOTEL_INFO, 
  ROOMS_DATA, 
  BANQUET_DATA, 
  AYODHYA_HIGHLIGHTS, 
  HOTEL_FAQS 
} from '../data/hotelData';

const HotelContext = createContext(null);

const DEFAULT_CONTENT = {
  settings: HOTEL_INFO,
  hero: {
    badge: "Divine Stay in Sacred Ayodhya",
    titlePrefix: "Royal Comfort",
    titleSuffix: "& Grand Celebrations",
    description: "Experience Ayodhya Dham's finest hospitality with opulent suites, attached western baths, grand banquet facilities, and a lush celebration lawn along the serene Muhavara Bypass corridor.",
    backgroundImage: "/images/hero-facade-night.jpeg",
    badges: [
      { text: "Near Muhavara Bypass" },
      { text: "~15 Mins to Ram Mandir" },
      { text: "50+ Car Courtyard Parking" },
      { text: "24/7 Hot Water Geyser" }
    ]
  },
  rooms: ROOMS_DATA,
  banquets: BANQUET_DATA,
  experience: {
    heading: "Curated for Divine Peace & Opulent Comfort",
    subheading: "Every guest at Swastika Inn is blessed with modern conveniences, hygienic sanitation, and thoughtful Ayodhya hospitality.",
    amenities: [
      {
        icon: "Car",
        title: "Ample Courtyard Parking",
        desc: "Spacious and secured on-premises parking accommodating 50+ guest vehicles, tour buses, and private cabs."
      },
      {
        icon: "ArrowUpCircle",
        title: "High-Speed Passenger Lift",
        desc: "Effortless floor-to-floor elevator accessibility for elderly pilgrims, families, and luggage."
      },
      {
        icon: "Zap",
        title: "100% Silent Power Backup",
        desc: "Heavy-duty generator infrastructure ensuring 24/7 seamless air-conditioning, lighting, and hot water."
      },
      {
        icon: "UtensilsCrossed",
        title: "Hygienic Pure Veg Dining",
        desc: "Delicious Satvik dining and customized event catering crafted with pure ghee and local flavors."
      },
      {
        icon: "Wifi",
        title: "High-Speed Wi-Fi",
        desc: "Fast optical fiber internet connectivity across all suites, lobby, banquet, and lawn spaces."
      },
      {
        icon: "Clock",
        title: "24/7 Front Desk & Security",
        desc: "Dedicated concierge for local temple darshan guidance, taxi booking, and guest assistance."
      }
    ]
  },
  guide: AYODHYA_HIGHLIGHTS,
  faqs: HOTEL_FAQS
};

export function HotelProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [isLivePreview, setIsLivePreview] = useState(false);

  const fetchLiveContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setContent((prev) => ({
            ...prev,
            ...json.data,
            settings: { ...prev.settings, ...json.data.settings },
            hero: { ...prev.hero, ...json.data.hero }
          }));
        }
      }
    } catch (e) {
      // Backend not running or offline, fallback to bundled static data
      console.info('[HotelProvider] Using bundled static content fallback.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveContent();

    // Listen for live preview postMessage events from the Admin CMS editor
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'SWASTIKA_PREVIEW_SYNC') {
        setIsLivePreview(true);
        if (event.data.payload) {
          setContent((prev) => ({
            ...prev,
            ...event.data.payload
          }));
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [fetchLiveContent]);

  return (
    <HotelContext.Provider value={{ content, isLoading, isLivePreview, refreshContent: fetchLiveContent }}>
      {isLivePreview && (
        <div className="preview-indicator-badge">
          <span>⚡ Live Preview Mode (Editing Draft)</span>
        </div>
      )}
      {children}
      <style>{`
        .preview-indicator-badge {
          position: fixed;
          top: 8px;
          right: 8px;
          z-index: 99999;
          background: #c59b27;
          color: #1a140b;
          font-weight: 700;
          font-size: 0.75rem;
          padding: 4px 12px;
          border-radius: 9999px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          letter-spacing: 0.03em;
          pointer-events: none;
          animation: pulsePreview 2s infinite ease-in-out;
        }
        @keyframes pulsePreview {
          0%, 100% { opacity: 0.95; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(0.98); }
        }
      `}</style>
    </HotelContext.Provider>
  );
}

export function useHotelContent() {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotelContent must be used within a HotelProvider');
  }
  return context;
}
