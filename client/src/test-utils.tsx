import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SolicitationProvider } from './context/SolicitationContext';
import { TechnicianProvider } from './context/TechnicianContext';
import { CommentProvider } from './context/CommentContext';
import { AttachmentProvider } from './context/AttachmentContext';

function render(ui: React.ReactElement, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);
  return rtlRender(
    <BrowserRouter>
      <AuthProvider>
        <SolicitationProvider>
          <TechnicianProvider>
            <CommentProvider>
              <AttachmentProvider>{ui}</AttachmentProvider>
            </CommentProvider>
          </TechnicianProvider>
        </SolicitationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { render }; 