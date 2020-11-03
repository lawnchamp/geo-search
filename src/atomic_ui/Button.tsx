import React from 'react';

export default function Button({ onClick, type, disabled, children, ...rest }) {
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      {...{ onClick, type, disabled, rest }}
      className={`${disabledStyle} px-4 py-2 text-sm font-medium leading-5 text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500`}
    >
      {children}
    </button>
  );
}
