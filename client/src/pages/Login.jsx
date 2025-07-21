import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';

    function Login() {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const navigate = useNavigate();

      const handleLogin = async () => {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          navigate('/starting');
        } else {
          alert('Login failed');
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
              style={{ width: '100%', padding: '8px', marginBottom: '12px', backgroundColor: '#111', border: '1px solid #333', borderRadius: '4px', color: 'white' }}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{ width: '100%', padding: '8px', marginBottom: '12px', backgroundColor: '#111', border: '1px solid #333', borderRadius: '4px', color: 'white' }}
            />
            <button
              onClick={handleLogin}
              style={{ backgroundColor: '#4ade80', color: '#0a0a0a', padding: '12px', width: '100', borderRadius: '8px', cursor: 'pointer' }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#38ef7d')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#4ade80')}
            >
              Login
            </button>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button onClick={() => handleOAuth('google')} style={{ color: '#4ade80', marginRight: '10px' }}>Login with Google</button>
              <button onClick={() => handleOAuth('github')} style={{ color: '#4ade80' }}>Login with GitHub</button>
            </div>
          </div>
        </div>
      );
    }

    export default Login;