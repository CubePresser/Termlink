import React, { useState, useEffect, useContext } from 'react';
import { InputDeviceContext } from '../Hooks/InputDevice';

type TerminalInputProps = {
  onInput: (value: string) => void;
  history: string[];
  active: boolean;
  value?: string;
};

const TerminalInput: React.FC<TerminalInputProps> = ({ onInput, active, value, history }) => {
  const [ input, setInput ] = useState<string>("");
  const [ intervalId, setIntervalId ] = useState<NodeJS.Timeout | null>(null);

  const { isMouse } = useContext(InputDeviceContext);

  // Value changes when the cursor is used to select from the datastream
  useEffect(() => {
    if (value !== null && value !== undefined) {
      let count = 1;
      // Using a var so I can cancel the interval from within itself feels so wrong but so right??
      var interval = setInterval(() => {
        setInput(value.slice(0, count));
        if (count >= value.length) {
          clearInterval(interval);
        }

        count++;
      }, 50);
      setIntervalId(interval);

      return () => {
        clearInterval(interval);
        setIntervalId(null);
      }
    } else {
      setInput("");
      setIntervalId(null);
    }
  }, [value]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    setInput(event.target.value.toUpperCase());
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    let submit = input;

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      submit = value ?? "";
      setInput(submit);
    }

    if (event.key === "Enter") {
      onInput(submit);
      setInput("");
    }
  }

  // Always keep this input in focus (Is there a better way to do this?)
  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    if (isMouse) {
      event.target.focus();
    }
  }

  const handleEnterSubmit = () => {
    if (!active) {
      return;
    }

    let submit = input;

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      submit = value ?? "";
    }

    onInput(submit);
    setInput("");
  };

  return (
    <div className="TerminalInput">
      {
        !isMouse
          ? <button id='enter' onClick={handleEnterSubmit}>{'[ ENTER ]'}</button>
          : null
      }
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