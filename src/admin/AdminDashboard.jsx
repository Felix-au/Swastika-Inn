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
  MapPin,
  Award,
  Image as ImageIcon,
  Star,
  X,
  ExternalLink,
  Eye,
  Compass,
  Crosshair
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

  // Add Room Modal State
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [newRoomForm, setNewRoomForm] = useState({
    title: '',
    category: 'Suites',
    tag: 'Popular Choice',
    heroImage: '/images/room-executive-king.jpeg',
    gallery: ['/images/room-executive-king.jpeg'],
    bedType: '1 King Size Bed',
    capacity: '2 Adults',
    size: '300 sq. ft.',
    description: '',
    highlights: 'King Bed, Attached Western Bath with Geyser, Split AC, High Speed Wi-Fi',
    bathroomFeatures: 'Instant Geyser, Modern Shower, Sanitized Western Toilet',
    bathroomImage: '/images/bathroom-modern.jpeg'
  });

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

  // Smoothly scroll the preview iframe to a specific section
  const scrollPreviewToSection = useCallback((section) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'SWASTIKA_SCROLL_TO_SECTION', section },
        '*'
      );
    }
  }, []);

  // Focus & highlight an exact element in the live preview iframe
  const sendFocusToPreview = useCallback((targetKey, isImage = false) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'SWASTIKA_FOCUS_ELEMENT', targetKey, isImage },
        '*'
      );
    }
  }, []);

  // Clear highlight in the live preview iframe
  const sendBlurToPreview = useCallback(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'SWASTIKA_BLUR_ELEMENT' },
        '*'
      );
    }
  }, []);

  // Change active section tab and trigger preview scroll
  const handleSelectSection = (section) => {
    setActiveSection(section);
    scrollPreviewToSection(section);
  };

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

  // Listen for double-click navigation events from the preview iframe
  useEffect(() => {
    const handleWindowMessage = (event) => {
      if (!event.data) return;

      // Double click directly on an exact element in preview
      if (event.data.type === 'SWASTIKA_NAVIGATE_TO_ELEMENT') {
        const { targetKey, sectionKey } = event.data;
        if (sectionKey) {
          setActiveSection(sectionKey);
        }
        setSaveNotice(`Editing: ${targetKey}`);
        setTimeout(() => setSaveNotice(''), 3000);

        // Wait for tab switch DOM rendering, then scroll to and focus target field
        setTimeout(() => {
          let editorTarget = document.querySelector(`[data-editor-target="${targetKey}"]`);
          if (!editorTarget && targetKey) {
            // Fallback to parent target if specific field not matched
            const parts = targetKey.split('.');
            if (parts.length > 2) {
              editorTarget = document.querySelector(`[data-editor-target="${parts[0]}.${parts[1]}"]`);
            }
          }
          if (editorTarget) {
            editorTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (typeof editorTarget.focus === 'function') {
              editorTarget.focus();
            }
            editorTarget.classList.remove('cms-editor-highlight-flash');
            void editorTarget.offsetWidth;
            editorTarget.classList.add('cms-editor-highlight-flash');
            setTimeout(() => editorTarget.classList.remove('cms-editor-highlight-flash'), 2200);
          }
        }, 150);
      }

      if (event.data.type === 'SWASTIKA_NAVIGATE_TO_SECTION') {
        const targetSection = event.data.section;
        if (targetSection) {
          setActiveSection(targetSection);
          setSaveNotice(`Navigated to ${targetSection.toUpperCase()} from preview`);
          setTimeout(() => setSaveNotice(''), 3000);
        }
      }
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, []);

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

  // Image upload handler (uploads directly to Cloudinary via backend)
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
      // Reset input value so same file can be re-uploaded if desired
      e.target.value = '';
    }
  };

  // Publish to Live MongoDB
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // First save current draft to backend
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
        setSaveNotice('Successfully published all changes to the live site!');
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

  // Room Gallery Helper: Add Photo to Gallery
  const handleAddGalleryPhoto = (roomIdx, url) => {
    if (!url) return;
    updateDraft(prev => {
      const copy = [...prev.rooms];
      const room = { ...copy[roomIdx] };
      const currentGallery = Array.isArray(room.gallery) ? [...room.gallery] : [room.heroImage];
      if (!currentGallery.includes(url)) {
        currentGallery.push(url);
      }
      room.gallery = currentGallery;
      copy[roomIdx] = room;
      return { ...prev, rooms: copy };
    });
  };

  // Room Gallery Helper: Remove Photo from Gallery
  const handleRemoveGalleryPhoto = (roomIdx, photoIdx) => {
    updateDraft(prev => {
      const copy = [...prev.rooms];
      const room = { ...copy[roomIdx] };
      const currentGallery = Array.isArray(room.gallery) ? [...room.gallery] : [room.heroImage];
      currentGallery.splice(photoIdx, 1);
      room.gallery = currentGallery;
      // If deleted photo was heroImage, reset heroImage to first remaining photo
      if (room.gallery.length > 0 && !currentGallery.includes(room.heroImage)) {
        room.heroImage = currentGallery[0];
      }
      copy[roomIdx] = room;
      return { ...prev, rooms: copy };
    });
  };

  // Room Gallery Helper: Set as Main Cover Photo
  const handleSetRoomCover = (roomIdx, photoUrl) => {
    updateDraft(prev => {
      const copy = [...prev.rooms];
      copy[roomIdx] = { ...copy[roomIdx], heroImage: photoUrl };
      return { ...prev, rooms: copy };
    });
    setSaveNotice('Updated main cover photo!');
    setTimeout(() => setSaveNotice(''), 2500);
  };

  // Handle Create New Room Modal Submit
  const handleCreateRoomSubmit = (e) => {
    e.preventDefault();
    if (!newRoomForm.title.trim()) {
      alert('Please enter a room title');
      return;
    }

    const highlightsArr = newRoomForm.highlights
      ? newRoomForm.highlights.split(',').map(s => s.trim()).filter(Boolean)
      : ['King Bed', 'Attached Western Bath with Geyser', 'Split AC'];

    const createdRoom = {
      id: `room-${Date.now()}`,
      title: newRoomForm.title,
      category: newRoomForm.category || 'Suites',
      tag: newRoomForm.tag || 'Special Choice',
      heroImage: newRoomForm.heroImage || '/images/room-executive-king.jpeg',
      gallery: newRoomForm.gallery.length > 0 ? newRoomForm.gallery : [newRoomForm.heroImage],
      bedType: newRoomForm.bedType || '1 King Size Bed',
      capacity: newRoomForm.capacity || '2 Adults',
      size: newRoomForm.size || '300 sq. ft.',
      description: newRoomForm.description || 'Spacious suite with attached western bathroom and modern amenities.',
      highlights: highlightsArr,
      bathroom: {
        image: newRoomForm.bathroomImage || '/images/bathroom-modern.jpeg',
        type: 'Attached Western Bath',
        features: newRoomForm.bathroomFeatures || 'Instant Geyser, Modern Shower, Sanitized Western Toilet'
      }
    };

    updateDraft(prev => ({
      ...prev,
      rooms: [createdRoom, ...(prev.rooms || [])]
    }));

    setIsAddRoomModalOpen(false);
    // Reset form
    setNewRoomForm({
      title: '',
      category: 'Suites',
      tag: 'Popular Choice',
      heroImage: '/images/room-executive-king.jpeg',
      gallery: ['/images/room-executive-king.jpeg'],
      bedType: '1 King Size Bed',
      capacity: '2 Adults',
      size: '300 sq. ft.',
      description: '',
      highlights: 'King Bed, Attached Western Bath with Geyser, Split AC, High Speed Wi-Fi',
      bathroomFeatures: 'Instant Geyser, Modern Shower, Sanitized Western Toilet',
      bathroomImage: '/images/bathroom-modern.jpeg'
    });

    setSaveNotice(`Added new room: "${createdRoom.title}"`);
    setTimeout(() => setSaveNotice(''), 3500);
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

        {/* Quick Omni-Connector Placeholder */}

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
              onClick={() => handleSelectSection('hero')}
            >
              <Sparkles size={16} />
              <span>Hero</span>
            </button>
            <button 
              className={`nav-tab ${activeSection === 'rooms' ? 'active' : ''}`}
              onClick={() => handleSelectSection('rooms')}
            >
              <Bed size={16} />
              <span>Rooms ({draftData.rooms?.length || 0})</span>
            </button>
            <button 
              className={`nav-tab ${activeSection === 'banquets' ? 'active' : ''}`}
              onClick={() => handleSelectSection('banquets')}
            >
              <Home size={16} />
              <span>Banquets &amp; Lawn</span>
            </button>
            <button 
              className={`nav-tab ${activeSection === 'experience' ? 'active' : ''}`}
              onClick={() => handleSelectSection('experience')}
            >
              <Award size={16} />
              <span>Amenities</span>
            </button>
            <button 
              className={`nav-tab ${activeSection === 'guide' ? 'active' : ''}`}
              onClick={() => handleSelectSection('guide')}
            >
              <MapPin size={16} />
              <span>Ayodhya Guide</span>
            </button>
            <button 
              className={`nav-tab ${activeSection === 'faqs' ? 'active' : ''}`}
              onClick={() => handleSelectSection('faqs')}
            >
              <HelpCircle size={16} />
              <span>FAQs</span>
            </button>
            <button 
              className={`nav-tab ${activeSection === 'settings' ? 'active' : ''}`}
              onClick={() => handleSelectSection('settings')}
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
          </nav>

          {/* Form Content Area */}
          <div className="editor-form-scroll">
            {/* 1. HERO SECTION FORM */}
            {activeSection === 'hero' && (
              <div className="section-form-block">
                <div className="block-title-row">
                  <h3>Hero Banner Configuration</h3>
                  <button 
                    type="button" 
                    className="preview-scroll-btn" 
                    onClick={() => scrollPreviewToSection('hero')}
                    title="Focus preview on Hero"
                  >
                    <Eye size={13} /> Scroll Preview
                  </button>
                </div>
                <p className="form-helper">Controls the main welcome hero section on the homepage.</p>

                <div className="input-field">
                  <label>Golden Eyebrow Badge</label>
                  <input 
                    type="text" 
                    data-editor-target="hero.badge"
                    value={draftData.hero?.badge || ''} 
                    onFocus={() => sendFocusToPreview('hero.badge')}
                    onBlur={sendBlurToPreview}
                    onChange={(e) => updateDraft(prev => ({
                      ...prev,
                      hero: { ...prev.hero, badge: e.target.value }
                    }))}
                  />
                </div>

                <div className="input-row">
                  <div className="input-field">
                    <label>Title Prefix (White Text)</label>
                    <input 
                      type="text" 
                      data-editor-target="hero.title"
                      value={draftData.hero?.titlePrefix || ''} 
                      onFocus={() => sendFocusToPreview('hero.title')}
                      onBlur={sendBlurToPreview}
                      onChange={(e) => updateDraft(prev => ({
                        ...prev,
                        hero: { ...prev.hero, titlePrefix: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="input-field">
                    <label>Title Suffix (Gold Gradient Text)</label>
                    <input 
                      type="text" 
                      data-editor-target="hero.title"
                      value={draftData.hero?.titleSuffix || ''} 
                      onFocus={() => sendFocusToPreview('hero.title')}
                      onBlur={sendBlurToPreview}
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
                    data-editor-target="hero.description"
                    value={draftData.hero?.description || ''} 
                    onFocus={() => sendFocusToPreview('hero.description')}
                    onBlur={sendBlurToPreview}
                    onChange={(e) => updateDraft(prev => ({
                      ...prev,
                      hero: { ...prev.hero, description: e.target.value }
                    }))}
                  />
                </div>

                {/* Hero Feature Badges */}
                <div className="input-field" data-editor-target="hero.badges">
                  <label>Hero Feature Badges ({draftData.hero?.badges?.length || 0})</label>
                  <div className="hero-badges-editor-list">
                    {(draftData.hero?.badges || []).map((b, bIdx) => (
                      <div key={bIdx} className="badge-edit-row">
                        <input 
                          type="text" 
                          data-editor-target={`hero.badge.${bIdx}`}
                          value={b.text || ''} 
                          onFocus={() => sendFocusToPreview('hero.badges')}
                          onBlur={sendBlurToPreview}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateDraft(prev => {
                              const copy = [...(prev.hero?.badges || [])];
                              copy[bIdx] = { text: val };
                              return { ...prev, hero: { ...prev.hero, badges: copy } };
                            });
                          }}
                        />
                        <button 
                          type="button" 
                          className="delete-photo-btn"
                          onClick={() => {
                            updateDraft(prev => ({
                              ...prev,
                              hero: {
                                ...prev.hero,
                                badges: prev.hero.badges.filter((_, i) => i !== bIdx)
                              }
                            }));
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      className="add-subitem-btn"
                      onClick={() => {
                        updateDraft(prev => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            badges: [...(prev.hero?.badges || []), { text: 'New Verified Feature' }]
                          }
                        }));
                      }}
                    >
                      <Plus size={13} /> Add Feature Badge
                    </button>
                  </div>
                </div>

                {/* Hero Background Image */}
                <div className="input-field" data-editor-target="hero.image">
                  <label>Hero Background Night Facade Photo</label>
                  <div className="image-preview-picker">
                    <img 
                      src={draftData.hero?.backgroundImage || '/images/hero-facade-night.jpeg'} 
                      alt="Hero Facade" 
                      className="picker-thumb"
                    />
                    <div className="picker-controls">
                      <input 
                        type="text" 
                        data-editor-target="hero.image"
                        value={draftData.hero?.backgroundImage || ''} 
                        onFocus={() => sendFocusToPreview('hero.image', true)}
                        onBlur={sendBlurToPreview}
                        onChange={(e) => updateDraft(prev => ({
                          ...prev,
                          hero: { ...prev.hero, backgroundImage: e.target.value }
                        }))}
                        placeholder="Image URL or /images/..."
                      />
                      <label className="upload-file-btn">
                        <Upload size={14} />
                        <span>Upload Photo to Cloudinary</span>
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
                  <div className="title-row-actions">
                    <button 
                      type="button" 
                      className="preview-scroll-btn" 
                      onClick={() => scrollPreviewToSection('rooms')}
                      title="Focus preview on Rooms"
                    >
                      <Eye size={13} /> Scroll Preview
                    </button>
                    <button 
                      className="add-item-btn"
                      onClick={() => setIsAddRoomModalOpen(true)}
                    >
                      <Plus size={15} /> Add New Room
                    </button>
                  </div>
                </div>

                {draftData.rooms?.map((room, rIdx) => (
                  <div key={room.id || rIdx} className="item-card-editor" data-editor-target={`rooms.${rIdx}`}>
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
                          data-editor-target={`rooms.${rIdx}.title`}
                          value={room.title} 
                          onFocus={() => sendFocusToPreview(`rooms.${rIdx}.title`)}
                          onBlur={sendBlurToPreview}
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
                          data-editor-target={`rooms.${rIdx}.tag`}
                          value={room.tag || ''} 
                          onFocus={() => sendFocusToPreview(`rooms.${rIdx}.tag`)}
                          onBlur={sendBlurToPreview}
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
                          data-editor-target={`rooms.${rIdx}.bed`}
                          value={room.bedType} 
                          onFocus={() => sendFocusToPreview(`rooms.${rIdx}.bed`)}
                          onBlur={sendBlurToPreview}
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
                          data-editor-target={`rooms.${rIdx}.capacity`}
                          value={room.capacity} 
                          onFocus={() => sendFocusToPreview(`rooms.${rIdx}.capacity`)}
                          onBlur={sendBlurToPreview}
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

                    <div className="input-field" data-editor-target={`rooms.${rIdx}.image`}>
                      <label>Main Listing Cover Photo</label>
                      <div className="image-preview-picker">
                        <img src={room.heroImage} alt={room.title} className="picker-thumb" />
                        <div className="picker-controls">
                          <input 
                            type="text" 
                            data-editor-target={`rooms.${rIdx}.image`}
                            value={room.heroImage} 
                            onFocus={() => sendFocusToPreview(`rooms.${rIdx}.image`, true)}
                            onBlur={sendBlurToPreview}
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
                            <span>Upload Cover Photo</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handleImageUpload(e, (url) => {
                                handleSetRoomCover(rIdx, url);
                                handleAddGalleryPhoto(rIdx, url);
                              })}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Room Modal Gallery Images Manager */}
                    <div className="room-gallery-manager" data-editor-target={`rooms.${rIdx}.gallery`}>
                      <label className="field-sublabel">
                        <ImageIcon size={14} /> Modal Gallery Photos ({room.gallery?.length || 1})
                      </label>
                      <p className="form-helper-sm">These photos are displayed inside the popup gallery when guests click "View Room Details".</p>
                      
                      <div className="gallery-thumbs-grid">
                        {(room.gallery || [room.heroImage]).map((photoUrl, gIdx) => (
                          <div key={gIdx} className="gallery-thumb-card">
                            <img src={photoUrl} alt={`Gallery ${gIdx + 1}`} className="thumb-preview-img" />
                            <div className="thumb-actions-overlay">
                              <button 
                                type="button" 
                                className={`cover-btn ${room.heroImage === photoUrl ? 'is-cover' : ''}`}
                                onClick={() => handleSetRoomCover(rIdx, photoUrl)}
                                title="Set as Main Cover Photo"
                              >
                                <Star size={11} /> {room.heroImage === photoUrl ? 'Cover' : 'Make Cover'}
                              </button>
                              <button 
                                type="button" 
                                className="delete-photo-btn"
                                onClick={() => handleRemoveGalleryPhoto(rIdx, gIdx)}
                                title="Remove photo"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="add-photo-bar">
                        <label className="upload-file-btn-sm">
                          <Upload size={13} />
                          <span>Upload to Gallery</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageUpload(e, (url) => handleAddGalleryPhoto(rIdx, url))} 
                          />
                        </label>
                        <div className="url-add-group">
                          <input 
                            type="text" 
                            placeholder="Or paste photo URL..."
                            id={`add-photo-input-${rIdx}`}
                            onFocus={() => sendFocusToPreview(`rooms.${rIdx}.image`, true)}
                            onBlur={sendBlurToPreview}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (e.target.value.trim()) {
                                  handleAddGalleryPhoto(rIdx, e.target.value.trim());
                                  e.target.value = '';
                                }
                              }
                            }}
                          />
                          <button 
                            type="button" 
                            className="add-subitem-btn"
                            onClick={() => {
                              const el = document.getElementById(`add-photo-input-${rIdx}`);
                              if (el && el.value.trim()) {
                                handleAddGalleryPhoto(rIdx, el.value.trim());
                                el.value = '';
                              }
                            }}
                          >
                            <Plus size={13} /> Add
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="input-field">
                      <label>Attached Bathroom Features</label>
                      <input 
                        type="text" 
                        data-editor-target={`rooms.${rIdx}.bath`}
                        value={room.bathroom?.features || 'Instant Geyser, Modern Shower, Sanitized Western Toilet'} 
                        onFocus={() => sendFocusToPreview(`rooms.${rIdx}.bath`)}
                        onBlur={sendBlurToPreview}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft(prev => {
                            const copy = [...prev.rooms];
                            copy[rIdx].bathroom = { ...copy[rIdx].bathroom, features: val };
                            return { ...prev, rooms: copy };
                          });
                        }}
                      />
                    </div>

                    <div className="input-field">
                      <label>Room Description</label>
                      <textarea 
                        rows={2} 
                        data-editor-target={`rooms.${rIdx}.desc`}
                        value={room.description} 
                        onFocus={() => sendFocusToPreview(`rooms.${rIdx}.desc`)}
                        onBlur={sendBlurToPreview}
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
                <div className="block-title-row">
                  <h3>Banquet &amp; Celebration Lawn Venues</h3>
                  <button 
                    type="button" 
                    className="preview-scroll-btn" 
                    onClick={() => scrollPreviewToSection('banquets')}
                    title="Focus preview on Banquets"
                  >
                    <Eye size={13} /> Scroll Preview
                  </button>
                </div>
                {draftData.banquets?.map((venue, vIdx) => (
                  <div key={venue.id || vIdx} className="item-card-editor" data-editor-target={`banquets.${vIdx}`}>
                    <strong>{venue.title}</strong>
                    <div className="input-field" style={{ marginTop: '0.75rem' }}>
                      <label>Venue Title</label>
                      <input 
                        type="text" 
                        data-editor-target={`banquets.${vIdx}.title`}
                        value={venue.title} 
                        onFocus={() => sendFocusToPreview(`banquets.${vIdx}.title`)}
                        onBlur={sendBlurToPreview}
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
                          data-editor-target={`banquets.${vIdx}.capacity`}
                          value={venue.capacity} 
                          onFocus={() => sendFocusToPreview(`banquets.${vIdx}.capacity`)}
                          onBlur={sendBlurToPreview}
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
                          data-editor-target={`banquets.${vIdx}.bestFor`}
                          value={venue.bestFor} 
                          onFocus={() => sendFocusToPreview(`banquets.${vIdx}.bestFor`)}
                          onBlur={sendBlurToPreview}
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

                    <div className="input-field" data-editor-target={`banquets.${vIdx}.image`}>
                      <label>Venue Main Photo</label>
                      <div className="image-preview-picker">
                        <img src={venue.image} alt={venue.title} className="picker-thumb" />
                        <div className="picker-controls">
                          <input 
                            type="text" 
                            data-editor-target={`banquets.${vIdx}.image`}
                            value={venue.image} 
                            onFocus={() => sendFocusToPreview(`banquets.${vIdx}.image`, true)}
                            onBlur={sendBlurToPreview}
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
                        data-editor-target={`banquets.${vIdx}.desc`}
                        value={venue.description} 
                        onFocus={() => sendFocusToPreview(`banquets.${vIdx}.desc`)}
                        onBlur={sendBlurToPreview}
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

            {/* 4. HOTEL EXPERIENCE / AMENITIES FORM */}
            {activeSection === 'experience' && (
              <div className="section-form-block">
                <div className="block-title-row">
                  <h3>Hotel Amenities &amp; Guest Experience</h3>
                  <button 
                    type="button" 
                    className="preview-scroll-btn" 
                    onClick={() => scrollPreviewToSection('experience')}
                    title="Focus preview on Amenities"
                  >
                    <Eye size={13} /> Scroll Preview
                  </button>
                </div>
                <p className="form-helper">Controls the 3D showcase and comfort guarantees on the homepage.</p>

                <div className="input-field">
                  <label>Section Heading</label>
                  <input 
                    type="text" 
                    data-editor-target="experience.heading"
                    value={draftData.experience?.heading || 'Curated for Divine Peace & Opulent Comfort'} 
                    onFocus={() => sendFocusToPreview('experience.heading')}
                    onBlur={sendBlurToPreview}
                    onChange={(e) => updateDraft(prev => ({
                      ...prev,
                      experience: { ...(prev.experience || {}), heading: e.target.value }
                    }))}
                  />
                </div>

                <div className="input-field">
                  <label>Section Subheading</label>
                  <textarea 
                    rows={2} 
                    data-editor-target="experience.subheading"
                    value={draftData.experience?.subheading || ''} 
                    onFocus={() => sendFocusToPreview('experience.subheading')}
                    onBlur={sendBlurToPreview}
                    onChange={(e) => updateDraft(prev => ({
                      ...prev,
                      experience: { ...(prev.experience || {}), subheading: e.target.value }
                    }))}
                  />
                </div>
              </div>
            )}

            {/* 5. AYODHYA GUIDE FORM */}
            {activeSection === 'guide' && (
              <div className="section-form-block">
                <div className="block-title-row">
                  <h3>Ayodhya Pilgrimage &amp; Transit Guide</h3>
                  <div className="title-row-actions">
                    <button 
                      type="button" 
                      className="preview-scroll-btn" 
                      onClick={() => scrollPreviewToSection('guide')}
                      title="Focus preview on Guide"
                    >
                      <Eye size={13} /> Scroll Preview
                    </button>
                    <button 
                      className="add-item-btn"
                      onClick={() => {
                        const newLandmark = {
                          name: 'New Sacred Temple',
                          distance: '~10 Mins Drive',
                          description: 'Important pilgrimage destination for visiting devotees.'
                        };
                        updateDraft(prev => ({
                          ...prev,
                          guide: [...(prev.guide || []), newLandmark]
                        }));
                      }}
                    >
                      <Plus size={14} /> Add Landmark
                    </button>
                  </div>
                </div>

                {draftData.guide?.map((item, gIdx) => (
                  <div key={item.id || gIdx} className="item-card-editor" data-editor-target={`guide.${gIdx}`}>
                    <div className="item-card-header">
                      <strong>#{gIdx + 1} {item.name}</strong>
                      <button 
                        onClick={() => {
                          updateDraft(prev => ({
                            ...prev,
                            guide: prev.guide.filter((_, i) => i !== gIdx)
                          }));
                        }}
                        className="delete-item-btn"
                        title="Delete Landmark"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="input-row">
                      <div className="input-field">
                        <label>Milestone / Landmark Name</label>
                        <input 
                          type="text" 
                          data-editor-target={`guide.${gIdx}.name`}
                          value={item.name} 
                          onFocus={() => sendFocusToPreview(`guide.${gIdx}.name`)}
                          onBlur={sendBlurToPreview}
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
                        <label>Distance / Driving Time</label>
                        <input 
                          type="text" 
                          data-editor-target={`guide.${gIdx}.distance`}
                          value={item.distance} 
                          onFocus={() => sendFocusToPreview(`guide.${gIdx}.distance`)}
                          onBlur={sendBlurToPreview}
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
                      <label>Description / Pilgrimage Notes</label>
                      <input 
                        type="text" 
                        data-editor-target={`guide.${gIdx}.desc`}
                        value={item.description} 
                        onFocus={() => sendFocusToPreview(`guide.${gIdx}.desc`)}
                        onBlur={sendBlurToPreview}
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
                  <div className="title-row-actions">
                    <button 
                      type="button" 
                      className="preview-scroll-btn" 
                      onClick={() => scrollPreviewToSection('faqs')}
                      title="Focus preview on FAQs"
                    >
                      <Eye size={13} /> Scroll Preview
                    </button>
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
                </div>

                {draftData.faqs?.map((faq, fIdx) => (
                  <div key={fIdx} className="item-card-editor" data-editor-target={`faqs.${fIdx}`}>
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
                        data-editor-target={`faqs.${fIdx}.q`}
                        value={faq.question} 
                        onFocus={() => sendFocusToPreview(`faqs.${fIdx}.q`)}
                        onBlur={sendBlurToPreview}
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
                        data-editor-target={`faqs.${fIdx}.a`}
                        value={faq.answer} 
                        onFocus={() => sendFocusToPreview(`faqs.${fIdx}.a`)}
                        onBlur={sendBlurToPreview}
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

            {/* 7. SETTINGS & CONTACT FORM */}
            {activeSection === 'settings' && (
              <div className="section-form-block">
                <div className="block-title-row">
                  <h3>Hotel Contact &amp; Operation Info</h3>
                  <button 
                    type="button" 
                    className="preview-scroll-btn" 
                    onClick={() => scrollPreviewToSection('settings')}
                    title="Focus preview on Footer & Contact"
                  >
                    <Eye size={13} /> Scroll Preview
                  </button>
                </div>

                <div className="input-row">
                  <div className="input-field">
                    <label>Hotel Name</label>
                    <input 
                      type="text" 
                      data-editor-target="settings.hotelName"
                      value={draftData.settings?.hotelName || ''} 
                      onFocus={() => sendFocusToPreview('settings.hotelName')}
                      onBlur={sendBlurToPreview}
                      onChange={(e) => updateDraft(prev => ({
                        ...prev,
                        settings: { ...prev.settings, hotelName: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="input-field">
                    <label>Subtitle / Brand Tagline</label>
                    <input 
                      type="text" 
                      data-editor-target="settings.subtitle"
                      value={draftData.settings?.subtitle || ''} 
                      onFocus={() => sendFocusToPreview('settings.subtitle')}
                      onBlur={sendBlurToPreview}
                      onChange={(e) => updateDraft(prev => ({
                        ...prev,
                        settings: { ...prev.settings, subtitle: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-field">
                    <label>Primary Phone Display</label>
                    <input 
                      type="text" 
                      data-editor-target="settings.phone"
                      value={draftData.settings?.phoneDisplayPrimary || ''} 
                      onFocus={() => sendFocusToPreview('settings.phone')}
                      onBlur={sendBlurToPreview}
                      onChange={(e) => updateDraft(prev => ({
                        ...prev,
                        settings: { 
                          ...prev.settings, 
                          phoneDisplayPrimary: e.target.value,
                          phonePrimary: e.target.value.replace(/[^0-9+]/g, '')
                        }
                      }))}
                    />
                  </div>
                  <div className="input-field">
                    <label>Secondary Phone Display</label>
                    <input 
                      type="text" 
                      data-editor-target="settings.phoneSecondary"
                      value={draftData.settings?.phoneDisplaySecondary || ''} 
                      onFocus={() => sendFocusToPreview('settings.phone')}
                      onBlur={sendBlurToPreview}
                      onChange={(e) => updateDraft(prev => ({
                        ...prev,
                        settings: { 
                          ...prev.settings, 
                          phoneDisplaySecondary: e.target.value,
                          phoneSecondary: e.target.value.replace(/[^0-9+]/g, '')
                        }
                      }))}
                    />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-field">
                    <label>WhatsApp Number (without + symbol)</label>
                    <input 
                      type="text" 
                      data-editor-target="settings.whatsapp"
                      value={draftData.settings?.whatsappNumber || ''} 
                      onFocus={() => sendFocusToPreview('settings.phone')}
                      onBlur={sendBlurToPreview}
                      onChange={(e) => updateDraft(prev => ({
                        ...prev,
                        settings: { ...prev.settings, whatsappNumber: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="input-field">
                    <label>Inquiry Email Address</label>
                    <input 
                      type="email" 
                      data-editor-target="settings.email"
                      value={draftData.settings?.email || ''} 
                      onFocus={() => sendFocusToPreview('settings.email')}
                      onBlur={sendBlurToPreview}
                      onChange={(e) => updateDraft(prev => ({
                        ...prev,
                        settings: { ...prev.settings, email: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div className="input-field">
                  <label>Full Physical Address</label>
                  <input 
                    type="text" 
                    data-editor-target="settings.address"
                    value={draftData.settings?.address || ''} 
                    onFocus={() => sendFocusToPreview('settings.address')}
                    onBlur={sendBlurToPreview}
                    onChange={(e) => updateDraft(prev => ({
                      ...prev,
                      settings: { ...prev.settings, address: e.target.value }
                    }))}
                  />
                </div>

                <div className="input-field">
                  <label>Google Maps Directions Link</label>
                  <input 
                    type="text" 
                    data-editor-target="settings.maps"
                    value={draftData.settings?.googleMapsUrl || ''} 
                    onChange={(e) => updateDraft(prev => ({
                      ...prev,
                      settings: { ...prev.settings, googleMapsUrl: e.target.value }
                    }))}
                  />
                </div>

                <div className="input-row" data-editor-target="settings.timings">
                  <div className="input-field">
                    <label>Check-in Time</label>
                    <input 
                      type="text" 
                      data-editor-target="settings.timings"
                      value={draftData.settings?.checkInTime || ''} 
                      onFocus={() => sendFocusToPreview('settings.timings')}
                      onBlur={sendBlurToPreview}
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
                      data-editor-target="settings.timings"
                      value={draftData.settings?.checkOutTime || ''} 
                      onFocus={() => sendFocusToPreview('settings.timings')}
                      onBlur={sendBlurToPreview}
                      onChange={(e) => updateDraft(prev => ({
                        ...prev,
                        settings: { ...prev.settings, checkOutTime: e.target.value }
                      }))}
                    />
                  </div>
                </div>
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
              <span className="mock-url-bar">https://hotelswastikainn.com • Double-click any section to edit</span>
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

      {/* Add New Room Modal Dialog */}
      {isAddRoomModalOpen && (
        <div className="modal-backdrop-dialog" onClick={() => setIsAddRoomModalOpen(false)}>
          <div className="add-room-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <div>
                <h3>Add New Guest Suite / Room</h3>
                <p>Create a new room configuration with photos, bed specifications, and amenities.</p>
              </div>
              <button 
                type="button" 
                className="close-dialog-btn"
                onClick={() => setIsAddRoomModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRoomSubmit} className="dialog-form-scroll">
              <div className="input-row">
                <div className="input-field">
                  <label>Room Title *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Royal Heritage Suite"
                    value={newRoomForm.title}
                    onChange={(e) => setNewRoomForm(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="input-field">
                  <label>Badge / Tag</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Premium Choice"
                    value={newRoomForm.tag}
                    onChange={(e) => setNewRoomForm(prev => ({ ...prev, tag: e.target.value }))}
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="input-field">
                  <label>Category</label>
                  <select 
                    value={newRoomForm.category}
                    onChange={(e) => setNewRoomForm(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="Suites">Suites</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Family">Family</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>
                <div className="input-field">
                  <label>Room Size</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 320 sq. ft."
                    value={newRoomForm.size}
                    onChange={(e) => setNewRoomForm(prev => ({ ...prev, size: e.target.value }))}
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="input-field">
                  <label>Bed Configuration</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 1 King Size Bed"
                    value={newRoomForm.bedType}
                    onChange={(e) => setNewRoomForm(prev => ({ ...prev, bedType: e.target.value }))}
                  />
                </div>
                <div className="input-field">
                  <label>Capacity</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 2 Adults + 1 Child"
                    value={newRoomForm.capacity}
                    onChange={(e) => setNewRoomForm(prev => ({ ...prev, capacity: e.target.value }))}
                  />
                </div>
              </div>

              <div className="input-field">
                <label>Main Cover Photo</label>
                <div className="image-preview-picker">
                  <img src={newRoomForm.heroImage} alt="Cover Preview" className="picker-thumb" />
                  <div className="picker-controls">
                    <input 
                      type="text" 
                      value={newRoomForm.heroImage} 
                      onChange={(e) => setNewRoomForm(prev => ({ ...prev, heroImage: e.target.value }))}
                    />
                    <label className="upload-file-btn">
                      <Upload size={14} />
                      <span>Upload to Cloudinary</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleImageUpload(e, (url) => {
                          setNewRoomForm(prev => ({
                            ...prev,
                            heroImage: url,
                            gallery: prev.gallery.includes(url) ? prev.gallery : [...prev.gallery, url]
                          }));
                        })}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="input-field">
                <label>Modal Gallery Photos ({newRoomForm.gallery?.length || 0})</label>
                <div className="gallery-thumbs-grid">
                  {newRoomForm.gallery?.map((url, idx) => (
                    <div key={idx} className="gallery-thumb-card">
                      <img src={url} alt={`Thumb ${idx + 1}`} className="thumb-preview-img" />
                      <div className="thumb-actions-overlay">
                        <button 
                          type="button" 
                          className="delete-photo-btn"
                          onClick={() => setNewRoomForm(prev => ({
                            ...prev,
                            gallery: prev.gallery.filter((_, i) => i !== idx)
                          }))}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="add-photo-bar" style={{ marginTop: '0.5rem' }}>
                  <label className="upload-file-btn-sm">
                    <Upload size={13} />
                    <span>Upload Gallery Photo</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(e, (url) => {
                        setNewRoomForm(prev => ({
                          ...prev,
                          gallery: [...prev.gallery, url]
                        }));
                      })}
                    />
                  </label>
                </div>
              </div>

              <div className="input-field">
                <label>Attached Western Bathroom Details</label>
                <input 
                  type="text" 
                  value={newRoomForm.bathroomFeatures}
                  onChange={(e) => setNewRoomForm(prev => ({ ...prev, bathroomFeatures: e.target.value }))}
                  placeholder="e.g. 24/7 Instant Geyser, Rain Shower, Sanitized Western Toilet"
                />
              </div>

              <div className="input-field">
                <label>In-Room Highlights &amp; Comforts (Comma-separated)</label>
                <input 
                  type="text" 
                  value={newRoomForm.highlights}
                  onChange={(e) => setNewRoomForm(prev => ({ ...prev, highlights: e.target.value }))}
                  placeholder="King Bed, Attached Western Bath with Geyser, Split AC, High Speed Wi-Fi"
                />
              </div>

              <div className="input-field">
                <label>Description</label>
                <textarea 
                  rows={2}
                  value={newRoomForm.description}
                  onChange={(e) => setNewRoomForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe room comforts, ambiance, and view..."
                />
              </div>

              <div className="dialog-action-buttons">
                <button 
                  type="button" 
                  className="btn-cancel-dialog"
                  onClick={() => setIsAddRoomModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-submit-dialog"
                >
                  Create &amp; Add Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--gold-gradient);
          color: #1a140b;
          border: none;
          padding: 0.55rem 1.1rem;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn-primary-publish:hover {
          opacity: 0.95;
          transform: translateY(-1px);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 0.55rem 0.9rem;
          border-radius: 8px;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .btn-icon {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .btn-close-studio {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 700;
        }

        /* Split Canvas */
        .admin-split-canvas {
          flex: 1;
          display: grid;
          grid-template-columns: 480px 1fr;
          overflow: hidden;
          background: #14100b;
        }

        /* Left Sidebar Editor */
        .admin-sidebar-editor {
          background: #1f1811;
          border-right: 1.5px solid rgba(197, 155, 39, 0.25);
          display: flex;
          flex-direction: column;
          height: calc(100vh - 60px);
          overflow: hidden;
        }

        .editor-nav-tabs {
          display: flex;
          overflow-x: auto;
          background: #19130c;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 6px;
          gap: 4px;
          flex-shrink: 0;
        }

        .nav-tab {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          padding: 7px 12px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: 0.15s;
        }

        .nav-tab:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
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
          font-size: 1.15rem;
          color: var(--gold-light);
          margin-bottom: 0.2rem;
        }

        .block-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.85rem;
          gap: 0.5rem;
        }

        .title-row-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .preview-scroll-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(197, 155, 39, 0.15);
          color: var(--gold-light);
          border: 1px solid rgba(197, 155, 39, 0.35);
          padding: 4px 9px;
          border-radius: 6px;
          font-size: 0.725rem;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        .preview-scroll-btn:hover {
          background: rgba(197, 155, 39, 0.3);
        }

        .add-item-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: var(--gold-primary);
          color: #1a140b;
          border: none;
          padding: 5px 11px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
        }

        .form-helper {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.55);
          margin-bottom: 1.25rem;
        }

        .form-helper-sm {
          font-size: 0.725rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 0.6rem;
        }

        .input-field {
          margin-bottom: 1rem;
        }

        .field-sublabel {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--gold-light);
          margin-bottom: 0.3rem;
        }

        .input-field label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.75);
          margin-bottom: 0.35rem;
        }

        .input-field input,
        .input-field textarea,
        .input-field select {
          width: 100%;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          padding: 0.65rem 0.85rem;
          color: #ffffff;
          font-size: 0.85rem;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .input-field input:focus,
        .input-field textarea:focus,
        .input-field select:focus {
          outline: none;
          border-color: var(--gold-primary);
        }

        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
        }

        .image-preview-picker {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 0.65rem;
        }

        .picker-thumb {
          width: 72px;
          height: 52px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid rgba(197, 155, 39, 0.4);
          flex-shrink: 0;
        }

        .picker-controls {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .upload-file-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(197, 155, 39, 0.2);
          color: var(--gold-light);
          border: 1px dashed rgba(197, 155, 39, 0.5);
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          width: fit-content;
        }

        .upload-file-btn input[type="file"],
        .upload-file-btn-sm input[type="file"] {
          display: none;
        }

        .upload-file-btn-sm {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(197, 155, 39, 0.2);
          color: var(--gold-light);
          border: 1px dashed rgba(197, 155, 39, 0.5);
          padding: 4px 9px;
          border-radius: 6px;
          font-size: 0.725rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }

        .item-card-editor {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.25rem;
        }

        .item-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.85rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--gold-light);
        }

        .delete-item-btn {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          padding: 4px;
          border-radius: 4px;
          cursor: pointer;
        }

        /* Room Gallery Manager Styles */
        .room-gallery-manager {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(197, 155, 39, 0.25);
          border-radius: 8px;
          padding: 0.75rem;
          margin-bottom: 1rem;
        }

        .gallery-thumbs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
          gap: 0.6rem;
          margin-bottom: 0.75rem;
        }

        .gallery-thumb-card {
          position: relative;
          height: 68px;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: #000;
        }

        .thumb-preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumb-actions-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 3px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .gallery-thumb-card:hover .thumb-actions-overlay {
          opacity: 1;
        }

        .cover-btn {
          background: rgba(197, 155, 39, 0.85);
          color: #1a140b;
          border: none;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 5px;
          border-radius: 3px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 2px;
          width: 100%;
          justify-content: center;
        }

        .cover-btn.is-cover {
          background: #22c55e;
          color: #fff;
        }

        .delete-photo-btn {
          background: rgba(239, 68, 68, 0.8);
          color: #fff;
          border: none;
          padding: 2px 6px;
          border-radius: 3px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .add-photo-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .url-add-group {
          flex: 1;
          display: flex;
          gap: 0.35rem;
          min-width: 180px;
        }

        .url-add-group input {
          flex: 1;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 4px;
          padding: 4px 7px;
          font-size: 0.75rem;
          color: #fff;
        }

        .add-subitem-btn {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.725rem;
          cursor: pointer;
          white-space: nowrap;
        }

        .hero-badges-editor-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .badge-edit-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .badge-edit-row input {
          flex: 1;
        }

        /* Right Preview Viewport */
        .admin-live-preview-viewport {
          height: calc(100vh - 60px);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: #0f0c08;
        }

        .preview-iframe-wrapper {
          height: 100%;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          flex-direction: column;
          transition: width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .preview-iframe-wrapper.preview-desktop {
          width: 100%;
        }

        .preview-iframe-wrapper.preview-tablet {
          width: 768px;
        }

        .preview-iframe-wrapper.preview-mobile {
          width: 390px;
        }

        .preview-top-mock-bar {
          height: 32px;
          background: #2b2318;
          display: flex;
          align-items: center;
          padding: 0 0.85rem;
          gap: 6px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          flex-shrink: 0;
        }

        .mock-dot {
          width: 10px;
          height: 10px;
          border-radius: 9999px;
        }
        .mock-dot.red { background: #ef4444; }
        .mock-dot.yellow { background: #f59e0b; }
        .mock-dot.green { background: #10b981; }

        .mock-url-bar {
          margin-left: 0.5rem;
          font-size: 0.725rem;
          color: rgba(255, 255, 255, 0.55);
          background: rgba(0, 0, 0, 0.35);
          padding: 2px 10px;
          border-radius: 4px;
          flex: 1;
        }

        .preview-iframe {
          flex: 1;
          width: 100%;
          border: none;
        }

        /* Add Room Dialog Styles */
        .modal-backdrop-dialog {
          position: fixed;
          inset: 0;
          z-index: 1000000;
          background: rgba(0, 0, 0, 0.82);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .add-room-dialog-card {
          background: #241c14;
          border: 1.5px solid rgba(197, 155, 39, 0.4);
          border-radius: var(--radius-lg);
          max-width: 650px;
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
          overflow: hidden;
        }

        .dialog-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dialog-header h3 {
          font-size: 1.2rem;
          color: var(--gold-light);
          margin-bottom: 0.2rem;
        }

        .dialog-header p {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .close-dialog-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          padding: 4px;
        }

        .close-dialog-btn:hover {
          color: #fff;
        }

        .dialog-form-scroll {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
        }

        .dialog-action-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 0.85rem;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn-cancel-dialog {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.65rem 1.25rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .btn-submit-dialog {
          background: var(--gold-gradient);
          color: #1a140b;
          border: none;
          padding: 0.65rem 1.5rem;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .admin-loading-screen {
          position: fixed;
          inset: 0;
          z-index: 999999;
          background: #18140e;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: var(--gold-light);
        }

        .spin-icon {
          animation: spin 3s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Highlighting flash when navigated from preview */
        .cms-editor-highlight-flash {
          outline: 3px solid #f5c443 !important;
          outline-offset: 3px !important;
          box-shadow: 0 0 30px rgba(245, 196, 67, 0.6) !important;
          background-color: rgba(245, 196, 67, 0.12) !important;
          transition: all 0.3s ease !important;
          animation: editorHighlightPulse 1.2s ease-in-out infinite alternate !important;
        }

        @keyframes editorHighlightPulse {
          0% {
            outline-color: #f5c443;
            box-shadow: 0 0 15px rgba(245, 196, 67, 0.4);
          }
          100% {
            outline-color: #ffe699;
            box-shadow: 0 0 35px rgba(245, 196, 67, 0.85);
          }
        }

        `}</style>
    </div>
  );
}
