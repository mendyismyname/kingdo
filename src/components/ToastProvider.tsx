"use client";

import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider: React.FC = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: '',
        duration: 3000,
        style: {
          background: '#fff',
          color: 'var(--king-text)',
          border: '1px solid var(--king-primary)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: '12px',
          padding: '12px 16px',
          fontFamily: 'var(--font-sans)',
          fontSize: '14px',
          fontWeight: '500',
        },
        success: {
          iconTheme: {
            primary: 'var(--king-primary)',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444', // Red-500
            secondary: '#fff',
          },
        },
      }}
    />
  );
};

export default ToastProvider;