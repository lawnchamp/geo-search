import React, { useState } from 'react';

export default function Button({ onClick, type, disabled, children, ...rest }) {
  const [disabledButtonClicked, setDisabledButtonClicked] = useState(false);
  const disabledStyle = disabled && disabledButtonClicked ? 'opacity-50 cursor-not-allowed' : '';

  function clickHandler() {
    if (disabled) {
      setDisabledButtonClicked(true);
    } else {
      onClick();
    }
  }

  return (
    <div>
      <button
        {...{ type, disabled, rest }}
        disabled={disabledStyle !== ''}
        className={`${disabledStyle} inline px-4 py-2 text-sm font-medium leading-5 text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500`}
        onClick={clickHandler}
      >
        {children}
      </button>
    </div>
  );
}
