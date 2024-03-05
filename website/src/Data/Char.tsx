import React from 'react';

type CharProps = {
  disabled?: boolean;
  onHover: (data: string) => void;
  value: string;
}

const Char: React.FC<CharProps> = ({
  disabled,
  onHover,
  value,
}) => {
  const handleHover = () => {
    if (disabled) {
      return;
    }

    onHover(value);
  }

  return (
    <span className="Char" onMouseOver={handleHover}>{value}</span>
  );
};

export default Char;