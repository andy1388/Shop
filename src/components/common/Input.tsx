import React from 'react'

interface InputProps {
  type?: string
  name: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  error?: string | null
  onBlur?: () => void
}

const Input = ({ 
  type = 'text', 
  name, 
  placeholder, 
  value, 
  onChange, 
  className = '',
  error,
  onBlur
}: InputProps) => {
  return (
    <div className="w-full">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
          ${error 
            ? 'border-red-500 focus:ring-red-200' 
            : 'border-gray-300 focus:ring-blue-200'
          } 
          ${className}`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

export default Input 