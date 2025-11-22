import React from 'react';

const Input = ({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  className = '',
  label,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-github-text mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`github-input w-full ${error ? 'border-github-danger focus:ring-github-danger' : ''} ${disabled ? 'bg-github-input-disabled cursor-not-allowed' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-github-text-danger animate-slide-up">{error}</p>
      )}
    </div>
  );
};

export default Input;