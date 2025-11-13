import React, { useState, useEffect } from 'react';

interface Connection {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  profile_picture_url: string | null;
  connected_at: string;
}

const ConnectionsList: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 
      'Authorization': `Bearer ${token}` 
    } : {};
  };

  const loadConnections = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/connections', {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in to view your connections');
          return;
        }
        throw new Error('Failed to load connections');
      }

      const data = await response.json();
      setConnections(data.connections || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  if (loading) {
    return (
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <p>Loading your connections...</p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#374151' }}>
        Your Professional Network ({connections.length})
      </h2>
      
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

      {connections.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          color: '#6b7280'
        }}>
          <p>No connections yet</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Start building your network by searching for professionals and sending connection requests.
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1rem' 
        }}>
          {connections.map((connection) => (
            <div
              key={connection.id}
              style={{
                padding: '1.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                background: '#f9fafb'
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '1rem' 
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.125rem',
                  marginRight: '1rem'
                }}>
                  {connection.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: '#1f2937' }}>
                    {connection.full_name}
                  </h4>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                    {connection.email}
                  </p>
                </div>
              </div>
              
              <p style={{ 
                margin: 0, 
                color: '#9ca3af', 
                fontSize: '0.75rem',
                borderTop: '1px solid #e5e7eb',
                paddingTop: '0.75rem'
              }}>
                Connected since {new Date(connection.connected_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConnectionsList;
