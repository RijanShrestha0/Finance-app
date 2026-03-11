import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Auth.css';

const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      await signup(name.trim(), email.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to create account';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Start tracking your money in one place.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label" htmlFor="signup-name">Full Name</label>
          <input
            id="signup-name"
            type="text"
            className="auth-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />

          <label className="auth-label" htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <label className="auth-label" htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            required
          />

          <label className="auth-label" htmlFor="signup-confirm-password">Confirm Password</label>
          <input
            id="signup-confirm-password"
            type="password"
            className="auth-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            required
          />

          {error ? <p className="auth-error">{error}</p> : null}

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/signin" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
