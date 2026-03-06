import { useEffect, useState } from 'react';
import './App.css'
import { Sidebar } from './pages/dashboard/Sidebar'
import Headers from './pages/dashboard/Header';
import ToastContainer from './components/ui/ToastContainer';
import useNotifications from './hooks/useNotifications';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
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
      <Headers />
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
