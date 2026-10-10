import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { LogIn, AlertCircle } from 'lucide-react';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  const doLogin = async (username, password) => {
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userRole', res.data.role);
      localStorage.setItem('username', res.data.username);

      if (onLoginSuccess) {
        onLoginSuccess(res.data.role);
      }

      if (res.data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/organizer');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid username or password. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    doLogin(credentials.username, credentials.password);
  };

  const handleQuickLogin = (user, pass) => {
    setCredentials({ username: user, password: pass });
    doLogin(user, pass);
  };

  return (
    <div className="page-container center">
      <div className="card form-card" style={{ maxWidth: '440px', width: '100%', margin: '2rem auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            color: 'var(--primary-color, #4f46e5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <LogIn size={28} />
          </div>
          <h2 style={{ fontSize: '1.8rem', margin: 0, fontWeight: '700' }}>Staff Login</h2>
          <p style={{ color: 'var(--text-muted, #64748b)', marginTop: '6px', fontSize: '0.95rem' }}>
            Portal access for Administrators and Event Organizers
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#dc2626',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <Input
              label="Username"
              name="username"
              required
              value={credentials.username}
              onChange={handleChange}
              placeholder="e.g. admin or organizer"
              autoFocus
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <Input
              label="Password"
              type="password"
              name="password"
              required
              value={credentials.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <Button
            type="primary"
            htmlType="submit"
            className="btn-full"
            disabled={loading}
            style={{ width: '100%', padding: '12px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>

        {/* Quick Demo Login Buttons */}
        <div style={{
          marginTop: '2rem',
          padding: '14px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          fontSize: '0.85rem'
        }}>
          <p style={{ fontWeight: '600', margin: '0 0 8px', color: '#334155' }}>
            Quick Demo Login (One-Click):
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', 'admin123')}
              style={{
                flex: 1,
                padding: '8px 10px',
                background: '#e0e7ff',
                color: '#3730a3',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: '600'
              }}
            >
              Admin Login
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('organizer', 'org123')}
              style={{
                flex: 1,
                padding: '8px 10px',
                background: '#f1f5f9',
                color: '#334155',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: '600'
              }}
            >
              Organizer Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
