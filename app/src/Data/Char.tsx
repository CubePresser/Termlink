import React, { useState } from 'react';

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
  const [pressed, setPressed] = useState<boolean>(false);

  const handleHover = () => {
    onHover(value);
  }

  const handlePointerDown: React.PointerEventHandler<HTMLSpanElement> = (event) => {
    setPressed(true);
  };

  const handlePointerCancel: React.PointerEventHandler<HTMLSpanElement> = (event) => {
    if (pressed) {
      setPressed(false);
    }
  }

  const handlePointerLeave: React.PointerEventHandler<HTMLSpanElement> = (event) => {
    if (pressed) {
      setPressed(false);
    }
  }

  const handlePointerUp: React.PointerEventHandler<HTMLSpanElement> = (event) => {
    if (pressed) {
      if (event.pointerType !== 'mouse') {
        onHover(value);
      } else {
        onClick();
      }
      setPressed(false);
    }
  }

  return (
    <span
      className="Char"
      onMouseOver={handleHover}
      onMouseLeave={onLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerCancel}
    >
      {value}
    </span>
  );
};

export default Char;