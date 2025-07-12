import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // Change from BrowserRouter
import App from './App.tsx';
import './index.css';
import './lib/i18n'; // Import i18n configuration

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <HashRouter> {/* Change from BrowserRouter */}
            <App />
        </HashRouter>
    </StrictMode>
);