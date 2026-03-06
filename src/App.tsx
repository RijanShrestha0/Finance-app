import { useEffect, useState } from 'react';
import './App.css'
import { Sidebar } from './pages/dashboard/Sidebar'
import Headers from './pages/dashboard/Header';
import ToastContainer from './components/ui/ToastContainer';
import useNotifications from './hooks/useNotifications';

function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const { addNotification } = useNotifications();
    useEffect(() => {
    const timer = setTimeout(() => {
      addNotification("Welcome back! Your monthly report is ready.");
    }, 2000);
    return () => clearTimeout(timer);
  }, [addNotification]);
  return (
    <>
    
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <Headers />

      <ToastContainer />
    </>
  )
}

export default App
