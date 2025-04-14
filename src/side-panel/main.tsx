import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../globals.css';
import Layout from './Layout.tsx';
import React from 'react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Layout />
  </StrictMode>,
);
