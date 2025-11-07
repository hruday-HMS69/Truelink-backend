import React from 'react';

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav style={{
      background: 'white',
      padding: '1rem 2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '2px solid #2563eb'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h1 style={{ 
          margin: 0, 
          color: '#2563eb',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          🏢 TrueLink
        </h1>
        <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
          Professional Network
        </span>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span style={{ color: '#374151' }}>Welcome, {user?.full_name}</span>
        <button 
          onClick={onLogout}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;