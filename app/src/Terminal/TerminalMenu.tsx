import React from 'react';
import { TerminalHeader } from './';
import { Menu, MenuItem } from '../Menu';
import { Difficulty } from "./constants";

type TerminalMenuProps = {
  onLogout: () => void;
  onPwdReset: (n: number) => void;
  onUpdateCount: (n: number) => void;
  difficulty: Difficulty;
  wordcount: number;
};

export const TerminalMenu: React.FC<TerminalMenuProps> = ({ onLogout, onPwdReset, onUpdateCount, difficulty, wordcount }) => {
  const handleLogout = () => {
    onLogout();
  };

  const handlePasswordReset = () => {
    onPwdReset((difficulty + 1) % 5);
  }

  const handleIncrementCount = () => {
    onUpdateCount((wordcount % 50) + 1);
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
        <MenuItem onClick={handleIncrementCount}>{`> MEMORY SLOTS [${wordcount}]`}</MenuItem>
      </Menu>
      <br/>
    </div>
  )
};
