import React, { useState, useEffect } from 'react';

interface ConnectionRequest {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_email: string;
  created_at: string;
}

const ConnectionRequests: React.FC = () => {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : { 'Content-Type': 'application/json' };
  };

  const loadRequests = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/connections/requests', {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in to view connection requests');
          return;
        }
        throw new Error('Failed to load connection requests');
      }

      const data = await response.json();
      setRequests(data.requests || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAccept = async (requestId: string, senderName: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/connections/requests/${requestId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: 'accepted'
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert('Please log in to accept connection requests');
          return;
        }
        throw new Error('Failed to accept connection');
      }

      alert(`Connected with ${senderName}!`);
      setRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (err: any) {
      alert(err.message || 'Failed to accept connection');
    }
  };

  const handleReject = async (requestId: string, senderName: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/connections/requests/${requestId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: 'rejected'
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert('Please log in to reject connection requests');
          return;
        }
        throw new Error('Failed to reject connection');
      }

      alert(`Connection request from ${senderName} rejected`);
      setRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (err: any) {
      alert(err.message || 'Failed to reject connection');
    }
  };

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
        <p>Loading connection requests...</p>
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
        Connection Requests ({requests.length})
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

      {requests.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          color: '#6b7280'
        }}>
          <p>No pending connection requests</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            When someone sends you a connection request, it will appear here.
          </p>
        </div>
      ) : (
        <div>
          {requests.map((request) => (
            <div
              key={request.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                marginBottom: '0.75rem',
                background: '#f9fafb'
              }}
            >
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.25rem 0', color: '#1f2937' }}>
                  {request.sender_name}
                </h4>
                <p style={{ margin: '0 0 0.25rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
                  {request.sender_email}
                </p>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.75rem' }}>
                  Request sent {new Date(request.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleAccept(request.id, request.sender_name)}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(request.id, request.sender_name)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConnectionRequests;
