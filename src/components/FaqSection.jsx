import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, MessageCircle } from 'lucide-react';
import { useHotelContent } from '../context/HotelContext';
import { HOTEL_FAQS, HOTEL_INFO } from '../data/hotelData';

export default function FaqSection() {
  const { content } = useHotelContent();
  const faqsList = content?.faqs || HOTEL_FAQS;
  const hotelInfo = content?.settings || HOTEL_INFO;

  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faqs" className="faq-section" aria-label="Frequently Asked Questions">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="section-tag">
            <HelpCircle size={15} />
            <span>Got Questions?</span>
          </div>
          <h2 className="section-title">
            Frequently Asked <span className="gold-text">Questions</span>
          </h2>
          <p className="section-subtitle">
            Everything you need to know about staying, dining, and celebrating at Hotel Swastika Inn in Ayodhya Dham.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="faq-list-wrapper">
          {faqsList.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className={`faq-card ${isOpen ? 'active' : ''}`}
                data-cms-target={`faqs.${idx}`}
              >
                <button
                  className="faq-question-btn"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-btn-${idx}`}
                >
                  <span className="faq-q-text" data-cms-target={`faqs.${idx}.q`}>{faq.question}</span>
                  <span className={`faq-chevron-icon ${isOpen ? 'rotate' : ''}`}>
                    <ChevronDown size={20} />
                  </span>
                </button>

                <div
                  id={`faq-answer-${idx}`}
                  role="region"
                  aria-labelledby={`faq-btn-${idx}`}
                  className="faq-answer-collapse"
                  style={{
                    maxHeight: isOpen ? '240px' : '0px',
                    opacity: isOpen ? 1 : 0
                  }}
                >
                  <div className="faq-answer-inner">
                    <p data-cms-target={`faqs.${idx}.a`}>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Still Have Questions CTA */}
        <div className="faq-cta-banner">
          <div className="faq-cta-text">
            <h3>Have a specific question about your Ayodhya visit?</h3>
            <p>Our front desk team is available 24/7 to assist with room bookings, wedding lawn dates, and temple visit guidance.</p>
          </div>
          <div className="faq-cta-actions">
            <a 
              href={`tel:${hotelInfo.phonePrimary}`} 
              className="faq-action-btn phone-btn"
            >
              <Phone size={16} />
              <span>Call Us Directly</span>
            </a>
            <a 
              href={`https://wa.me/${hotelInfo.whatsappNumber}?text=Namaste!%20I%20have%20a%20question%20about%20Hotel%20Swastika%20Inn.`}
              target="_blank"
              rel="noopener noreferrer"
              className="faq-action-btn wa-btn"
            >
              <MessageCircle size={16} />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .faq-section {
          padding: 6rem 1.5rem;
          background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-base) 100%);
          position: relative;
        }

        .faq-list-wrapper {
          max-width: 860px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .faq-card {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }

        .faq-card:hover {
          border-color: var(--border-gold);
          box-shadow: var(--shadow-md);
        }

        .faq-card.active {
          border-color: var(--gold-primary);
          box-shadow: 0 8px 24px rgba(184, 138, 36, 0.12);
        }

        .faq-question-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          font-family: var(--font-sans);
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
          transition: color 0.2s ease;
        }

        .faq-card.active .faq-question-btn {
          color: var(--gold-primary);
        }

        .faq-chevron-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background: var(--bg-warm-tint);
          color: var(--gold-dark);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s;
          flex-shrink: 0;
        }

        .faq-chevron-icon.rotate {
          transform: rotate(180deg);
          background: var(--gold-primary);
          color: #ffffff;
        }

        .faq-answer-collapse {
          overflow: hidden;
          transition: max-height 0.35s ease, opacity 0.3s ease;
        }

        .faq-answer-inner {
          padding: 0 1.5rem 1.35rem 1.5rem;
          border-top: 1px dashed rgba(184, 138, 36, 0.15);
          padding-top: 1rem;
        }

        .faq-answer-inner p {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin: 0;
        }

        /* FAQ CTA Banner */
        .faq-cta-banner {
          max-width: 860px;
          margin: 3.5rem auto 0;
          background: linear-gradient(135deg, #2a1f14 0%, #1e150d 100%);
          color: #ffffff;
          padding: 2.25rem;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          border: 1px solid rgba(197, 155, 39, 0.3);
          box-shadow: var(--shadow-lg);
        }

        .faq-cta-text h3 {
          color: #ffffff;
          font-size: 1.25rem;
          font-family: var(--font-serif);
          margin-bottom: 0.5rem;
        }

        .faq-cta-text p {
          color: rgba(255, 255, 255, 0.75);
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0;
        }

        .faq-cta-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          min-width: 220px;
        }

        .faq-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-full);
          font-weight: 600;
          font-size: 0.88rem;
          text-decoration: none;
          transition: var(--transition);
        }

        .phone-btn {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .phone-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: #ffffff;
        }

        .wa-btn {
          background: #25d366;
          color: #ffffff;
          border: 1px solid transparent;
        }

        .wa-btn:hover {
          background: #20ba59;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(37, 211, 102, 0.35);
        }

        @media (max-width: 768px) {
          .faq-section {
            padding: 4rem 1rem;
          }

          .faq-cta-banner {
            flex-direction: column;
            text-align: center;
            padding: 1.75rem 1.25rem;
          }

          .faq-cta-actions {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
