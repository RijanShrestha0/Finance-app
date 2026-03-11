import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import useNotifications from '../hooks/useNotifications';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { addNotification } = useNotifications();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
  }, [user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      addNotification('Name and email are required');
      return;
    }

    try {
      setIsSaving(true);
      await updateProfile(name.trim(), email.trim());
      addNotification('Profile updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      addNotification(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="Empty"></div>
      <div className="page-content">
        <div className="profile-page-card">
          <h2 className="profile-title">Profile</h2>
          <p className="profile-subtitle">Manage your account details.</p>

          <form className="profile-form" onSubmit={handleSubmit}>
            <label className="profile-label" htmlFor="profile-name">Full Name</label>
            <input
              id="profile-name"
              className="profile-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />

            <label className="profile-label" htmlFor="profile-email">Email</label>
            <input
              id="profile-email"
              type="email"
              className="profile-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <label className="profile-label" htmlFor="profile-id">User ID</label>
            <input
              id="profile-id"
              className="profile-input"
              value={user?.id || ''}
              readOnly
            />

            <button type="submit" className="profile-save-btn" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
