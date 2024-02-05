import React, { useState } from 'react';
import TerminalHeader from './TerminalHeader';
import Menu from '../Menu/Menu';
import MenuItem from '../Menu/MenuItem';

enum Difficulty {
  'Very Easy',
  'Easy',
  'Average',
  'Hard',
  'Very Hard',
}

const TerminalMenu: React.FC = () => {
  const [ difficulty, setDifficulty ] = useState<Difficulty>(4)

  const handleLogout = () => {
    
  };

  const handlePasswordReset = () => {
    setDifficulty((difficulty + 1) % 5)
  }

  return (
    <div className="Terminal TerminalMenu">
      <TerminalHeader /><br/>
      <div className="TerminalMenu--title">
        <span>{"-ROBCO PASSWORD MANAGEMENT SYSTEM-"}</span>
        <hr/>
      </div>
      <Menu className="TerminalMenu--items">
        <MenuItem autoFocus onClick={handleLogout}>{"> LOG OUT"}</MenuItem>
        <MenuItem onClick={handlePasswordReset}>{`> RESET PASSWORD [Strength: ${Difficulty[difficulty]}]`}</MenuItem>
      </Menu>
      <br/>
    </div>
  )
};

export default TerminalMenu;