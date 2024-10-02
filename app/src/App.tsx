import React, { useState } from 'react';
import './App.css';
import Terminal from './Terminal/Terminal';
import TerminalMenu, { Difficulty } from './Terminal/TerminalMenu';

const App: React.FC = () => {
  // Could probably use react router for something like this buuuut.... NAAAAHHH
  const [ pageIdx, setPageIdx ] = useState(0);
  const [ difficulty, setDifficulty ] = useState<Difficulty>(2);
  const pages: React.ReactNode[] = [
    <Terminal onSuccess={() => setPageIdx(1)} difficulty={difficulty}/>,
    <TerminalMenu onLogout={() => setPageIdx(0)} difficulty={difficulty} onPwdReset={(n) => setDifficulty(n)}/>
  ]

  return (
    <div className="App">
      {pages[pageIdx]}
    </div>
  );
}

export default App;
