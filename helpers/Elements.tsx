import React from 'react'
import { InputProps } from './props';

export const Input: React.FC<InputProps> = ({ name, label, type, placeholder, id, error, autofocus = false, required = false }) => {
  return (
    <div className='max-w-sm mx-auto mb-4'>
      <label htmlFor={id} className='input input-bordered flex items-center gap-2'>
        {label}
        <input id={id} name={name} required={required} autoFocus={autofocus} type={type} className='grow' placeholder={placeholder} />
      </label>
      {error && <p className='mt-2 text-sm text-red-600 dark:text-red-500 font-medium'>{error}</p>}
    </div>
  );
};
