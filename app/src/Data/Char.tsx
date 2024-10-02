import React from 'react';

type CharProps = {
  onHover: (data: string) => void;
  onLeave: () => void;
  onClick: () => void;
  value: string;
}

const Char: React.FC<CharProps> = ({
  onHover,
  value,
  onLeave,
  onClick
}) => {
  const handleHover = () => {
    onHover(value);
  }

  return (
    <span className="Char" onMouseOver={handleHover} onMouseLeave={onLeave} onClick={onClick}>{value}</span>
  );
};

export default Char;