import React, { useState, useEffect, useMemo } from 'react';
import TerminalHeader from './TerminalHeader';
import DataStream from './DataStream';
import TerminalInput from './TerminalInput';
import { getWords, generateDataStream } from './terminal-helpers';

// The basics :)

type TerminalProps = {
  length: number,
}

const Terminal: React.FC<TerminalProps> = () => {
  const [ data, setData ] = useState<string>("");
  const [ words, setWords ] = useState<string[]>([]);
  const [ attempts, setAttempts ] = useState<number>(4);

  useEffect(() => {
    const genWords = getWords(7, 7);
    const genData = generateDataStream(genWords);

    setWords(genWords);
    setData(genData);
  }, []);

  const password = useMemo<string>(() => {
    if (words.length === 0) {
      return "";
    }

    return words[Math.floor(Math.random() * (words.length - 1))];
  }, [words]);

  const handleTerminalInput = (value: string): string[] => {
    const messages: string[] = [];

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
      } else {
        messages.push('Entry denied');
        messages.push(`${matches}/${password.length} correct.`);
        setAttempts(attempts - 1);
      }
    }

    return messages;
  };

  return (
    <div className="Terminal">
      <TerminalHeader attempts={attempts} />
      <br/>
      <div className="data--container">
        <DataStream data={data} />
        <TerminalInput onInput={handleTerminalInput}/>
      </div>
    </div>
  )
};

export default Terminal;