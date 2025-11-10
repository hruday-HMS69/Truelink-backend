import React, { useState, useEffect } from 'react';

interface ProfileData {
  headline?: string;
  summary?: string;
  location?: string;
  website?: string;
}

interface ProfileEditorProps {
  onSave?: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ onSave }) => {
  const [headline, setHeadline] = useState('');
  const [summary, setSummary] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let mounted = true;
    
    const loadProfile = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/profile/me');
        if (response.ok && mounted) {
          const profileData: ProfileData = await response.json();
          setHeadline(profileData.headline || '');
          setSummary(profileData.summary || '');
          setLocation(profileData.location || '');
          setWebsite(profileData.website || '');
        }
      } catch (err) {
        if (mounted) {
          console.log('No existing profile data or failed to load');
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const profileData = {
        headline: headline || null,
        summary: summary || null,
        location: location || null,
        website: website || null,
      };

      const response = await fetch('http://localhost:8080/api/profile/me', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save profile: ${response.status}`);
      }

      await response.json();
      setSuccess('Profile saved successfully!');
      
      if (onSave) {
        setTimeout(onSave, 100);
      }

      setTimeout(() => setSuccess(''), 3000);

    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#374151' }}>Edit Your Professional Profile</h2>
      
      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '0.75rem',
          borderRadius: '6px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#166534',
          padding: '0.75rem',
          borderRadius: '6px',
          marginBottom: '1rem'
        }}>
          ✅ {success}
        </div>
      )}
      
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="headline" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Professional Headline
        </label>
        <input
          id="headline"
          name="headline"
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
        <label htmlFor="summary" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Professional Summary
        </label>
        <textarea
          id="summary"
          name="summary"
          placeholder="Tell us about your professional background, skills, and experience..."
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

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="location" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Location
        </label>
        <input
          id="location"
          name="location"
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

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="website" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Website
        </label>
        <input
          id="website"
          name="website"
          type="url"
          placeholder="https://yourwebsite.com"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
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
        disabled={loading}
        style={{
          background: loading ? '#9ca3af' : '#2563eb',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '1rem'
        }}
      >
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </div>
  );
};

export default ProfileEditor;