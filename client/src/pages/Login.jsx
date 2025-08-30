import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider) => {
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };

      return (
        <div style={{ backgroundColor: '#0a0a0a', color: 'white', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
          <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '24px', maxWidth: '400px', width: '100%' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '20px', textAlign: 'center' }}>Login</h1>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              style={{ width: '100%', padding: '12px', marginBottom: '12px', backgroundColor: '#111', border: '1px solid #333', borderRadius: '4px', color: 'white', fontSize: '16px' }}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{ width: '100%', padding: '12px', marginBottom: '12px', backgroundColor: '#111', border: '1px solid #333', borderRadius: '4px', color: 'white', fontSize: '16px' }}
            />
            <button
              onClick={handleLogin}
              disabled={loading}
              style={{ 
                backgroundColor: loading ? '#666' : '#4ade80', 
                color: '#0a0a0a', 
                padding: '12px', 
                width: '100%', 
                borderRadius: '8px', 
                cursor: loading ? 'not-allowed' : 'pointer',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#38ef7d')}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#4ade80')}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            <div style={{ textAlign: 'center', margin: '20px 0', color: '#666' }}>
              Don't have an account? <Link to="/register" style={{ color: '#4ade80', textDecoration: 'none' }}>Sign up here</Link>
            </div>
            
            {/* OAuth temporarily disabled due to configuration issues */}
            {false && (
              <div style={{ textAlign: 'center', borderTop: '1px solid #333', paddingTop: '20px' }}>
                <div style={{ marginBottom: '10px', color: '#888', fontSize: '14px' }}>Or continue with:</div>
                <button 
                  onClick={() => handleOAuth('google')} 
                  style={{ 
                    backgroundColor: '#1a1a1a', 
                    color: '#4ade80', 
                    border: '1px solid #4ade80', 
                    borderRadius: '6px', 
                    padding: '8px 16px', 
                    marginRight: '10px',
                    cursor: 'pointer'
                  }}
                >
                  Google
                </button>
                <button 
                  onClick={() => handleOAuth('github')} 
                  style={{ 
                    backgroundColor: '#1a1a1a', 
                    color: '#4ade80', 
                    border: '1px solid #4ade80', 
                    borderRadius: '6px', 
                    padding: '8px 16px',
                    cursor: 'pointer'
                  }}
                >
                  GitHub
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    export default Login;