import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.jsx';
import { AuthProvider } from "./context/AuthContext";
import { DashboardProvider } from "./context/DashboardContext";
import { CalendarProvider } from './context/CalendarContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <DashboardProvider>
        <CalendarProvider>
          <App />
        </CalendarProvider>
      </DashboardProvider>
    </AuthProvider>
  </StrictMode>,
);