import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Phone, Users, Home, CheckCircle2 } from 'lucide-react';
import { HOTEL_INFO, ROOMS_DATA, BANQUET_DATA } from '../data/hotelData';

export default function BookingModal({ isOpen, onClose, initialData = {} }) {
  const [bookingType, setBookingType] = useState('room');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    roomId: ROOMS_DATA[0]?.id || '',
    eventVenue: BANQUET_DATA[0]?.title || '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData?.roomId) {
      setFormData((prev) => ({ ...prev, roomId: initialData.roomId }));
      setBookingType('room');
    } else if (initialData?.eventVenue) {
      setFormData((prev) => ({ ...prev, eventVenue: initialData.eventVenue }));
      setBookingType('event');
    }
    if (initialData?.checkIn) {
      setFormData((prev) => ({ ...prev, checkIn: initialData.checkIn }));
    }
    if (initialData?.checkOut) {
      setFormData((prev) => ({ ...prev, checkOut: initialData.checkOut }));
    }
    if (initialData?.guests) {
      setFormData((prev) => ({ ...prev, guests: initialData.guests }));
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getSelectedRoomTitle = () => {
    const found = ROOMS_DATA.find((r) => r.id === formData.roomId);
    return found ? found.title : formData.roomId;
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please provide your name and contact phone number.');
      return;
    }

    let message = '';
    if (bookingType === 'room') {
      message = `*New Room Inquiry - Hotel Swastika Inn*\n` +
        `• Name: ${formData.name}\n` +
        `• Phone: ${formData.phone}\n` +
        `• Accommodation: ${getSelectedRoomTitle()}\n` +
        `• Check-In: ${formData.checkIn || 'To be decided'}\n` +
        `• Check-Out: ${formData.checkOut || 'To be decided'}\n` +
        `• Guests: ${formData.guests}\n` +
        (formData.notes ? `• Special Requests: ${formData.notes}\n` : '') +
        `\nPlease let me know the availability and tariff. Thank you!`;
    } else {
      message = `*New Banquet & Lawn Inquiry - Hotel Swastika Inn*\n` +
        `• Name: ${formData.name}\n` +
        `• Phone: ${formData.phone}\n` +
        `• Venue: ${formData.eventVenue}\n` +
        `• Event Date: ${formData.checkIn || 'To be decided'}\n` +
        `• Expected Guests: ${formData.guests}\n` +
        (formData.notes ? `• Event Details: ${formData.notes}\n` : '') +
        `\nPlease share pricing, catering options, and availability. Thank you!`;
    }

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${HOTEL_INFO.whatsappNumber}?text=${encoded}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="booking-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {submitted ? (
          <div className="booking-success-view">
            <div className="success-icon-box">
              <CheckCircle2 size={48} className="success-icon" />
            </div>
            <h3 className="success-title">Inquiry Forwarded Successfully!</h3>
            <p className="success-text">
              Your inquiry has been generated for <strong>Hotel Swastika Inn</strong>. If WhatsApp did not open automatically, you can call us directly below:
            </p>
            <div className="success-contact-buttons">
              <a href={`tel:${HOTEL_INFO.phonePrimary}`} className="btn btn-primary">
                <Phone size={16} />
                <span>Call {HOTEL_INFO.phoneDisplayPrimary}</span>
              </a>
              <button 
                onClick={() => setSubmitted(false)} 
                className="btn btn-secondary"
              >
                Send Another Inquiry
              </button>
            </div>
          </div>
        ) : (
          <div className="booking-form-wrapper">
            <div className="modal-header-block">
              <span className="modal-pretitle">Direct Booking &amp; Inquiries</span>
              <h3 className="booking-modal-title">
                Reserve at <span>Hotel Swastika Inn</span>
              </h3>
              <p className="booking-modal-subtitle">
                Best rate guaranteed directly with hotel reception. No hidden commissions.
              </p>

              {/* Type Switcher */}
              <div className="type-switcher">
                <button
                  type="button"
                  className={`type-btn ${bookingType === 'room' ? 'active' : ''}`}
                  onClick={() => setBookingType('room')}
                >
                  <Home size={15} />
                  <span>Room Stay</span>
                </button>
                <button
                  type="button"
                  className={`type-btn ${bookingType === 'event' ? 'active' : ''}`}
                  onClick={() => setBookingType('event')}
                >
                  <Users size={15} />
                  <span>Banquet &amp; Lawn Event</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleWhatsAppSubmit} className="booking-form-body">
              {/* Name & Phone */}
              <div className="form-row-2">
                <div className="input-group">
                  <label>Your Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label>Contact Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Selection: Room or Venue */}
              {bookingType === 'room' ? (
                <div className="input-group">
                  <label>Select Preferred Room Category</label>
                  <select
                    name="roomId"
                    value={formData.roomId}
                    onChange={handleChange}
                  >
                    {ROOMS_DATA.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title} ({r.capacity})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="input-group">
                  <label>Select Preferred Celebration Space</label>
                  <select
                    name="eventVenue"
                    value={formData.eventVenue}
                    onChange={handleChange}
                  >
                    {BANQUET_DATA.map((v) => (
                      <option key={v.id} value={v.title}>
                        {v.title} ({v.capacity})
                      </option>
                    ))}
                    <option value="Full Hotel & Lawn Booking">Full Hotel + Lawn + Banquet Package</option>
                  </select>
                </div>
              )}

              {/* Dates & Guests */}
              <div className="form-row-3">
                <div className="input-group">
                  <label>{bookingType === 'room' ? 'Check-in Date' : 'Event Date'}</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                  />
                </div>
                {bookingType === 'room' && (
                  <div className="input-group">
                    <label>Check-out Date</label>
                    <input
                      type="date"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleChange}
                    />
                  </div>
                )}
                <div className="input-group">
                  <label>Total Guests</label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3">3 People</option>
                    <option value="4+">4+ Family</option>
                    <option value="50-100">50 – 100 (Event)</option>
                    <option value="100-300">100 – 300 (Event)</option>
                    <option value="300+">300+ (Grand Wedding)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="input-group">
                <label>Additional Notes / Special Requests (Optional)</label>
                <textarea
                  name="notes"
                  rows="2"
                  placeholder="Need early check-in, temple darshan advice, or catering preferences..."
                  value={formData.notes}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Submit Buttons */}
              <div className="modal-cta-row">
                <button type="submit" className="btn btn-whatsapp submit-wa-btn">
                  <MessageCircle size={18} />
                  <span>Send Inquiry via WhatsApp</span>
                </button>

                <a 
                  href={`tel:${HOTEL_INFO.phonePrimary}`} 
                  className="btn btn-secondary direct-call-btn"
                >
                  <Phone size={16} />
                  <span>Instant Call: {HOTEL_INFO.phoneDisplayPrimary}</span>
                </a>
              </div>
            </form>
          </div>
        )}
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 2500;
          background: rgba(4, 7, 13, 0.85);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          overflow-y: auto;
        }
        .booking-modal-box {
          position: relative;
          background: #fdfbf7;
          border: 1.5px solid rgba(184, 138, 36, 0.4);
          border-radius: var(--radius-lg);
          max-width: 640px;
          width: 100%;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(45, 28, 12, 0.35);
          animation: modalAppear 0.25s ease-out;
        }
        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 10;
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
        }
        .booking-form-wrapper {
          padding: 2.25rem;
        }
        .modal-header-block {
          text-align: center;
          margin-bottom: 1.75rem;
        }
        .modal-pretitle {
          font-size: 0.775rem;
          font-weight: 700;
          color: var(--gold-dark);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.35rem;
          display: block;
        }
        .booking-modal-title {
          font-family: var(--font-serif);
          font-size: 1.95rem;
          color: var(--text-primary);
          margin-bottom: 0.4rem;
        }
        .booking-modal-title span {
          background: linear-gradient(135deg, #a87915 0%, #c59b27 50%, #91680d 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .booking-modal-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .type-switcher {
          display: flex;
          background: #f4eee7;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 4px;
          gap: 4px;
          margin-top: 1.25rem;
        }
        .type-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.65rem;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }
        .type-btn.active {
          background: var(--gold-primary);
          color: #1a140b;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(184, 138, 36, 0.25);
        }

        .booking-form-body {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-row-3 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 1rem;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          text-align: left;
        }
        .input-group label {
          font-size: 0.775rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .input-group input,
        .input-group select,
        .input-group textarea {
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
        .input-group input:focus,
        .input-group select:focus,
        .input-group textarea:focus {
          border-color: var(--gold-primary);
          box-shadow: 0 0 0 3px rgba(184, 138, 36, 0.2);
        }
        .input-group select option {
          background: #ffffff;
          color: var(--text-primary);
        }
        .modal-cta-row {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
        .submit-wa-btn {
          width: 100%;
          padding: 0.9rem;
          font-size: 0.95rem;
        }
        .direct-call-btn {
          width: 100%;
          padding: 0.8rem;
          font-size: 0.875rem;
        }

        .booking-success-view {
          padding: 3.5rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .success-icon-box {
          width: 72px;
          height: 72px;
          border-radius: var(--radius-full);
          background: rgba(37, 211, 102, 0.15);
          border: 1px solid rgba(37, 211, 102, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }
        .success-icon {
          color: #25d366;
        }
        .success-title {
          font-family: var(--font-serif);
          font-size: 1.85rem;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
        }
        .success-text {
          font-size: 0.95rem;
          color: var(--text-secondary);
          max-width: 440px;
          margin-bottom: 2rem;
          line-height: 1.5;
        }
        .success-contact-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
          max-width: 320px;
        }

        @media (max-width: 600px) {
          .booking-form-wrapper {
            padding: 1.75rem 1.25rem;
          }
          .form-row-2 {
            grid-template-columns: 1fr;
          }
          .booking-modal-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
