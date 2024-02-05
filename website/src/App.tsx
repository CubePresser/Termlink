import React from 'react';
import './App.css';
import Terminal from './Terminal/Terminal';
import TerminalMenu from './Terminal/TerminalMenu';

const App: React.FC = () => {
  return (
    <div className="App">
      {/* <TerminalMenu /> */}
      <Terminal length={7}/>
    </div>
  );
}

export default App;
