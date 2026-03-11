import { useEffect, useState } from 'react';
import './App.css'
import { Sidebar } from './pages/dashboard/Sidebar'
import Headers from './pages/dashboard/Header';
import ToastContainer from './components/ui/ToastContainer';
import useNotifications from './hooks/useNotifications';
import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import useBudgetAlerts from './hooks/useBudgetAlerts';
import { useAuth } from './hooks/useAuth';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';

function App() {
  const location = useLocation();
  const { addNotification } = useNotifications();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useBudgetAlerts(Boolean(user));

  // Get page name from route path
  const getPageFromPath = (path: string) => {
    const pathMap: { [key: string]: string } = {
      '/': 'Dashboard',
      '/dashboard': 'Dashboard',
      '/transactions': 'Transactions',
      '/budget': 'Budget',
      '/analytics': 'Analytics',
      '/settings': 'Settings',
      '/profile': 'Profile',
    };
    return pathMap[path] || 'Dashboard';
  };

  // Initialize activePage from localStorage or current URL
  const [activePage, setActivePage] = useState(() => {
    const savedPage = localStorage.getItem('activePage');
    return savedPage || getPageFromPath(location.pathname);
  });

  // Sync activePage when route changes
  useEffect(() => {
    const currentPage = getPageFromPath(location.pathname);
    setActivePage(currentPage);
  }, [location.pathname]);

  // Save activePage to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('activePage', activePage);
  }, [activePage]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const timer = setTimeout(() => {
      addNotification("Welcome back! Your monthly report is ready.");
    }, 2000);

    return () => clearTimeout(timer);
  }, [addNotification, user]);

  if (isLoading) {
    return null;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    );
  }

  const handleNavigate = (page: string) => {
    setActivePage(page);
    const routeMap: { [key: string]: string } = {
      'Dashboard': '/dashboard',
      'Transactions': '/transactions',
      'Budget': '/budget',
      'Analytics': '/analytics',
      'Settings': '/settings',
      'Profile': '/profile',
    };
    navigate(routeMap[page] || '/');
  };

  return (
    <>
    
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <Headers activePage={activePage} />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/signin" element={<Navigate to="/dashboard" replace />} />
        <Route path="/signup" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
