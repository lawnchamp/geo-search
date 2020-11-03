import React from 'react';

export default function Input({ id, value, onChange, label, className = '', ...rest }) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block mb-1 text-xs font-bold tracking-wide text-gray-600 uppercase"
      >
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          {...rest}
          id={id}
          value={value}
          onChange={onChange}
          className="block w-full pr-12 form-input pl-7 sm:text-sm sm:leading-5"
        />
      </div>
    </div>
  );
}
