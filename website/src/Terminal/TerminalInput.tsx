import React, { useState, useEffect } from 'react';

type TerminalInputProps = {
  // Accepts user input value and optionally returns list of messages to be added to history
  onInput: (value: string) => string[];
  active: boolean;
  value?: string;
};

const TerminalInput: React.FC<TerminalInputProps> = ({ onInput, active, value }) => {
  const [ history, setHistory ] = useState<string[]>([]);
  const [ input, setInput ] = useState<string>("");

  useEffect(() => {
    setInput(value ?? "");
  }, [value])

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setInput(event.target.value.toUpperCase());
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") {
      const messages = onInput(input);

      const newHistory = [...history, input, ...messages];
      // There is only enough room for 15 lines of history, lose the rest.
      const trimmedHistory = newHistory.length > 15 ? newHistory.slice(-15) : newHistory;

      setHistory(trimmedHistory);
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
      </span><br/>
      {
        history.map((line, idx) => (
          <span key={idx}>&nbsp;{">"}{line}</span>
        )).reverse()
      }
    </div>
  );
};

export default TerminalInput;