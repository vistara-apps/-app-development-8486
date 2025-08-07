import React, { createContext, useContext } from 'react';
import Toast from './ui/Toast';
import { useToast } from '../hooks/useToast';

const ToastContext = createContext();

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

const ToastProvider = ({ children }) => {
  const toastMethods = useToast();

  return (
    <ToastContext.Provider value={toastMethods}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toastMethods.toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => toastMethods.removeToast(toast.id)}
            duration={toast.duration}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
