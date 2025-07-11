import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { UserProvider } from './contexts/UserContext'; // ✅ import context

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider> {/* ✅ wrap App in provider */}
      <App />
    </UserProvider>
  </StrictMode>
);
