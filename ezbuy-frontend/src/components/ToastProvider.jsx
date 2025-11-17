// src/components/ToastProvider.jsx
import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 2000,
        style: {
          background: '#1e293b',
          color: '#fff',
          padding: '16px',
          borderRadius: '12px',
          fontWeight: '600',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}