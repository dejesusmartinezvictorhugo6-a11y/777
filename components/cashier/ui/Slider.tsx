import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Slider: React.FC<SliderProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-cyan-400 mb-2 uppercase tracking-wider">
        {label}
      </label>
      <input
        id={id}
        type="range"
        min="0"
        max="1"
        step="0.01"
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
        {...props}
      />
    </div>
  );
};

export default Slider;
