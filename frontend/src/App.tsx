import React from 'react';
import './App.css';

const App: React.FC = () => {
  return (
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
        borderRadius: '0.5rem', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          color: '#2563eb', 
          marginBottom: '1rem' 
        }}>
          TrueLink Test
        </h1>
        <p style={{ color: '#374151' }}>
          Basic styling test - if you see this, the app is running!
        </p>
        <button style={{ 
          marginTop: '1rem', 
          backgroundColor: '#3b82f6', 
          color: 'white', 
          padding: '0.5rem 1rem', 
          borderRadius: '0.25rem',
          border: 'none',
          cursor: 'pointer'
        }}>
          Test Button
        </button>
      </div>
    </div>
  );
};

export default App;
