import React, { useState } from 'react';
import './App.css';
import Terminal from './Terminal/Terminal';
import TerminalMenu, { Difficulty } from './Terminal/TerminalMenu';
import InputDeviceProvider from './Hooks/InputDevice';

const App: React.FC = () => {
  // Could probably use react router for something like this buuuut.... NAAAAHHH
  const [ pageIdx, setPageIdx ] = useState(0);
  const [ difficulty, setDifficulty ] = useState<Difficulty>(2);
  const [ wordcount, setWordcount ] = useState<number>(10);
  const pages: React.ReactNode[] = [
    <Terminal onSuccess={() => setPageIdx(1)} difficulty={difficulty} wordcount={wordcount}/>,
    <TerminalMenu
      onLogout={() => setPageIdx(0)}
      difficulty={difficulty}
      wordcount={wordcount}
      onPwdReset={(n) => setDifficulty(n)}
      onUpdateCount={(n) => setWordcount(n)}
    />
  ]

  return (
    <div className="App">
      <InputDeviceProvider>
        {pages[pageIdx]}
      </InputDeviceProvider>
    </div>
  );
}

export default App;
