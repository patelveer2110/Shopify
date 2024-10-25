import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import ShopContextProvider from '../src/User/context/ShopContext.jsx'; // Include this if needed
import ErrorBoundary from './components/ErrorBoundary.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>

    <BrowserRouter>
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
    </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
