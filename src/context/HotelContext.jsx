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

    const isInsideIframe = window.self !== window.top;
    let tooltipEl = null;

    if (isInsideIframe) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'cms-connector-tooltip';
      tooltipEl.className = 'cms-floating-tooltip';
      tooltipEl.innerHTML = `<span class="cms-tooltip-icon">✎</span> <span class="cms-tooltip-text">Click to edit</span>`;
      document.body.appendChild(tooltipEl);
    }

    const formatTargetLabel = (key) => {
      if (!key) return 'Element';
      if (key === 'hero.badge') return 'Hero Eyebrow Badge';
      if (key === 'hero.title') return 'Hero Main Title';
      if (key === 'hero.description') return 'Hero Subtitle';
      if (key === 'hero.image') return 'Hero Night Facade Photo';
      if (key === 'hero.badges') return 'Hero Verified Badges';
      if (key === 'experience.heading') return 'Amenities Heading';
      if (key === 'experience.subheading') return 'Amenities Subtitle';
      if (key === 'settings.hotelName') return 'Hotel Name';
      if (key === 'settings.subtitle') return 'Brand Tagline';
      if (key === 'settings.phone') return 'Primary Phone Number';
      if (key === 'settings.phoneSecondary') return 'Secondary Phone Number';
      if (key === 'settings.whatsapp') return 'WhatsApp Desk';
      if (key === 'settings.email') return 'Contact Email';
      if (key === 'settings.address') return 'Hotel Address';
      if (key === 'settings.timings') return 'Check-in / Check-out Times';
      if (key === 'settings.logo') return 'Hotel Brand Logo';
      if (key.startsWith('rooms.')) {
        const parts = key.split('.');
        const idx = parseInt(parts[1], 10) + 1;
        const sub = parts[2] || '';
        if (sub === 'image') return `Room #${idx} Main Photo`;
        if (sub === 'title') return `Room #${idx} Title`;
        if (sub === 'desc') return `Room #${idx} Description`;
        if (sub === 'bed') return `Room #${idx} Bed Specs`;
        if (sub === 'bath') return `Room #${idx} Attached Bath`;
        if (sub === 'tag') return `Room #${idx} Badge Tag`;
        if (sub === 'capacity') return `Room #${idx} Capacity`;
        return `Room #${idx} Card`;
      }
      if (key.startsWith('banquets.')) {
        const parts = key.split('.');
        const idx = parseInt(parts[1], 10) + 1;
        const sub = parts[2] || '';
        if (sub === 'image') return `Venue #${idx} Main Photo`;
        if (sub === 'secondaryImage') return `Venue #${idx} Setup Photo`;
        if (sub === 'title') return `Venue #${idx} Title`;
        if (sub === 'desc') return `Venue #${idx} Description`;
        if (sub === 'capacity') return `Venue #${idx} Capacity`;
        if (sub === 'bestFor') return `Venue #${idx} Best For`;
        return `Venue #${idx} Card`;
      }
      if (key.startsWith('guide.')) {
        const parts = key.split('.');
        const idx = parseInt(parts[1], 10) + 1;
        const sub = parts[2] || '';
        if (sub === 'name') return `Landmark #${idx} Name`;
        if (sub === 'distance') return `Landmark #${idx} Distance`;
        if (sub === 'desc') return `Landmark #${idx} Description`;
        return `Landmark #${idx}`;
      }
      if (key.startsWith('faqs.')) {
        const parts = key.split('.');
        const idx = parseInt(parts[1], 10) + 1;
        const sub = parts[2] || '';
        if (sub === 'q') return `FAQ #${idx} Question`;
        if (sub === 'a') return `FAQ #${idx} Answer`;
        return `FAQ #${idx}`;
      }
      if (key.startsWith('experience.')) {
        const parts = key.split('.');
        const idx = parseInt(parts[1], 10) + 1;
        return `Amenity Feature #${idx}`;
      }
      return key;
    };

    // Hover handler for smart connector tooltip
    const handleMouseOver = (e) => {
      if (!isInsideIframe || !tooltipEl) return;
      const targetEl = e.target.closest('[data-cms-target]');
      if (targetEl) {
        const targetKey = targetEl.getAttribute('data-cms-target');
        const label = formatTargetLabel(targetKey);
        const rect = targetEl.getBoundingClientRect();

        tooltipEl.querySelector('.cms-tooltip-text').textContent = `Double-click to edit ${label}`;
        tooltipEl.style.display = 'flex';
        
        // Position smoothly relative to window
        let topPos = rect.top + window.scrollY - 32;
        if (topPos < window.scrollY + 10) topPos = rect.top + window.scrollY + 10;
        let leftPos = rect.left + window.scrollX + 10;
        if (leftPos + 220 > window.innerWidth) leftPos = window.innerWidth - 230;

        tooltipEl.style.top = `${topPos}px`;
        tooltipEl.style.left = `${leftPos}px`;

        targetEl.classList.add('cms-hover-highlight');
      }
    };

    const handleMouseOut = (e) => {
      if (!isInsideIframe || !tooltipEl) return;
      const targetEl = e.target.closest('[data-cms-target]');
      if (targetEl) {
        targetEl.classList.remove('cms-hover-highlight');
      }
      if (!e.relatedTarget || !e.relatedTarget.closest('[data-cms-target]')) {
        tooltipEl.style.display = 'none';
      }
    };

    // Listen for live preview postMessage events from the Admin CMS editor
    const handleMessage = (event) => {
      if (!event.data) return;

      if (event.data.type === 'SWASTIKA_PREVIEW_SYNC') {
        setIsLivePreview(true);
        if (event.data.payload) {
          setContent((prev) => ({
            ...prev,
            ...event.data.payload
          }));
        }
      }

      // 1. Element-level Focus & Highlight from Editor Form Fields
      if (event.data.type === 'SWASTIKA_FOCUS_ELEMENT') {
        const { targetKey, isImage } = event.data;
        if (!targetKey) return;

        // Clear all previous element highlights and radar pings
        document.querySelectorAll('.cms-active-text-glow, .cms-active-image-squircle, .cms-radar-ping').forEach((el) => {
          el.classList.remove('cms-active-text-glow', 'cms-active-image-squircle', 'cms-radar-ping');
        });

        // Search for exact targetKey or fallback prefix
        let el = document.querySelector(`[data-cms-target="${targetKey}"]`);
        if (!el) {
          const parts = targetKey.split('.');
          if (parts.length > 2) {
            el = document.querySelector(`[data-cms-target="${parts[0]}.${parts[1]}"]`);
          }
        }

        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });

          // Radar Ping Wave
          el.classList.add('cms-radar-ping');
          setTimeout(() => el.classList.remove('cms-radar-ping'), 2400);

          const isImgEl = isImage || el.tagName === 'IMG' || !!el.querySelector('img');
          if (isImgEl) {
            const imgTarget = el.tagName === 'IMG' ? el : (el.querySelector('img') || el);
            imgTarget.classList.add('cms-active-image-squircle');
          } else {
            el.classList.add('cms-active-text-glow');
          }
        }
      }

      // 2. Clear Element Highlights on Blur
      if (event.data.type === 'SWASTIKA_BLUR_ELEMENT') {
        document.querySelectorAll('.cms-active-text-glow, .cms-active-image-squircle').forEach((el) => {
          el.classList.remove('cms-active-text-glow', 'cms-active-image-squircle');
        });
      }

      // 3. Section-level smooth scroll
      if (event.data.type === 'SWASTIKA_SCROLL_TO_SECTION') {
        const sectionMap = {
          hero: 'hero',
          rooms: 'rooms',
          banquets: 'banquets',
          experience: 'experience',
          guide: 'ayodhya',
          faqs: 'faqs',
          settings: 'contact'
        };
        const elId = sectionMap[event.data.section] || event.data.section;
        const target = document.getElementById(elId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          target.classList.remove('cms-highlight-focus');
          void target.offsetWidth;
          target.classList.add('cms-highlight-focus');
          setTimeout(() => target.classList.remove('cms-highlight-focus'), 1800);
        }
      }
    };

    // Double-click handler inside preview to navigate CMS editor to that exact element & tab
    const handleDblClick = (e) => {
      if (window.self === window.top) return;

      const targetEl = e.target.closest('[data-cms-target]');
      if (targetEl) {
        const targetKey = targetEl.getAttribute('data-cms-target');
        const isImage = targetEl.tagName === 'IMG' || !!targetEl.querySelector('img') || targetEl.classList.contains('room-img') || targetEl.classList.contains('venue-img-main');

        let sectionKey = 'hero';
        if (targetKey.startsWith('rooms')) sectionKey = 'rooms';
        else if (targetKey.startsWith('banquets')) sectionKey = 'banquets';
        else if (targetKey.startsWith('experience')) sectionKey = 'experience';
        else if (targetKey.startsWith('guide')) sectionKey = 'guide';
        else if (targetKey.startsWith('faqs')) sectionKey = 'faqs';
        else if (targetKey.startsWith('settings')) sectionKey = 'settings';

        if (window.parent) {
          window.parent.postMessage({
            type: 'SWASTIKA_NAVIGATE_TO_ELEMENT',
            targetKey,
            sectionKey,
            isImage
          }, '*');
          return;
        }
      }

      // Fallback: section container double-click
      const closestSection = e.target.closest('#hero, #rooms, #banquets, #experience, #ayodhya, #faqs, #contact');
      if (!closestSection) return;

      const id = closestSection.id;
      const idToSection = {
        'hero': 'hero',
        'rooms': 'rooms',
        'banquets': 'banquets',
        'experience': 'experience',
        'ayodhya': 'guide',
        'faqs': 'faqs',
        'contact': 'settings'
      };

      const sectionKey = idToSection[id];
      if (sectionKey && window.parent) {
        window.parent.postMessage({
          type: 'SWASTIKA_NAVIGATE_TO_ELEMENT',
          targetKey: sectionKey,
          sectionKey,
          isImage: false
        }, '*');
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('dblclick', handleDblClick);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('dblclick', handleDblClick);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (tooltipEl && tooltipEl.parentNode) {
        tooltipEl.parentNode.removeChild(tooltipEl);
      }
    };
  }, [fetchLiveContent]);

  return (
    <HotelContext.Provider value={{ content, isLoading, isLivePreview, refreshContent: fetchLiveContent }}>
      {children}
      <style>{`
        /* Floating Inspector Tooltip */
        .cms-floating-tooltip {
          position: absolute;
          z-index: 999999;
          display: none;
          align-items: center;
          gap: 6px;
          background: rgba(22, 17, 10, 0.95);
          color: #fce594;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 9999px;
          border: 1px solid rgba(245, 196, 67, 0.6);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), 0 0 12px rgba(245, 196, 67, 0.35);
          pointer-events: none;
          white-space: nowrap;
          backdrop-filter: blur(8px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          animation: tooltipAppear 0.2s ease-out;
        }

        .cms-tooltip-icon {
          color: #ffd768;
          font-size: 12px;
        }

        @keyframes tooltipAppear {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Subtle Hover Outline in Preview */
        .cms-hover-highlight {
          outline: 2px dashed rgba(245, 196, 67, 0.65) !important;
          outline-offset: 3px !important;
          cursor: pointer !important;
          transition: outline 0.15s ease !important;
        }

        /* Active Text Editing Glow */
        .cms-active-image-squircle {
          border-radius: 22px !important;
          outline: 4px solid #f5c443 !important;
          outline-offset: 4px !important;
          box-shadow: 0 0 35px rgba(245, 196, 67, 0.8), 0 12px 32px rgba(0, 0, 0, 0.35) !important;
          transform: scale(1.025) !important;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
          animation: cmsPulseSquircle 1.5s infinite alternate ease-in-out !important;
        }

        @keyframes cmsPulseSquircle {
          0% {
            outline-color: #f5c443;
            box-shadow: 0 0 20px rgba(245, 196, 67, 0.5), 0 10px 25px rgba(0,0,0,0.3);
            transform: scale(1.018);
          }
          100% {
            outline-color: #ffe699;
            box-shadow: 0 0 45px rgba(245, 196, 67, 0.9), 0 16px 36px rgba(0,0,0,0.4);
            transform: scale(1.032);
          }
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
