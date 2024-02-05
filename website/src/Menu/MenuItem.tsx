import React from 'react';

export type MenuItemProps = {
  innerRef?: React.Ref<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const MenuItem: React.FC<MenuItemProps> = ({
  innerRef,
  onMouseMove,
  onMouseLeave,
  children,
  ...buttonProps
}) => {
  const handleMouseMove: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.currentTarget.focus();

    if (onMouseMove) {
      onMouseMove(event);
    }
  };

  const handleMouseLeave: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.currentTarget.blur();

    if (onMouseLeave) {
      onMouseLeave(event);
    }
  }

  return (
    <button
      ref={innerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...buttonProps}
    >
      {children}
    </button>
  );
};

export default MenuItem;