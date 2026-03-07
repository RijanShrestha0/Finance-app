import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { NotificationProvider } from './context/NotificationContext.tsx'
import { TransactionProvider } from './context/TransactionContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <TransactionProvider>
          <App />
        </TransactionProvider>
      </NotificationProvider>
    </BrowserRouter>
  </StrictMode>,
)
