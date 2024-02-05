import React, { useState } from 'react';

type TerminalInputProps = {
  // Accepts user input value and optionally returns list of messages to be added to history
  onInput: (value: string) => string[];
  active: boolean;
};

const TerminalInput: React.FC<TerminalInputProps> = ({ onInput, active }) => {
  const [ history, setHistory ] = useState<string[]>([]);
  const [ input, setInput ] = useState<string>("");

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setInput(event.target.value.toUpperCase());
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") {
      const messages = onInput(input);

      setHistory([...history, input, ...messages]);
      setInput("");
    }
  }

  // Always keep this input in focus (Is there a better way to do this?)
  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    event.target.focus();
  }

  return (
    <div className="TerminalInput">
      <span>
        &nbsp;{">"}
        <input
          autoFocus
          maxLength={15}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          value={input}
          disabled={!active}
        />
      </span>
      {
        history.map((line, idx) => (
          <span key={idx}>&nbsp;{">"}{line}</span>
        )).reverse()
      }
    </div>
  );
};

export default TerminalInput;