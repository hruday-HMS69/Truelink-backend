import React, { useState } from 'react';

interface User {
  id: string;
  email: string;
  full_name: string;
  headline?: string;
}

const UserSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:8080/api/connections/search?q=${encodeURIComponent(searchTerm)}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setSearchResults(data.users || []);
    } catch (err: any) {
      setError(err.message || 'Search failed');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (userId: string) => {
    try {
      const response = await fetch('http://localhost:8080/api/connections/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          receiver_id: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 409) {
          setSearchResults(prev => prev.filter(user => user.id !== userId));
          alert(`You've already sent a connection request to ${searchResults.find(u => u.id === userId)?.full_name}`);
          return;
        }
        
        throw new Error(errorData.error || 'Failed to send connection request');
      }

      const result = await response.json();
      alert(`Connection request sent to ${searchResults.find(u => u.id === userId)?.full_name}!`);
      setSearchResults(prev => prev.filter(user => user.id !== userId));
      
    } catch (err: any) {
      alert(err.message || 'Failed to send connection request');
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
      <h2 style={{ marginBottom: '1.5rem', color: '#374151' }}>Find Professionals</h2>
      
      <div style={{ 
        background: '#f0f9ff', 
        border: '1px solid #bae6fd',
        borderRadius: '6px',
        padding: '1rem',
        marginBottom: '1.5rem'
      }}>
        <p style={{ margin: 0, color: '#0369a1', fontSize: '0.875rem' }}>
          💡 <strong>Tip:</strong> Search for "test" or "example.com" to find other professionals in your network.
        </p>
      </div>
      
      <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          />
          <button
            type="submit"
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
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

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

      <div>
        {searchResults.length > 0 ? (
          <div>
            <h3 style={{ marginBottom: '1rem', color: '#374151' }}>
              Found {searchResults.length} professional(s)
            </h3>
            {searchResults.map((user) => (
              <div
                key={user.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  marginBottom: '0.5rem',
                  background: '#f9fafb'
                }}
              >
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: '#1f2937' }}>
                    {user.full_name}
                  </h4>
                  <p style={{ margin: '0 0 0.25rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
                    {user.email}
                  </p>
                  {user.headline && (
                    <p style={{ margin: 0, color: '#4b5563', fontSize: '0.875rem' }}>
                      {user.headline}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleConnect(user.id)}
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
                  Connect
                </button>
              </div>
            ))}
          </div>
        ) : searchTerm && !loading && (
          <p style={{ color: '#6b7280', textAlign: 'center' }}>
            No other professionals found. Try a different search term.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserSearch;
