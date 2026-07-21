import React, { useState } from 'react';
import PasswordStrengthMeter from './PasswordStrengthMeter';

export default function SettingsForm({ onSaveSuccess }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Profile
    fullName: 'Hari Haran',
    username: 'hari_flyrank',
    email: 'hari@flyrank.ai',
    bio: 'Lead AI Engineer building scalable ranking & search optimization engines.',
    role: 'Senior AI Engineer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',

    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    enable2FA: true,
    sessionTimeout: '30',

    // Notifications
    emailNotifications: true,
    pushAlerts: true,
    weeklyDigest: false,
    alertFrequency: 'realtime',

    // FlyRank AI Models
    enableAiEngine: true,
    apiKey: 'fr-live-98f24a1b092837d',
    aiModel: 'flyrank-ultra-v2',
    temperature: 0.7,
    maxTokens: 2048,
    webSearchEnabled: true
  });

  // Errors State
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Field validation function
  const validateField = (name, value, currentFormData = formData) => {
    let error = '';

    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 3) {
          error = 'Full name must be at least 3 characters';
        }
        break;

      case 'username':
        if (!value.trim()) {
          error = 'Username is required';
        } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(value.trim())) {
          error = 'Username must be 3-20 characters (letters, numbers, underscores only)';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'bio':
        if (value.length > 250) {
          error = 'Bio cannot exceed 250 characters';
        }
        break;

      case 'newPassword':
        if (value) {
          if (value.length < 8) {
            error = 'Password must be at least 8 characters';
          } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(value)) {
            error = 'Must include uppercase, lowercase, number & special character';
          }
        }
        break;

      case 'confirmPassword':
        if (currentFormData.newPassword && value !== currentFormData.newPassword) {
          error = 'Passwords do not match';
        }
        break;

      case 'apiKey':
        if (currentFormData.enableAiEngine) {
          if (!value.trim()) {
            error = 'API Key is required when AI Engine is enabled';
          } else if (!/^(fr-|sk-)[a-zA-Z0-9_-]{10,}$/.test(value.trim())) {
            error = 'API key must start with "fr-" or "sk-" followed by valid key characters';
          }
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Validate entire form across tabs
  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = ['fullName', 'username', 'email', 'bio', 'newPassword', 'confirmPassword', 'apiKey'];
    
    fieldsToValidate.forEach((field) => {
      const err = validateField(field, formData[field], formData);
      if (err) newErrors[field] = err;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    const updatedForm = { ...formData, [name]: val };
    setFormData(updatedForm);

    if (touched[name]) {
      const errorMsg = validateField(name, val, updatedForm);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }

    // Re-validate confirm password if new password changes
    if (name === 'newPassword' && touched.confirmPassword) {
      const confirmErr = validateField('confirmPassword', formData.confirmPassword, updatedForm);
      setErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
    }
  };

  // Handle Blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, value, formData);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields touched
    const allTouched = {
      fullName: true,
      username: true,
      email: true,
      bio: true,
      newPassword: true,
      confirmPassword: true,
      apiKey: true
    };
    setTouched(allTouched);

    const isValid = validateForm();
    if (!isValid) {
      // Find which tab has errors and switch to it if needed
      if (errors.fullName || errors.username || errors.email || errors.bio) {
        setActiveTab('profile');
      } else if (errors.newPassword || errors.confirmPassword) {
        setActiveTab('security');
      } else if (errors.apiKey) {
        setActiveTab('ai');
      }
      return;
    }

    setIsSubmitting(true);

    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      onSaveSuccess('Settings saved successfully!');
    }, 800);
  };

  // Calculate Tab Error Count
  const getTabErrorCount = (tabName) => {
    let count = 0;
    if (tabName === 'profile') {
      if (errors.fullName) count++;
      if (errors.username) count++;
      if (errors.email) count++;
      if (errors.bio) count++;
    } else if (tabName === 'security') {
      if (errors.newPassword) count++;
      if (errors.confirmPassword) count++;
    } else if (tabName === 'ai') {
      if (errors.apiKey) count++;
    }
    return count;
  };

  return (
    <div className="settings-grid">
      {/* Sidebar Navigation */}
      <nav className="settings-sidebar">
        <button
          type="button"
          className={`sidebar-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Profile & Identity
          {getTabErrorCount('profile') > 0 && <span className="tab-badge">{getTabErrorCount('profile')}</span>}
        </button>

        <button
          type="button"
          className={`sidebar-tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Account & Security
          {getTabErrorCount('security') > 0 && <span className="tab-badge">{getTabErrorCount('security')}</span>}
        </button>

        <button
          type="button"
          className={`sidebar-tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          Notifications
        </button>

        <button
          type="button"
          className={`sidebar-tab ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
          </svg>
          FlyRank AI Models
          {getTabErrorCount('ai') > 0 && <span className="tab-badge">{getTabErrorCount('ai')}</span>}
        </button>
      </nav>

      {/* Main Settings Card Form */}
      <form onSubmit={handleSubmit} className="settings-card" noValidate>
        {/* Tab 1: Profile & Identity */}
        {activeTab === 'profile' && (
          <div>
            <div className="section-header">
              <h2>👤 Profile Configuration</h2>
              <p>Manage your public identity, bio, and contact credentials.</p>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">
                  Full Name <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-control ${touched.fullName ? (errors.fullName ? 'is-invalid' : 'is-valid') : ''}`}
                  placeholder="e.g. Hari Haran"
                />
                {touched.fullName && errors.fullName && <div className="error-text">⚠️ {errors.fullName}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="username">
                  Username <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-control ${touched.username ? (errors.username ? 'is-invalid' : 'is-valid') : ''}`}
                  placeholder="e.g. hari_flyrank"
                />
                {touched.username && errors.username && <div className="error-text">⚠️ {errors.username}</div>}
              </div>

              <div className="form-group col-span-2">
                <label className="form-label" htmlFor="email">
                  Email Address <span className="required-star">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-control ${touched.email ? (errors.email ? 'is-invalid' : 'is-valid') : ''}`}
                  placeholder="name@company.com"
                />
                {touched.email && errors.email && <div className="error-text">⚠️ {errors.email}</div>}
              </div>

              <div className="form-group col-span-2">
                <label className="form-label" htmlFor="bio">
                  Bio / Overview
                  <span className="char-counter">{formData.bio.length} / 250</span>
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-control ${touched.bio ? (errors.bio ? 'is-invalid' : 'is-valid') : ''}`}
                  placeholder="Describe your role or domain expertise..."
                />
                {touched.bio && errors.bio && <div className="error-text">⚠️ {errors.bio}</div>}
              </div>

              <div className="form-group col-span-2">
                <label className="form-label" htmlFor="role">Job Title / Role</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Security & Password */}
        {activeTab === 'security' && (
          <div>
            <div className="section-header">
              <h2>🔒 Security & Credentials</h2>
              <p>Update your authentication password and account protection settings.</p>
            </div>

            <div className="form-grid full-width">
              <div className="form-group">
                <label className="form-label" htmlFor="currentPassword">Current Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="form-control has-right-icon"
                    placeholder="Enter current password to make changes"
                  />
                  <button
                    type="button"
                    className="input-icon-right"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '👁️‍🗨️' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="newPassword">New Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-control has-right-icon ${touched.newPassword ? (errors.newPassword ? 'is-invalid' : 'is-valid') : ''}`}
                    placeholder="Min 8 characters (uppercase, number, special)"
                  />
                  <button
                    type="button"
                    className="input-icon-right"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️‍🗨️' : '👁️'}
                  </button>
                </div>
                <PasswordStrengthMeter password={formData.newPassword} />
                {touched.newPassword && errors.newPassword && <div className="error-text">⚠️ {errors.newPassword}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-control ${touched.confirmPassword ? (errors.confirmPassword ? 'is-invalid' : 'is-valid') : ''}`}
                  placeholder="Re-enter your new password"
                />
                {touched.confirmPassword && errors.confirmPassword && <div className="error-text">⚠️ {errors.confirmPassword}</div>}
              </div>

              <div className="toggle-group" style={{ marginTop: '1rem' }}>
                <div className="toggle-info">
                  <h4>Two-Factor Authentication (2FA)</h4>
                  <p>Require an authenticator app token upon login for maximum account security.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="enable2FA"
                    checked={formData.enable2FA}
                    onChange={handleChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label className="form-label" htmlFor="sessionTimeout">Inactivity Session Timeout</label>
                <select
                  id="sessionTimeout"
                  name="sessionTimeout"
                  value={formData.sessionTimeout}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes (Recommended)</option>
                  <option value="60">1 Hour</option>
                  <option value="720">12 Hours</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Notifications */}
        {activeTab === 'notifications' && (
          <div>
            <div className="section-header">
              <h2>🔔 Notification Preferences</h2>
              <p>Control when and how you receive alerts, digests, and system updates.</p>
            </div>

            <div className="toggle-group">
              <div className="toggle-info">
                <h4>Email Alerts & System Status</h4>
                <p>Receive notifications regarding rank updates and critical API statuses.</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleChange}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="toggle-group">
              <div className="toggle-info">
                <h4>Browser Push Notifications</h4>
                <p>Instant pop-up notifications for real-time model completions and alerts.</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="pushAlerts"
                  checked={formData.pushAlerts}
                  onChange={handleChange}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="toggle-group">
              <div className="toggle-info">
                <h4>Weekly Analytics Summary</h4>
                <p>Receive a curated summary report every Monday morning.</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="weeklyDigest"
                  checked={formData.weeklyDigest}
                  onChange={handleChange}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label className="form-label" htmlFor="alertFrequency">Alert Dispatch Cadence</label>
              <select
                id="alertFrequency"
                name="alertFrequency"
                value={formData.alertFrequency}
                onChange={handleChange}
                className="form-control"
              >
                <option value="realtime">Real-time (Immediate)</option>
                <option value="hourly">Hourly Batch</option>
                <option value="daily">Daily Digest</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab 4: AI Model Preferences */}
        {activeTab === 'ai' && (
          <div>
            <div className="section-header">
              <h2>🤖 FlyRank AI Model Engine</h2>
              <p>Configure model temperature, token limits, and custom API credentials.</p>
            </div>

            <div className="toggle-group">
              <div className="toggle-info">
                <h4>Enable FlyRank AI Engine</h4>
                <p>Allow automated smart search and ranking model inferences.</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="enableAiEngine"
                  checked={formData.enableAiEngine}
                  onChange={handleChange}
                />
                <span className="slider"></span>
              </label>
            </div>

            {formData.enableAiEngine && (
              <div className="form-grid full-width" style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="apiKey">
                    FlyRank API Key <span className="required-star">*</span>
                  </label>
                  <input
                    type="password"
                    id="apiKey"
                    name="apiKey"
                    value={formData.apiKey}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-control ${touched.apiKey ? (errors.apiKey ? 'is-invalid' : 'is-valid') : ''}`}
                    placeholder="fr-live-xxxxxxxxxxxxxxxx"
                  />
                  {touched.apiKey && errors.apiKey && <div className="error-text">⚠️ {errors.apiKey}</div>}
                  <div className="helper-text">Key should start with "fr-" or "sk-".</div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="aiModel">Default Ranking Model</label>
                  <select
                    id="aiModel"
                    name="aiModel"
                    value={formData.aiModel}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="flyrank-ultra-v2">FlyRank Ultra v2 (Highest Accuracy)</option>
                    <option value="deeprank-flash-v1">DeepRank Flash v1 (Low Latency)</option>
                    <option value="standard-search-v3">Standard Search Engine v3</option>
                  </select>
                </div>

                <div className="form-group">
                  <div className="range-header">
                    <label className="form-label" htmlFor="temperature">Model Temperature (Creativity)</label>
                    <span className="range-value">{formData.temperature}</span>
                  </div>
                  <input
                    type="range"
                    id="temperature"
                    name="temperature"
                    min="0"
                    max="1"
                    step="0.05"
                    value={formData.temperature}
                    onChange={handleChange}
                  />
                  <div className="helper-text">Lower values yield deterministic ranking; higher values boost creative discovery.</div>
                </div>

                <div className="toggle-group" style={{ marginTop: '0.5rem' }}>
                  <div className="toggle-info">
                    <h4>Live Web Search Augmentation</h4>
                    <p>Fetch real-time web results when calculating rankings.</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="webSearchEnabled"
                      checked={formData.webSearchEnabled}
                      onChange={handleChange}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setErrors({});
              setTouched({});
            }}
          >
            Clear Errors
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                  <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1"></path>
                </svg>
                Saving Changes...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Settings
              </>
            )}
          </button>
        </div>

        {/* Live State JSON Preview */}
        <div className="preview-card">
          <div className="preview-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            Live Validated Form State (JSON)
          </div>
          <pre className="preview-json">
            {JSON.stringify(
              {
                ...formData,
                apiKey: formData.apiKey ? '••••••••••••••••' : '',
                currentPassword: formData.currentPassword ? '••••••••' : '',
                newPassword: formData.newPassword ? '••••••••' : '',
                confirmPassword: formData.confirmPassword ? '••••••••' : ''
              },
              null,
              2
            )}
          </pre>
        </div>
      </form>
    </div>
  );
}
