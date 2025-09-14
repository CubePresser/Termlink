import React, { useState, useRef, useEffect } from 'react';
import { MenuItemProps } from './MenuItem';

type MenuProps = {
  className?: string;
} & React.PropsWithChildren;

export const Menu: React.FC<MenuProps> = ({
  className,
  children
}) => {
  const [index, setIndex] = useState(0);
  const childRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  const handleKeyDown: React.KeyboardEventHandler = (event) => {
    const itemCount = React.Children.count(children);
    if (event.key === "ArrowDown") {
      setIndex(Math.min(Math.max((index + 1), 0), itemCount - 1));
    } else if (event.key === "ArrowUp") {
      setIndex(Math.min(Math.max((index - 1), 0), itemCount - 1));
    }
  }

  const handleFocus = (_event: React.FocusEvent<HTMLButtonElement>, idx: number) => {
    setIndex(idx);
  }

  useEffect(() => {
    const ref = (childRefs.current ?? [])[index];
    if (ref) {
      ref.focus();
    }
  }, [index])

  return (
    <div className={className}>
      {
        React.Children.map(children, (child, idx) => (
          React.cloneElement(child as React.ReactElement, {
            innerRef: (ref) => childRefs.current.push(ref),
            onKeyDown: handleKeyDown,
            onFocus: (evt) => handleFocus(evt, idx),
          } as MenuItemProps)
        ))
      }
    </div>
  );
}