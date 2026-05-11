import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProviders } from '@/app/providers';
import '@/app/styles/index.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <AppProviders />
  </React.StrictMode>,
);
