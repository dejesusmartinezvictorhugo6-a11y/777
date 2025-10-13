
import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-7xl'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
      <div className={`bg-gray-900 border-2 border-red-500 rounded-lg shadow-[0_0_25px_rgba(239,68,68,0.6)] w-full ${sizeClasses[size]} animate-fade-in-up`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-2xl font-black text-red-500 uppercase tracking-widest">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;