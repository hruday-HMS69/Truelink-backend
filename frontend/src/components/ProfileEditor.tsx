import React, { useState } from 'react';

const ProfileEditor: React.FC = () => {
  const [headline, setHeadline] = useState('');
  const [summary, setSummary] = useState('');
  const [location, setLocation] = useState('');
  
  const handleSave = async () => {
    // TODO: Connect to backend API
    alert('Profile saved! (Backend integration needed)');
  };

  return (
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#374151' }}>Edit Your Profile</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Professional Headline
        </label>
        <input
          type="text"
          placeholder="e.g. Senior Software Engineer at Google"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '1rem'
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Professional Summary
        </label>
        <textarea
          placeholder="Tell us about your professional background..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={4}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '1rem',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Location
        </label>
        <input
          type="text"
          placeholder="e.g. San Francisco, CA"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '1rem'
          }}
        />
      </div>

      <button
        onClick={handleSave}
        style={{
          background: '#2563eb',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        Save Profile
      </button>
    </div>
  );
};

export default ProfileEditor;
