
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({ label, id, containerClassName, ...props }) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && <label htmlFor={id} className="block text-sm font-bold text-cyan-400 mb-2 uppercase tracking-wider">
        {label}
      </label>}
      <input
        id={id}
        className="w-full bg-gray-800 border-2 border-gray-700 rounded-md py-2 px-3 text-white leading-tight focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-300"
        {...props}
      />
    </div>
  );
};

export default Input;
