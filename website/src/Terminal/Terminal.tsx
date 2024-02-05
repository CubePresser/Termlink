import React, { useState, useEffect, useMemo } from 'react';
import TermlinkHeader from './TermlinkHeader';
import DataStream from './DataStream';
import TerminalInput from './TerminalInput';
import { getWords, generateDataStream } from './terminal-helpers';
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
  const [ success, setSuccess ] = useState<boolean>(false);

  useEffect(() => {
    const range = LengthRange[difficulty];
    const length = Math.floor(Math.random() * (range.high - range.low)) + range.low;

    const genWords = getWords(length, 7);
    const genData = generateDataStream(genWords);

    setWords(genWords);
    setData(genData);
  }, [key]);

  const password = useMemo<string>(() => {
    if (words.length === 0) {
      return "";
    }

    return words[Math.floor(Math.random() * (words.length - 1))];
  }, [words]);

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
  }, [success, onSuccess])

  const handleTerminalInput = (value: string): string[] => {
    const messages: string[] = [];

    if (value === "$SUDO SETADMIN1") {
      setSuccess(true);
      return [];
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

    return messages;
  };

  const handleReset = () => {
    setAttempts(4);
    setWords([]);
    setData("");
    setKey(String(Math.random()));
    setSuccess(false);
  };

  return (
    <div className="Terminal">
      {
        attempts > 0 ?
          <>
            <TermlinkHeader attempts={attempts} />
            <br/>
            <div className="data--container">
              <DataStream data={data} />
              <TerminalInput active={!success} onInput={handleTerminalInput}/>
            </div>
          </>
          : <TerminalLocked onReset={handleReset}/>
      }
    </div>
  )
};

export default Terminal;