import React, { useEffect, useState } from 'react';

type TerminalLockedProps = {
  onReset: () => void;
};

export const TerminalLocked: React.FC<TerminalLockedProps> = ({ onReset }) => {
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowReset(true), 500);
  }, [setShowReset]);

  const handleFormSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();
    onReset();
  };

  const handleBlur: React.FocusEventHandler<HTMLButtonElement> = (event) => {
    event.target.focus();
  };

  return (
    <form className="TerminalLocked" onSubmit={handleFormSubmit}>
      <span>TERMINAL LOCKED</span>
      <br />
      <span>PLEASE CONTACT AN ADMINISTRATOR</span>
      <br />
      {showReset ? (
        <button
          className="reset blink"
          type="submit"
          autoFocus
          onBlur={handleBlur}
        >
          {'[ RESET ]'}
        </button>
      ) : null}
    </form>
  );
};
