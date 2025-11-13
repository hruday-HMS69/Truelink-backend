import React, { useState } from 'react';
import ProfileEditor from './ProfileEditor';
import UserSearch from './UserSearch';
import ConnectionRequests from './ConnectionRequests';
import ConnectionsList from './ConnectionsList';

interface User {
  id: string;
  email: string;
  full_name: string;
  email_verified: boolean;
  created_at: string;
}

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'search' | 'requests' | 'connections' | null>(null);

  const getTabButtonStyle = (tabName: string) => ({
    background: activeTab === tabName ? '#6b7280' : '#2563eb',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem'
  });

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1200px', 
      margin: '0 auto',
      background: '#f8fafc',
      minHeight: 'calc(100vh - 80px)'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>
          Welcome to TrueLink, {user.full_name}! 🎉
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
          Your privacy-focused professional network
        </p>
      </div>

      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ margin: '0 0 1.5rem 0', color: '#374151' }}>Network Management</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveTab(activeTab === 'profile' ? null : 'profile')}
            style={getTabButtonStyle('profile')}
          >
            {activeTab === 'profile' ? 'Close Profile' : '✏️ Edit Profile'}
          </button>
          <button 
            onClick={() => setActiveTab(activeTab === 'search' ? null : 'search')}
            style={getTabButtonStyle('search')}
          >
            {activeTab === 'search' ? 'Close Search' : '🔍 Find Connections'}
          </button>
          <button 
            onClick={() => setActiveTab(activeTab === 'requests' ? null : 'requests')}
            style={getTabButtonStyle('requests')}
          >
            📩 Connection Requests
          </button>
          <button 
            onClick={() => setActiveTab(activeTab === 'connections' ? null : 'connections')}
            style={getTabButtonStyle('connections')}
          >
            👥 My Connections
          </button>
        </div>
      </div>

      {activeTab === 'profile' && <ProfileEditor />}
      {activeTab === 'search' && <UserSearch />}
      {activeTab === 'requests' && <ConnectionRequests />}
      {activeTab === 'connections' && <ConnectionsList />}

      {!activeTab && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #2563eb'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Profile Strength</h3>
            <div style={{ 
              background: '#e5e7eb',
              borderRadius: '10px',
              height: '8px',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                background: '#2563eb',
                borderRadius: '10px',
                height: '100%',
                width: '30%'
              }}></div>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>30% complete</p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #10b981'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Your Network</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>0</p>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>connections</p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #f59e0b'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Verification</h3>
            <p style={{ fontSize: '1rem', color: '#f59e0b', margin: 0 }}>
              {user.email_verified ? '✅ Email Verified' : '⚠️ Verify Email'}
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Identity status</p>
          </div>
        </div>
      )}

      {!activeTab && (
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 1.5rem 0', color: '#374151' }}>Recent Activity</h2>
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center',
            color: '#6b7280',
            border: '2px dashed #d1d5db',
            borderRadius: '8px'
          }}>
            <p>No activity yet. Start connecting with professionals!</p>
            <button 
              onClick={() => setActiveTab('search')}
              style={{
                background: 'transparent',
                color: '#2563eb',
                border: '1px solid #2563eb',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                marginTop: '0.5rem'
              }}
            >
              Find Connections
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
