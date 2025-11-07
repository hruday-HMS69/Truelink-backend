import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import './App.css';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ 
        id: '1',
        full_name: 'Test User', 
        email: 'test@example.com',
        email_verified: false 
      });
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f8fafc'
      }}>
        <div style={{ 
          textAlign: 'center',
          padding: '2rem',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#2563eb', marginBottom: '1rem' }}>🏢 TrueLink</h2>
          <p>Loading your professional dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {user ? (
        <>
          <Navbar user={user} onLogout={logout} />
          <Dashboard user={user} />
        </>
      ) : (
        <div style={{ 
          minHeight: '100vh', 
          backgroundColor: '#dbeafe', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '2rem', 
            borderRadius: '8px', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '400px'
          }}>
            <h1 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#2563eb', 
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              Sign in to TrueLink
            </h1>
            <button 
              onClick={() => {
                localStorage.setItem('token', 'test-token');
                setUser({ 
                  id: '1',
                  full_name: 'Test User', 
                  email: 'test@example.com',
                  email_verified: false 
                });
              }}
              style={{
                width: '100%',
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '12px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Simulate Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;