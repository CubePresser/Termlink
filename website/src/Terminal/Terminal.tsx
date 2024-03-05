import React, { useState, useEffect, useMemo } from 'react';
import TermlinkHeader from './TermlinkHeader';
import DataStream from './DataStream';
import TerminalInput from './TerminalInput';
import { getWords, generateDataStream, findBrackets } from './terminal-helpers';
import TerminalLocked from './TerminalLocked';

const LengthRange = [
  {
    low: 4,
    high: 5
  },
  {
    low: 6,
    high: 8
  },
  {
    low: 9,
    high: 10
  },
  {
    low: 11,
    high: 12
  },
  {
    low: 13,
    high: 15
  }
];

type TerminalProps = {
  onSuccess: () => void;
  difficulty: number,
}

const Terminal: React.FC<TerminalProps> = ({ onSuccess, difficulty }) => {
  const [ key, setKey ] = useState<string>(String(Math.random()));
  const [ data, setData ] = useState<string>("");
  const [ words, setWords ] = useState<string[]>([]);
  const [ attempts, setAttempts ] = useState<number>(4);
  const [ history, setHistory ] = useState<string[]>([]);
  const [ success, setSuccess ] = useState<boolean>(false);
  const [ usedBrackets, setUsedBrackets ] = useState<number[]>([]);
  const [ selection, setSelection ] = useState<string>('');

  useEffect(() => {
    const range = LengthRange[difficulty];
    const length = Math.floor(Math.random() * (range.high - range.low)) + range.low;

    const genWords = getWords(length, 7);
    const genData = generateDataStream(genWords);

    setWords(genWords);
    setData(genData);
  }, [key, difficulty]);

  useEffect(() => {

    let shouldProceed = true;
    if (success) {
      setTimeout(() => {
        if (shouldProceed) {
          onSuccess();
        }
      }, 3000)
    }

    return () => { shouldProceed = false }
  }, [success, onSuccess]);

  const brackets: Map<number, string> = useMemo(() => {
    if (data !== "") {
      return findBrackets(data);
    }

    return new Map();
  }, [data]);

  const password = useMemo<string>(() => {
    if (words.length === 0) {
      return "";
    }

    return words[Math.floor(Math.random() * (words.length - 1))];
  }, [words]);

  const addToHistory = (messages: string[], value: string): void => {
    const newHistory = [...history, value, ...messages];
    // There is only enough room for 15 lines of history, lose the rest.
    const trimmedHistory = newHistory.length > 15 ? newHistory.slice(-15) : newHistory;

    setHistory(trimmedHistory);
  };

  const handleTerminalInput = (value: string): void => {
    const messages: string[] = [];

    if (value === "$SUDO SETADMIN1") {
      setSuccess(true);
      return;
    }

    // Starts with '{' | '[' | '(' | '<'
    if (/^[{([<]/.test(value)) {
      for (let [key, val] of brackets.entries()) {
        if (value === val) {
          if (!usedBrackets.includes(key)) {
            setUsedBrackets([...usedBrackets, key]);
            const rand = Math.floor(Math.random() * 100);
            if (rand < 80) {
              // 80% chance to remove a dud
              const duds = words.filter((word) => word !== password && data.includes(word));

              // No more duds to remove
              if (duds.length === 0) {
                messages.push('Entry denied');
              } else {
                setData(data.replace(duds[Math.floor(Math.random() * (duds.length - 1))], '...............'.slice(0, duds[0].length)));
                messages.push('Dud removed.');
              }
            } else {
              // 20% chance to reset attempts
              setAttempts(4);
              messages.push('Allowance');
              messages.push('replenished.');
            }
          }
          
          return addToHistory(messages, value);
        }
      }
    }

    if (value.length !== password.length) {
      messages.push('Entry denied');
      setAttempts(attempts - 1);
    } else {
      let matches = 0;
      for (let i = 0; i < password.length; i++) {
        if (value[i] === password[i]) {
          matches++;
        }
      }

      if (matches === password.length) {
        messages.push('Exact match!');
        messages.push('Please wait');
        messages.push('while system');
        messages.push('is accessed.');
        setSuccess(true);
      } else {
        messages.push('Entry denied');
        messages.push(`${matches}/${password.length} correct.`);
        setAttempts(attempts - 1);
      }
    }

    return addToHistory(messages, value);
  };

  const handleReset = () => {
    setAttempts(4);
    setWords([]);
    setData("");
    setKey(String(Math.random()));
    setSuccess(false);
    setHistory([]);
  };

  const handleDataSelect = (value: string) => {
    setSelection(value);
  }

  return (
    <div className="Terminal">
      {
        attempts > 0 ?
          <>
            <TermlinkHeader attempts={attempts} />
            <br/>
            <div className="data--container">
              <DataStream
                data={data}
                brackets={brackets}
                usedBrackets={usedBrackets}
                wordLength={password.length}
                onSelect={handleDataSelect}
                onClick={() => handleTerminalInput(selection)}
              />
              <TerminalInput active={!success} onInput={handleTerminalInput} value={selection} history={history}/>
            </div>
          </>
          : <TerminalLocked onReset={handleReset}/>
      }
    </div>
  )
};

export default Terminal;