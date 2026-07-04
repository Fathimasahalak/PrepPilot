import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('name', data.name);
      navigate('/setup');
    } catch (err) {
      setError('Invalid email or password');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="auth-brand">PrepPilot</p>
        <h1 className="auth-heading">Welcome back. Let's get you ready.</h1>

        <form onSubmit={handleSubmit}>
          <label className="auth-label">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />

          <label className="auth-label">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-button">Log in</button>
        </form>

        <p className="auth-footer">
          New here? <Link to="/signup" className="auth-link">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;