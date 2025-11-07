import React, { useState } from 'react';

const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = isLogin 
        ? 'http://localhost:8080/api/auth/login'
        : 'http://localhost:8080/api/auth/register';
      
      const body = isLogin
        ? { email, password }
        : { email, full_name: fullName, password };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      if (!response.ok) {
        throw new Error(isLogin ? 'Login failed' : 'Registration failed');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      window.location.reload(); // Refresh to show dashboard
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

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
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
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
          {isLogin ? 'Sign in to TrueLink' : 'Join TrueLink'}
        </h1>
        
        <p style={{ 
          color: '#6b7280', 
          textAlign: 'center',
          marginBottom: '1.5rem'
        }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            style={{
              color: '#3b82f6',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}
          
          {!isLogin && (
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}
          
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="email"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="password"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Loading...' : (isLogin ? 'Sign in' : 'Sign up')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
