import React, { useState, useEffect } from 'react';

type TerminalInputProps = {
  onInput: (value: string) => void;
  history: string[];
  active: boolean;
  value?: string;
};

const TerminalInput: React.FC<TerminalInputProps> = ({ onInput, active, value, history }) => {
  const [ input, setInput ] = useState<string>("");

  useEffect(() => {
    setInput(value ?? "");
  }, [value])

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setInput(event.target.value.toUpperCase());
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") {
      onInput(input);
      setInput("");
    }
  }

  // Always keep this input in focus (Is there a better way to do this?)
  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    event.target.focus();
  }

  return (
    <div className="TerminalInput">
      <span className="input--line">
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
        <span
          className="input--caret"
          style={{
            left: `${1 + (0.5 * input.length)}em`
          }}>
            ■
        </span>
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