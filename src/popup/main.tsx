import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../globals.css';
import Popup from './Popup.tsx';
import React from 'react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Popup />
  </StrictMode>,
);
