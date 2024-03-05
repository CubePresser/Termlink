import React from 'react';

type CharProps = {
  disabled?: boolean;
  onHover: (data: string) => void;
  onLeave: () => void;
  onClick: () => void;
  value: string;
}

const Char: React.FC<CharProps> = ({
  disabled,
  onHover,
  value,
  onLeave,
  onClick
}) => {
  const handleHover = () => {
    if (disabled) {
      return;
    }

    onHover(value);
  }

  return (
    <span className="Char" onMouseOver={handleHover} onMouseLeave={onLeave} onClick={onClick}>{value}</span>
  );
};

export default Char;