import { useState } from 'react';
import './App.css'
import { Sidebar } from './pages/dashboard/Sidebar'
import Headers from './pages/dashboard/Header';

function App() {
  const [activePage, setActivePage] = useState('overview');
  return (
    <>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <Headers />
    </>
  )
}

export default App
