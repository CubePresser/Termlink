import React, { useState, useEffect, useContext, useRef } from 'react';
import { InputDeviceContext } from '../state/InputDeviceProvider';

type TerminalInputProps = {
  onInput: (value: string) => void;
  history: string[];
  active: boolean;
  value?: string;
};

export const TerminalInput: React.FC<TerminalInputProps> = ({ onInput, active, value, history }) => {
  const [ input, setInput ] = useState<string>("");
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const { isMouse } = useContext(InputDeviceContext);

  const abortInterval = () => {
    if (intervalId.current !== null) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }

  // Value changes when the cursor is used to select from the datastream
  useEffect(() => {
    if (value !== null && value !== undefined) {
      let count = 1;
      const interval = setInterval(() => {
        setInput(value.slice(0, count));
        if (count >= value.length) {
          abortInterval();
        }

        count++;
      }, 50);
      intervalId.current = interval;

      return () => {
        abortInterval();
      }
    } else {
      setInput("");
      intervalId.current = null;
    }
  }, [value]);

  useEffect(() => {
    // When the history updates, a submission has been made. If there is a typing anim in progress, cancel and clear input field.
    if (intervalId.current) {
      abortInterval();
      setInput("");
    }
  }, [history]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (intervalId.current) {
      abortInterval();
    }

    setInput(event.target.value.toUpperCase());
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    let submit = input;

    if (intervalId.current) {
      abortInterval();
      submit = value ?? "";
      setInput(submit);
    }

    switch (event.key) {
      case "Enter":
        onInput(submit);
        setInput("");
        break;
      case "ArrowLeft":
      case "ArrowRight":
        event.preventDefault();
        break;
      default:
        break;
    }
  }

  // Mouse/Keyboard - always keep the input in focus so users can type whenever they'd please
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

    if (intervalId.current) {
      abortInterval();
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
