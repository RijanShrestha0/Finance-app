import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Auth.css';

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      setIsSubmitting(true);
      await login(email.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Sign In</h1>
        <p className="auth-subtitle">Access your budget dashboard.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label" htmlFor="signin-email">Email</label>
          <input
            id="signin-email"
            type="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <label className="auth-label" htmlFor="signin-password">Password</label>
          <input
            id="signin-password"
            type="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          {error ? <p className="auth-error">{error}</p> : null}

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          New here? <Link to="/signup" className="auth-link">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
