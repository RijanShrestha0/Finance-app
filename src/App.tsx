import { useEffect, useState } from 'react';
import './App.css'
import { Sidebar } from './pages/dashboard/Sidebar'
import Headers from './pages/dashboard/Header';
import ToastContainer from './components/ui/ToastContainer';
import useNotifications from './hooks/useNotifications';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

function App() {
  const location = useLocation();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  // Get page name from route path
  const getPageFromPath = (path: string) => {
    const pathMap: { [key: string]: string } = {
      '/': 'Dashboard',
      '/dashboard': 'Dashboard',
      '/transactions': 'Transactions',
      '/budget': 'Budget',
      '/analytics': 'Analytics',
      '/settings': 'Settings',
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
    const timer = setTimeout(() => {
      addNotification("Welcome back! Your monthly report is ready.");
    }, 2000);
    return () => clearTimeout(timer);
  }, [addNotification]);

  const handleNavigate = (page: string) => {
    setActivePage(page);
    const routeMap: { [key: string]: string } = {
      'Dashboard': '/dashboard',
      'Transactions': '/transactions',
      'Budget': '/budget',
      'Analytics': '/analytics',
      'Settings': '/settings',
    };
    navigate(routeMap[page] || '/');
  };

  return (
    <>
    
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <Headers activePage={activePage} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
