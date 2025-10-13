import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserProvider } from './contexts/UserContext';
import { TutorialProvider } from './contexts/TutorialContext';
import { SoundProvider } from './contexts/SoundContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <TutorialProvider>
      <UserProvider>
        <SoundProvider>
          <App />
        </SoundProvider>
      </UserProvider>
    </TutorialProvider>
  </React.StrictMode>
);