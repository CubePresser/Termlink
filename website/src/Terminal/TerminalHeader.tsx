import React, { useMemo } from 'react';

type TerminalHeaderProps = {
  attempts: number;
};

const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  attempts,
}) => {
  const attemptsSymbols = useMemo<string>(() => {
    let symbols = "";
    for (let i = 0; i < attempts; i++) {
      symbols += '■ ';
    }

    return symbols;
  }, [attempts]);

  return (
    <div className="TerminalHeader">
      <div>{'ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL'}</div>
      {attempts === 1
        ? <div>{'!!! WARNING: LOCKOUT IMMINENT !!!'}</div>
        : <br/>}
      <br/>
      <div>{`${attempts} ATTEMPT(S) LEFT: ${attemptsSymbols}`}</div>
    </div>
  )
}

export default TerminalHeader;