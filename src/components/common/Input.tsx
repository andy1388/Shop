import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  preventNegative?: boolean;
}

const Input: React.FC<InputProps> = ({ 
  error, 
  preventNegative,
  type,
  onKeyDown,
  onChange,
  ...props 
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (preventNegative && (e.key === '-' || e.key === 'e')) {
      e.preventDefault();
    }
    onKeyDown?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (preventNegative && type === 'number') {
      const value = Math.max(0, Number(e.target.value));
      e.target.value = value.toString();
    }
    onChange?.(e);
  };

  return (
    <div>
      <input
        type={type}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200
          ${error ? 'border-red-500' : 'border-gray-300'}`}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input; 