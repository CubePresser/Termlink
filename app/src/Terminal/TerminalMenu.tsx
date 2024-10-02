import React from 'react';
import TerminalHeader from './TerminalHeader';
import Menu from '../Menu/Menu';
import MenuItem from '../Menu/MenuItem';

export enum Difficulty {
  'Very Easy',
  'Easy',
  'Average',
  'Hard',
  'Very Hard',
}

type TerminalMenuProps = {
  onLogout: () => void;
  onPwdReset: (n: number) => void;
  difficulty: Difficulty;
};

const TerminalMenu: React.FC<TerminalMenuProps> = ({ onLogout, onPwdReset, difficulty }) => {
  const handleLogout = () => {
    onLogout();
  };

  const handlePasswordReset = () => {
    onPwdReset((difficulty + 1) % 5);
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