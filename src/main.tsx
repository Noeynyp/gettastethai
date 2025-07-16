import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { UserProvider } from './contexts/UserContext';
import { LanguageProvider } from './contexts/LanguageContext'; // ✅ new import

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider> {/* ✅ Wrap app in LanguageProvider */}
      <UserProvider>
        <App />
      </UserProvider>
    </LanguageProvider>
  </StrictMode>
);
