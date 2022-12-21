import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './AppRouter';
import { SnackbarProvider } from 'notistack';
import { ContextProvider } from './services/context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <ContextProvider>
    <SnackbarProvider maxSnack={3}>
      <AppRouter />
    </SnackbarProvider>
  </ContextProvider>
  // </React.StrictMode>
);
