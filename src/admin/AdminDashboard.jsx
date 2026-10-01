import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Save, 
  Upload, 
  RotateCcw, 
  Smartphone, 
  Tablet, 
  Monitor, 
  LogOut, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Sparkles,
  Bed,
  Home,
  Settings,
  HelpCircle,
  MapPin
} from 'lucide-react';

export default function AdminDashboard({ onClose }) {
  const [token, setToken] = useState(() => localStorage.getItem('swastika_admin_token') || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // CMS State
  const [activeSection, setActiveSection] = useState('hero');
  const [draftData, setDraftData] = useState(null);
  const [liveStatus, setLiveStatus] = useState({ hasUnpublishedChanges: false });
  const [isPublishing, setIsPublishing] = useState(false);
  const [saveNotice, setSaveNotice] = useState('');
  const [previewDevice, setPreviewDevice] = useState('desktop'); // desktop, tablet, mobile
  const [isUploading, setIsUploading] = useState(false);

  const iframeRef = useRef(null);

  // Sync draft data to the preview iframe via postMessage
  const broadcastToPreview = useCallback((data) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'SWASTIKA_PREVIEW_SYNC', payload: data },
        '*'
      );
    }
  }, []);

  // Fetch draft data from server
  const fetchDraft = useCallback(async (authToken) => {
    try {
      const res = await fetch('/api/admin/draft', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const json = await res.json();
        setDraftData(json.draft);
        setLiveStatus(json.status || {});
        broadcastToPreview(json.draft);
      } else if (res.status === 401) {
        setToken('');
        localStorage.removeItem('swastika_admin_token');
      }
    } catch (err) {
      console.error('Failed to load draft:', err);
    }
  }, [broadcastToPreview]);

  useEffect(() => {
    if (token) {
      fetchDraft(token);
    }
  }, [token, fetchDraft]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const json = await res.json();
      if (res.ok && json.token) {
        setToken(json.token);
        localStorage.setItem('swastika_admin_token', json.token);
        fetchDraft(json.token);
      } else {
        setAuthError(json.error || 'Incorrect password');
      }
    } catch {
      setAuthError('Could not reach backend server at /api/auth/login');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('swastika_admin_token');
  };

  // Update Draft Local & Remote
  const updateDraft = (updater) => {
    setDraftData((prev) => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      broadcastToPreview(updated);
      setLiveStatus({ hasUnpublishedChanges: true });
      return updated;
    });
  };

  // Image upload handler
  const handleImageUpload = async (e, onComplete) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'swastika-inn');

    try {
      setIsUploading(true);
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const json = await res.json();
      if (res.ok && json.url) {
        onComplete(json.url);
        setSaveNotice('Image uploaded and synced to preview!');
        setTimeout(() => setSaveNotice(''), 3000);
      } else {
        alert(json.error || 'Image upload failed');
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Publish to Live
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // First autosave current draft to backend
      await fetch('/api/admin/draft', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(draftData)
      });

      // Now publish
      const res = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok) {
        setLiveStatus({ hasUnpublishedChanges: false });
        setSaveNotice('✅ Successfully published all changes to the live site!');
        setTimeout(() => setSaveNotice(''), 4000);
      } else {
        alert(json.error || 'Failed to publish');
      }
    } catch (err) {
      alert('Network error publishing changes: ' + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  // Discard Draft
  const handleDiscard = async () => {
    if (!confirm('Discard all unsaved edits and revert back to live content?')) return;
    try {
      const res = await fetch('/api/admin/discard', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok && json.draft) {
        setDraftData(json.draft);
        broadcastToPreview(json.draft);
        setLiveStatus({ hasUnpublishedChanges: false });
        setSaveNotice('Reverted to current live content.');
        setTimeout(() => setSaveNotice(''), 3000);
      }
    } catch (err) {
      alert('Error discarding draft: ' + err.message);
    }
  };

  // Render Login Screen if unauthenticated
  if (!token) {
    return (
      <div className="admin-login-overlay">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="login-icon-box">
              <Lock size={26} />
            </div>
            <h2>Hotel Swastika Inn CMS</h2>
            <p>Enter the administrator password to edit site content, replace photos, and manage suites.</p>
          </div>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label>Manager Password</label>
              <input 
                type="password" 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                placeholder="Default: swastika2026"
                required
                autoFocus
              />
            </div>

            {authError && <div className="login-error-msg">{authError}</div>}

            <button type="submit" disabled={isLoggingIn} className="login-submit-btn">
              {isLoggingIn ? 'Verifying...' : 'Access Admin Dashboard'}
            </button>
          </form>

          {onClose && (
            <button onClick={onClose} className="login-cancel-btn">
              Return to Website
            </button>
          )}
        </div>

        <style>{`
          .admin-login-overlay {
            position: fixed;
            inset: 0;
            z-index: 999999;
            background: rgba(18, 14, 10, 0.88);
            backdrop-filter: blur(12px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
          }
          .admin-login-card {
            background: #ffffff;
            border-radius: var(--radius-lg);
            max-width: 440px;
            width: 100%;
            padding: 2.5rem;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
            border: 1px solid rgba(197, 155, 39, 0.3);
            text-align: center;
          }
          .login-icon-box {
            width: 60px;
            height: 60px;
            background: var(--gold-subtle);
            color: var(--gold-dark);
            border-radius: 9999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
          }
          .admin-login-header h2 {
            font-size: 1.5rem;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
          }
          .admin-login-header p {
            font-size: 0.9rem;
            color: var(--text-muted);
            line-height: 1.5;
            margin-bottom: 1.75rem;
          }
          .admin-login-form .form-group {
            text-align: left;
            margin-bottom: 1.25rem;
          }
          .admin-login-form label {
            display: block;
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-secondary);
            margin-bottom: 0.4rem;
          }
          .admin-login-form input {
            width: 100%;
            padding: 0.8rem 1rem;
            border: 1.5px solid var(--border-subtle);
            border-radius: var(--radius-sm);
            font-size: 1rem;
            transition: border-color 0.2s;
          }
          .admin-login-form input:focus {
            outline: none;
            border-color: var(--gold-primary);
          }
          .login-error-msg {
            color: #dc2626;
            font-size: 0.85rem;
            font-weight: 600;
            margin-bottom: 1rem;
          }
          .login-submit-btn {
            width: 100%;
            padding: 0.9rem;
            background: var(--gold-gradient);
            color: #1a140b;
            font-weight: 700;
            font-size: 0.95rem;
            border: none;
            border-radius: var(--radius-sm);
            cursor: pointer;
            transition: var(--transition);
          }
          .login-submit-btn:hover {
            opacity: 0.92;
            transform: translateY(-1px);
          }
          .login-cancel-btn {
            background: none;
            border: none;
            color: var(--text-muted);
            font-size: 0.85rem;
            margin-top: 1rem;
            cursor: pointer;
            text-decoration: underline;
          }
        `}</style>
      </div>
    );
  }

  if (!draftData) {
    return (
      <div className="admin-loading-screen">
        <Sparkles className="spin-icon" size={32} />
        <p>Loading Hotel Content Manager &amp; Live Studio...</p>
      </div>
    );
  }

  return (
    <div className="admin-studio-container">
      {/* Top Studio Control Bar */}
      <header className="admin-top-bar">
        <div className="top-bar-left">
          <span className="studio-brand">Swastika Inn Studio</span>
          {liveStatus.hasUnpublishedChanges ? (
            <span className="status-badge status-draft">
              <AlertCircle size={14} /> Unsaved Draft Changes
            </span>
          ) : (
            <span className="status-badge status-live">
              <CheckCircle2 size={14} /> All Content Live
            </span>
          )}
          {saveNotice && <span className="save-notice-text">{saveNotice}</span>}
        </div>

        {/* Viewport Toggles for Preview */}
        <div className="preview-device-selector">
          <button 
            className={`device-btn ${previewDevice === 'desktop' ? 'active' : ''}`}
            onClick={() => setPreviewDevice('desktop')}
            title="Desktop View (100%)"
          >
            <Monitor size={16} />
          </button>
          <button 
            className={`device-btn ${previewDevice === 'tablet' ? 'active' : ''}`}
            onClick={() => setPreviewDevice('tablet')}
            title="Tablet View (768px)"
          >
            <Tablet size={16} />
          </button>
          <button 
            className={`device-btn ${previewDevice === 'mobile' ? 'active' : ''}`}
            onClick={() => setPreviewDevice('mobile')}
            title="Mobile View (375px)"
          >
            <Smartphone size={16} />
          </button>
        </div>

        {/* Action Controls */}
        <div className="top-bar-actions">
          {liveStatus.hasUnpublishedChanges && (
            <button onClick={handleDiscard} className="btn-secondary" title="Revert to published state">
              <RotateCcw size={15} />
              <span>Discard</span>
            </button>
          )}

          <button 
            onClick={handlePublish} 
            disabled={isPublishing} 
            className="btn-primary-publish"
          >
            <Save size={16} />
            <span>{isPublishing ? 'Publishing...' : 'Publish Changes'}</span>
          </button>

          <button onClick={handleLogout} className="btn-icon" title="Logout">
            <LogOut size={16} />
          </button>

          {onClose && (
            <button onClick={onClose} className="btn-close-studio" title="Exit Studio">
              ✕
            </button>
          )}
        </div>
      </header>

      {/* Main Split-Screen Canvas */}
      <div className="admin-split-canvas">
        {/* Left Side: CMS Form Controls */}
        <aside className="admin-sidebar-editor">
          {/* Section Selector Tabs */}
          <nav className="editor-nav-tabs">
            <button 
              className={`nav-tab ${activeSection === 'hero' ? 'active' : ''}`}
              onClick={() => setActiveSection('hero')}
            >
              <Sparkles size={16} />
              <span>Hero Banner</span>
            </button>
            <button 
              className={`nav-tab ${activeSection === 'rooms' ? 'active' : ''}`}
              onClick={() => setActiveSection('rooms')}
            >
              <Bed size={16} />
              <span>Rooms ({draftData.rooms?.length || 0})</span>
            </button>
            <button 
              className={`nav-tab ${activeSection === 'banquets' ? 'active' : ''}`}
              onClick={() => setActiveSection('banquets')}
            >
              <Home size={16} />
              <span>Banquets &amp; Lawn</span>
            </button>
            <button 
              className={`nav-tab ${activeSection === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveSection('settings')}
            >
              <Settings size={16} />
              <span>Contact &amp; Info</span>
            </button>
            <button 
              className={`nav-tab ${activeSection === 'guide' ? 'active' : ''}`}
              onClick={() => setActiveSection('guide')}
            >
              <MapPin size={16} />
              <span>Ayodhya Guide</span>
            </button>
            <button 
              className={`nav-tab ${activeSection === 'faqs' ? 'active' : ''}`}
              onClick={() => setActiveSection('faqs')}
            >
              <HelpCircle size={16} />
              <span>FAQs</span>
            </button>
          </nav>

          {/* Form Content Area */}
          <div className="editor-form-scroll">
            {/* 1. HERO SECTION FORM */}
            {activeSection === 'hero' && (
              <div className="section-form-block">
                <h3>Hero Banner Configuration</h3>
                <p className="form-helper">Controls the main welcome hero section on the homepage.</p>

                <div className="input-field">
                  <label>Golden Tagline Badge</label>
                  <input 
                    type="text" 
                    value={draftData.hero?.badge || ''} 
                    onChange={(e) => updateDraft(prev => ({
                      ...prev,
                      hero: { ...prev.hero, badge: e.target.value }
                    }))}
                  />
                </div>

                <div className="input-row">
                  <div className="input-field">
                    <label>Title Prefix (White)</label>
                    <input 
                      type="text" 
                      value={draftData.hero?.titlePrefix || ''} 
                      onChange={(e) => updateDraft(prev => ({
                        ...prev,
                        hero: { ...prev.hero, titlePrefix: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="input-field">
                    <label>Title Suffix (Gold)</label>
                    <input 
                      type="text" 
                      value={draftData.hero?.titleSuffix || ''} 
                      onChange={(e) => updateDraft(prev => ({
                        ...prev,
                        hero: { ...prev.hero, titleSuffix: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div className="input-field">
                  <label>Hero Description</label>
                  <textarea 
                    rows={3} 
                    value={draftData.hero?.description || ''} 
                    onChange={(e) => updateDraft(prev => ({
                      ...prev,
                      hero: { ...prev.hero, description: e.target.value }
                    }))}
                  />
                </div>

                {/* Hero Background Image */}
                <div className="input-field">
                  <label>Hero Background Night Facade Image</label>
                  <div className="image-preview-picker">
                    <img 
                      src={draftData.hero?.backgroundImage || '/images/hero-facade-night.jpeg'} 
                      alt="Hero Facade" 
                      className="picker-thumb"
                    />
                    <div className="picker-controls">
                      <input 
                        type="text" 
                        value={draftData.hero?.backgroundImage || ''} 
                        onChange={(e) => updateDraft(prev => ({
                          ...prev,
                          hero: { ...prev.hero, backgroundImage: e.target.value }
                        }))}
                        placeholder="Image URL or /images/..."
                      />
                      <label className="upload-file-btn">
                        <Upload size={14} />
                        <span>Upload New Photo</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleImageUpload(e, (url) => {
                            updateDraft(prev => ({
                              ...prev,
                              hero: { ...prev.hero, backgroundImage: url }
                            }));
                          })}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ROOMS & SUITES FORM */}
            {activeSection === 'rooms' && (
              <div className="section-form-block">
                <div className="block-title-row">
                  <h3>Guest Suites &amp; Rooms ({draftData.rooms?.length})</h3>
                  <button 
                    className="add-item-btn"
                    onClick={() => {
                      const newRoom = {
                        id: `room-${Date.now()}`,
                        title: 'New Luxury Suite',
                        category: 'Suites',
                        tag: 'Newly Added',
                        heroImage: '/images/room-executive-king.jpeg',
                        gallery: ['/images/room-executive-king.jpeg', '/images/bathroom-modern.jpeg'],
                        bedType: '1 King Size Bed',
                        capacity: '2 Adults',
                        size: '300 sq. ft.',
                        description: 'Spacious suite with attached western bathroom and modern amenities.',
                        highlights: ['King Bed', 'Attached Western Bath with Geyser', 'Split AC'],
                        bathroom: {
                          image: '/images/bathroom-modern.jpeg',
                          type: 'Attached Western Bath',
                          features: 'Geyser, shower, sanitized toilet'
                        }
                      };
                      updateDraft(prev => ({ ...prev, rooms: [...prev.rooms, newRoom] }));
                    }}
                  >
                    <Plus size={15} /> Add New Room
                  </button>
                </div>

                {draftData.rooms?.map((room, rIdx) => (
                  <div key={room.id || rIdx} className="item-card-editor">
                    <div className="item-card-header">
                      <strong>#{rIdx + 1} {room.title}</strong>
                      <button 
                        onClick={() => {
                          if (confirm(`Delete room "${room.title}"?`)) {
                            updateDraft(prev => ({
                              ...prev,
                              rooms: prev.rooms.filter((_, i) => i !== rIdx)
                            }));
                          }
                        }}
                        className="delete-item-btn"
                        title="Delete Room"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="input-row">
                      <div className="input-field">
                        <label>Room Title</label>
                        <input 
                          type="text" 
                          value={room.title} 
                          onChange={(e) => {
                            const val = e.target.value;
                            updateDraft(prev => {
                              const copy = [...prev.rooms];
                              copy[rIdx].title = val;
                              return { ...prev, rooms: copy };
                            });
                          }}
                        />
                      </div>
                      <div className="input-field">
                        <label>Category Tag</label>
                        <input 
                          type="text" 
                          value={room.tag || ''} 
                          onChange={(e) => {
                            const val = e.target.value;
                            updateDraft(prev => {
                              const copy = [...prev.rooms];
                              copy[rIdx].tag = val;
                              return { ...prev, rooms: copy };
                            });
                          }}
                        />
                      </div>
                    </div>

                    <div className="input-row">
                      <div className="input-field">
                        <label>Bed Configuration</label>
                        <input 
                          type="text" 
                          value={room.bedType} 
                          onChange={(e) => {
                            const val = e.target.value;
                            updateDraft(prev => {
                              const copy = [...prev.rooms];
                              copy[rIdx].bedType = val;
                              return { ...prev, rooms: copy };
                            });
                          }}
                        />
                      </div>
                      <div className="input-field">
                        <label>Capacity</label>
                        <input 
                          type="text" 
                          value={room.capacity} 
                          onChange={(e) => {
                            const val = e.target.value;
                            updateDraft(prev => {
                              const copy = [...prev.rooms];
                              copy[rIdx].capacity = val;
                              return { ...prev, rooms: copy };
                            });
                          }}
                        />
                      </div>
                    </div>

                    <div className="input-field">
                      <label>Room Main Photo</label>
                      <div className="image-preview-picker">
                        <img src={room.heroImage} alt={room.title} className="picker-thumb" />
                        <div className="picker-controls">
                          <input 
                            type="text" 
                            value={room.heroImage} 
                            onChange={(e) => {
                              const val = e.target.value;
                              updateDraft(prev => {
                                const copy = [...prev.rooms];
                                copy[rIdx].heroImage = val;
                                return { ...prev, rooms: copy };
                              });
                            }}
                          />
                          <label className="upload-file-btn">
                            <Upload size={14} />
                            <span>Upload Image</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handleImageUpload(e, (url) => {
                                updateDraft(prev => {
                                  const copy = [...prev.rooms];
                                  copy[rIdx].heroImage = url;
                                  return { ...prev, rooms: copy };
                                });
                              })}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="input-field">
                      <label>Description</label>
                      <textarea 
                        rows={2} 
                        value={room.description} 
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft(prev => {
                            const copy = [...prev.rooms];
                            copy[rIdx].description = val;
                            return { ...prev, rooms: copy };
                          });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. BANQUETS & EVENTS FORM */}
            {activeSection === 'banquets' && (
              <div className="section-form-block">
                <h3>Banquet &amp; Celebration Lawn Venues</h3>
                {draftData.banquets?.map((venue, vIdx) => (
                  <div key={venue.id || vIdx} className="item-card-editor">
                    <strong>{venue.title}</strong>
                    <div className="input-field" style={{ marginTop: '0.75rem' }}>
                      <label>Venue Title</label>
                      <input 
                        type="text" 
                        value={venue.title} 
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft(prev => {
                            const copy = [...prev.banquets];
                            copy[vIdx].title = val;
                            return { ...prev, banquets: copy };
                          });
                        }}
                      />
                    </div>
                    <div className="input-row">
                      <div className="input-field">
                        <label>Capacity</label>
                        <input 
                          type="text" 
                          value={venue.capacity} 
                          onChange={(e) => {
                            const val = e.target.value;
                            updateDraft(prev => {
                              const copy = [...prev.banquets];
                              copy[vIdx].capacity = val;
                              return { ...prev, banquets: copy };
                            });
                          }}
                        />
                      </div>
                      <div className="input-field">
                        <label>Best Suited For</label>
                        <input 
                          type="text" 
                          value={venue.bestFor} 
                          onChange={(e) => {
                            const val = e.target.value;
                            updateDraft(prev => {
                              const copy = [...prev.banquets];
                              copy[vIdx].bestFor = val;
                              return { ...prev, banquets: copy };
                            });
                          }}
                        />
                      </div>
                    </div>

                    <div className="input-field">
                      <label>Venue Main Photo</label>
                      <div className="image-preview-picker">
                        <img src={venue.image} alt={venue.title} className="picker-thumb" />
                        <div className="picker-controls">
                          <input 
                            type="text" 
                            value={venue.image} 
                            onChange={(e) => {
                              const val = e.target.value;
                              updateDraft(prev => {
                                const copy = [...prev.banquets];
                                copy[vIdx].image = val;
                                return { ...prev, banquets: copy };
                              });
                            }}
                          />
                          <label className="upload-file-btn">
                            <Upload size={14} />
                            <span>Upload Photo</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handleImageUpload(e, (url) => {
                                updateDraft(prev => {
                                  const copy = [...prev.banquets];
                                  copy[vIdx].image = url;
                                  return { ...prev, banquets: copy };
                                });
                              })}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="input-field">
                      <label>Description</label>
                      <textarea 
                        rows={2} 
                        value={venue.description} 
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft(prev => {
                            const copy = [...prev.banquets];
                            copy[vIdx].description = val;
                            return { ...prev, banquets: copy };
                          });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. SETTINGS & CONTACT FORM */}
            {activeSection === 'settings' && (
              <div className="section-form-block">
                <h3>Hotel Contact &amp; Operation Info</h3>
                <div className="input-row">
                  <div className="input-field">
                    <label>Hotel Name</label>
                    <input 
                      type="text" 
                      value={draftData.settings?.hotelName || ''} 
                      onChange={(e) => updateDraft(prev => ({
                        ...prev,
                        settings: { ...prev.settings, hotelName: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="input-field">
                    <label>Subtitle</label>
                    <input 
                      type="text" 
                      value={draftData.settings?.subtitle || ''} 
                      onChange={(e) => updateDraft(prev => ({
                        ...prev,
                        settings: { ...prev.settings, subtitle: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-field">
                    <label>Primary Phone</label>
                    <input 
                      type="text" 
                      value={draftData.settings?.phoneDisplayPrimary || ''} 
                      onChange={(e) => updateDraft(prev => ({
                        ...prev,
                        settings: { ...prev.settings, phoneDisplayPrimary: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="input-field">
                    <label>WhatsApp Number</label>
                    <input 
                      type="text" 
                      value={draftData.settings?.whatsappNumber || ''} 
                      onChange={(e) => updateDraft(prev => ({
                        ...prev,
                        settings: { ...prev.settings, whatsappNumber: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div className="input-field">
                  <label>Full Address</label>
                  <input 
                    type="text" 
                    value={draftData.settings?.address || ''} 
                    onChange={(e) => updateDraft(prev => ({
                      ...prev,
                      settings: { ...prev.settings, address: e.target.value }
                    }))}
                  />
                </div>

                <div className="input-row">
                  <div className="input-field">
                    <label>Check-in Time</label>
                    <input 
                      type="text" 
                      value={draftData.settings?.checkInTime || ''} 
                      onChange={(e) => updateDraft(prev => ({
                        ...prev,
                        settings: { ...prev.settings, checkInTime: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="input-field">
                    <label>Check-out Time</label>
                    <input 
                      type="text" 
                      value={draftData.settings?.checkOutTime || ''} 
                      onChange={(e) => updateDraft(prev => ({
                        ...prev,
                        settings: { ...prev.settings, checkOutTime: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. AYODHYA GUIDE FORM */}
            {activeSection === 'guide' && (
              <div className="section-form-block">
                <h3>Ayodhya Pilgrimage &amp; Transit Guide</h3>
                {draftData.guide?.map((item, gIdx) => (
                  <div key={item.id || gIdx} className="item-card-editor">
                    <div className="input-row">
                      <div className="input-field">
                        <label>Milestone Name</label>
                        <input 
                          type="text" 
                          value={item.name} 
                          onChange={(e) => {
                            const val = e.target.value;
                            updateDraft(prev => {
                              const copy = [...prev.guide];
                              copy[gIdx].name = val;
                              return { ...prev, guide: copy };
                            });
                          }}
                        />
                      </div>
                      <div className="input-field">
                        <label>Distance / Time</label>
                        <input 
                          type="text" 
                          value={item.distance} 
                          onChange={(e) => {
                            const val = e.target.value;
                            updateDraft(prev => {
                              const copy = [...prev.guide];
                              copy[gIdx].distance = val;
                              return { ...prev, guide: copy };
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="input-field">
                      <label>Description</label>
                      <input 
                        type="text" 
                        value={item.description} 
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft(prev => {
                            const copy = [...prev.guide];
                            copy[gIdx].description = val;
                            return { ...prev, guide: copy };
                          });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 6. FAQS FORM */}
            {activeSection === 'faqs' && (
              <div className="section-form-block">
                <div className="block-title-row">
                  <h3>Frequently Asked Questions ({draftData.faqs?.length})</h3>
                  <button 
                    className="add-item-btn"
                    onClick={() => {
                      const newFaq = { question: 'New Question?', answer: 'Answer details here...' };
                      updateDraft(prev => ({ ...prev, faqs: [...prev.faqs, newFaq] }));
                    }}
                  >
                    <Plus size={15} /> Add FAQ
                  </button>
                </div>

                {draftData.faqs?.map((faq, fIdx) => (
                  <div key={fIdx} className="item-card-editor">
                    <div className="item-card-header">
                      <strong>Question #{fIdx + 1}</strong>
                      <button 
                        onClick={() => {
                          updateDraft(prev => ({
                            ...prev,
                            faqs: prev.faqs.filter((_, i) => i !== fIdx)
                          }));
                        }}
                        className="delete-item-btn"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="input-field">
                      <label>Question</label>
                      <input 
                        type="text" 
                        value={faq.question} 
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft(prev => {
                            const copy = [...prev.faqs];
                            copy[fIdx].question = val;
                            return { ...prev, faqs: copy };
                          });
                        }}
                      />
                    </div>
                    <div className="input-field">
                      <label>Answer</label>
                      <textarea 
                        rows={2} 
                        value={faq.answer} 
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft(prev => {
                            const copy = [...prev.faqs];
                            copy[fIdx].answer = val;
                            return { ...prev, faqs: copy };
                          });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Right Side: Interactive Live Preview Iframe */}
        <main className="admin-live-preview-viewport">
          <div className={`preview-iframe-wrapper preview-${previewDevice}`}>
            <div className="preview-top-mock-bar">
              <span className="mock-dot red"></span>
              <span className="mock-dot yellow"></span>
              <span className="mock-dot green"></span>
              <span className="mock-url-bar">https://hotelswastikainn.com [Live Sync Active]</span>
            </div>
            <iframe 
              ref={iframeRef}
              src="/"
              title="Live Website Preview"
              className="preview-iframe"
              onLoad={() => {
                if (draftData) {
                  broadcastToPreview(draftData);
                }
              }}
            />
          </div>
        </main>
      </div>

      <style>{`
        .admin-studio-container {
          position: fixed;
          inset: 0;
          z-index: 999999;
          display: flex;
          flex-direction: column;
          background: #18140e;
          color: #f5ede4;
          font-family: var(--font-sans);
          overflow: hidden;
        }

        .admin-top-bar {
          height: 60px;
          background: #241c14;
          border-bottom: 1.5px solid rgba(197, 155, 39, 0.35);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.25rem;
          gap: 1rem;
          flex-shrink: 0;
        }

        .top-bar-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .studio-brand {
          font-weight: 800;
          font-size: 1.05rem;
          color: var(--gold-light);
          letter-spacing: -0.01em;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 9999px;
        }

        .status-draft {
          background: rgba(234, 179, 8, 0.2);
          color: #facc15;
          border: 1px solid rgba(234, 179, 8, 0.4);
        }

        .status-live {
          background: rgba(34, 197, 94, 0.15);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .save-notice-text {
          font-size: 0.8rem;
          color: #4ade80;
          font-weight: 600;
        }

        /* Viewport Selector */
        .preview-device-selector {
          display: flex;
          background: rgba(0, 0, 0, 0.35);
          padding: 3px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .device-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
        }

        .device-btn:hover {
          color: #ffffff;
        }

        .device-btn.active {
          background: var(--gold-primary);
          color: #1a140b;
        }

        .top-bar-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .btn-primary-publish {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: var(--gold-gradient);
          color: #1a140b;
          border: none;
          padding: 0.55rem 1.15rem;
          font-weight: 700;
          font-size: 0.88rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: transform 0.2s;
        }

        .btn-primary-publish:hover {
          transform: translateY(-1px);
        }

        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.55rem 0.9rem;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .btn-icon, .btn-close-studio {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          font-size: 1rem;
        }

        .btn-icon:hover, .btn-close-studio:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        /* Split Canvas */
        .admin-split-canvas {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        /* Left Side: Editor */
        .admin-sidebar-editor {
          width: 42%;
          min-width: 440px;
          max-width: 580px;
          background: #1f1811;
          border-right: 1.5px solid rgba(197, 155, 39, 0.25);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .editor-nav-tabs {
          display: flex;
          overflow-x: auto;
          background: #17120c;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 0.4rem 0.5rem;
          gap: 0.35rem;
          flex-shrink: 0;
        }

        .nav-tab {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          padding: 0.55rem 0.85rem;
          font-size: 0.82rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          white-space: nowrap;
          transition: 0.2s;
        }

        .nav-tab:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .nav-tab.active {
          background: rgba(197, 155, 39, 0.2);
          color: var(--gold-light);
          border: 1px solid rgba(197, 155, 39, 0.4);
        }

        .editor-form-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }

        .section-form-block h3 {
          font-size: 1.25rem;
          color: var(--gold-light);
          margin-bottom: 0.35rem;
        }

        .form-helper {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 1.5rem;
        }

        .input-field {
          margin-bottom: 1.15rem;
        }

        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .input-field label {
          display: block;
          font-size: 0.82rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.35rem;
        }

        .input-field input, .input-field textarea {
          width: 100%;
          background: #140f09;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          padding: 0.65rem 0.85rem;
          border-radius: 6px;
          font-size: 0.9rem;
          font-family: inherit;
        }

        .input-field input:focus, .input-field textarea:focus {
          outline: none;
          border-color: var(--gold-primary);
        }

        /* Image Picker */
        .image-preview-picker {
          display: flex;
          gap: 1rem;
          align-items: center;
          background: #140f09;
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .picker-thumb {
          width: 80px;
          height: 60px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid rgba(197, 155, 39, 0.4);
        }

        .picker-controls {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .upload-file-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--gold-subtle);
          color: var(--gold-light);
          border: 1px solid rgba(197, 155, 39, 0.35);
          padding: 0.45rem 0.85rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          width: fit-content;
        }

        .upload-file-btn input[type="file"] {
          display: none;
        }

        /* Items Editor Cards */
        .block-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .add-item-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: var(--gold-subtle);
          color: var(--gold-light);
          border: 1px solid rgba(197, 155, 39, 0.4);
          padding: 0.4rem 0.85rem;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
        }

        .item-card-editor {
          background: #140f09;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1.15rem;
          margin-bottom: 1.25rem;
        }

        .item-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--gold-light);
        }

        .delete-item-btn {
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          padding: 4px;
        }

        /* Right Side: Live Preview Iframe */
        .admin-live-preview-viewport {
          flex: 1;
          background: #0f0c08;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          overflow: hidden;
        }

        .preview-iframe-wrapper {
          height: 100%;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
        }

        .preview-desktop { width: 100%; }
        .preview-tablet { width: 768px; }
        .preview-mobile { width: 385px; }

        .preview-top-mock-bar {
          height: 32px;
          background: #2b2219;
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 6px;
          flex-shrink: 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        }

        .mock-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }
        .mock-dot.red { background: #ef4444; }
        .mock-dot.yellow { background: #eab308; }
        .mock-dot.green { background: #22c55e; }

        .mock-url-bar {
          margin-left: 12px;
          background: rgba(0, 0, 0, 0.25);
          color: rgba(255, 255, 255, 0.65);
          font-size: 0.72rem;
          padding: 2px 10px;
          border-radius: 4px;
          flex: 1;
        }

        .preview-iframe {
          flex: 1;
          width: 100%;
          border: none;
        }
      `}</style>
    </div>
  );
}
