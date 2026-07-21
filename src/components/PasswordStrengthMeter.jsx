import React from 'react';

export default function PasswordStrengthMeter({ password }) {
  if (!password) return null;

  const getStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const score = getStrength(password);
  const getLabel = () => {
    switch (score) {
      case 0:
      case 1:
        return { text: 'Weak', class: 'active-weak', color: '#f43f5e' };
      case 2:
      case 3:
        return { text: 'Medium', class: 'active-medium', color: '#f59e0b' };
      case 4:
        return { text: 'Strong', class: 'active-strong', color: '#10b981' };
      default:
        return { text: '', class: '', color: '' };
    }
  };

  const info = getLabel();

  return (
    <div className="strength-meter">
      <div className="strength-bar-bg">
        <div className={`strength-segment ${score >= 1 ? info.class : ''}`} />
        <div className={`strength-segment ${score >= 2 ? info.class : ''}`} />
        <div className={`strength-segment ${score >= 3 ? info.class : ''}`} />
        <div className={`strength-segment ${score >= 4 ? info.class : ''}`} />
      </div>
      <div className="strength-label">
        <span>Password Strength: <strong style={{ color: info.color }}>{info.text}</strong></span>
        <span>{score}/4 criteria met</span>
      </div>
    </div>
  );
}
