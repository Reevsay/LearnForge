import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !username || !email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
          role: 'student',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! You can now login.');
        navigate('/login');
      } else {
        alert(data.error || 'Error registering user');
      }
    } catch (error) {
      console.error('Register error:', error);
      alert('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: 'white', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
      <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '24px', maxWidth: '400px', width: '100%' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '20px', textAlign: 'center' }}>Sign Up</h1>
        
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          style={{ width: '100%', padding: '12px', marginBottom: '12px', backgroundColor: '#111', border: '1px solid #333', borderRadius: '4px', color: 'white', fontSize: '16px' }}
        />
        
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          style={{ width: '100%', padding: '12px', marginBottom: '12px', backgroundColor: '#111', border: '1px solid #333', borderRadius: '4px', color: 'white', fontSize: '16px' }}
        />
        
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
          onClick={handleRegister}
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
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
        
        <div style={{ textAlign: 'center', margin: '20px 0', color: '#666' }}>
          Already have an account? <Link to="/login" style={{ color: '#4ade80', textDecoration: 'none' }}>Login here</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;