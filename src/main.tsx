
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { WishlistProvider } from './contexts/WishlistContext.tsx';
import { CartProvider } from './contexts/CartProvider.tsx';

// Determine which app to load based on environment variable
const appType = import.meta.env.VITE_APP_TYPE || 'customer';

const loadApp = async () => {
  if (appType === 'driver') {
    // Load driver portal app
    const { default: DriverApp } = await import('./DriverApp.tsx');
    return DriverApp;
  } else {
    // Load main e-commerce app
    const { default: App } = await import('./App.tsx');
    return App;
  }
};

loadApp().then((AppComponent) => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <BrowserRouter>
              <AppComponent />
            </BrowserRouter>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </React.StrictMode>,
  );
});
