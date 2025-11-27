import React, { useState } from 'react';

type CharProps = {
  onHover: (data: string) => void;
  onLeave: () => void;
  onClick: () => void;
  value: string;
  index?: number;
};

export const Char: React.FC<CharProps> = ({
  onHover,
  value,
  onLeave,
  onClick,
  index
}) => {
  const [pressed, setPressed] = useState<boolean>(false);

  const handleHover = () => {
    onHover(value);
  };

  const handlePointerDown: React.PointerEventHandler<HTMLSpanElement> = () => {
    setPressed(true);
  };

  const handlePointerCancel: React.PointerEventHandler<
    HTMLSpanElement
  > = () => {
    if (pressed) {
      setPressed(false);
    }
  };

  const handlePointerLeave: React.PointerEventHandler<HTMLSpanElement> = () => {
    if (pressed) {
      setPressed(false);
    }
  };

  const handlePointerUp: React.PointerEventHandler<HTMLSpanElement> = (
    event,
  ) => {
    if (pressed) {
      if (event.pointerType !== 'mouse') {
        onHover(value);
      } else {
        onClick();
      }
      setPressed(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLSpanElement> = (event) => {
    if (event.key === 'Enter') {
      onClick();
    }
  }

  return (
    <span
      {...(index !== undefined ? { tabIndex: index } : {})}
      onMouseOver={handleHover}
      onMouseLeave={onLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerCancel}
      onBlur={onLeave}
      onFocus={handleHover}
      onKeyDown={handleKeyDown}
    >
      {value}
    </span>
  );
};
