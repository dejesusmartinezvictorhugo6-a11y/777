
import React, { useState, useEffect } from 'react';

const DevilIcon: React.FC = () => (
  <svg 
    className="w-48 h-48 text-red-600 animate-devil-glow" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5"
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10C22 6.477 17.523 2 12 2z" stroke="none" fill="rgba(220, 38, 38, 0.1)" />
    <path 
      d="M17.5 7.5c.966-.966 1.5-2.288 1.5-3.5 0-1.212-.534-2.534-1.5-3.5M6.5 7.5C5.534 6.534 5 5.212 5 4c0-1.212.534-2.534 1.5-3.5" 
      transform="translate(0, 1)"
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M9 13c.5-1 1.5-1.5 3-1.5s2.5.5 3 1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <circle cx="9" cy="10" r=".5" fill="currentColor" />
    <circle cx="15" cy="10" r=".5" fill="currentColor" />
    <path
      className="animate-wag-tail"
      d="M12 16c-2 0-4 1-4 3s2 3 4 3c2.5 0 4-1.5 4-3.5S13 14 12 16z"
      strokeLinecap="round"
    />
  </svg>
);

const SplashScreen: React.FC = () => {
  const [countdown, setCountdown] = useState(10);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    const fadeOutTimer = setTimeout(() => {
        setShow(false);
    }, 9500); // Start fade out 0.5s before end

    return () => {
        clearInterval(timer);
        clearTimeout(fadeOutTimer);
    };
  }, []);

  return (
    <div 
      className={`fixed inset-0 bg-black flex flex-col justify-center items-center z-50 transition-opacity duration-500 ${show ? 'opacity-100 animate-fade-in' : 'opacity-0 animate-fade-out'}`}
    >
      <div className="mb-8">
        <DevilIcon />
      </div>
      <h1 className="text-4xl font-black text-red-500 uppercase tracking-widest mb-4">
        Pacto de Sangre Iniciado...
      </h1>
      <p className="text-2xl text-white font-bold">
        {countdown}
      </p>
    </div>
  );
};

export default SplashScreen;
