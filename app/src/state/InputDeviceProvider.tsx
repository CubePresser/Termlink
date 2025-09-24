import React, { useState, useEffect } from 'react';

type InputDeviceState = {
  isMouse: boolean;
};

export const InputDeviceContext = React.createContext<InputDeviceState>({
  isMouse: true,
});

const InputDeviceProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [isMouse, setIsMouse] = useState<boolean>(true);

  useEffect(() => {
    // Detect touchscreen capability on mount -- assume touchscreen primary
    if (navigator.maxTouchPoints > 0) {
      setIsMouse(false);
    }

    const handlePointerOver = function (event: PointerEvent) {
      if (event.pointerType === 'mouse') {
        setIsMouse(true);
      } else {
        setIsMouse(false);
      }
    };
    document.addEventListener('pointerover', handlePointerOver);

    return () => {
      document.removeEventListener('pointerover', handlePointerOver);
    };
  }, []);

  return (
    <InputDeviceContext.Provider value={{ isMouse }}>
      {children}
    </InputDeviceContext.Provider>
  );
};

export default InputDeviceProvider;
