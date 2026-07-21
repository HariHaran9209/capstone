import React, { useState } from 'react';
import SettingsForm from './components/SettingsForm';
import Toast from './components/Toast';

export default function App() {
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message, type = 'success') => {
    const id = Date.now();
    const newToast = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="app-container">
      {/* App Header */}
      <header className="app-header">
        <div>
          <div className="brand-badge">
            <span></span> FlyRank AI Suite v2.4
          </div>
          <h1>Account & App Settings</h1>
          <p>Configure profile preferences, security policies, notifications, and AI model parameters.</p>
        </div>
        <div className="header-meta">
          <div className="live-indicator">
            <span className="pulse-dot"></span>
            Validation Engine Active
          </div>
        </div>
      </header>

      {/* Main Settings Form */}
      <SettingsForm onSaveSuccess={(msg) => addToast('Success', msg, 'success')} />

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
