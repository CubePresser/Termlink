import React, { useMemo } from 'react';

type TermlinkHeaderProps = {
  attempts: number;
};

export const TermlinkHeader: React.FC<TermlinkHeaderProps> = ({
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
    <div className="TermlinkHeader">
      <div>{'ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL'}</div>
      {attempts === 1
        ? <div className="blink">{'!!! WARNING: LOCKOUT IMMINENT !!!'}</div>
        : <div>{'ENTER PASSWORD NOW'}</div>}
      <br/>
      <div>{`${attempts} ATTEMPT(S) LEFT: ${attemptsSymbols}`}</div>
    </div>
  )
}