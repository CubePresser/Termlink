import React, { useMemo, useCallback, useContext } from 'react';
import { Char } from './';
import { InputDeviceContext } from '../../state/InputDeviceProvider';

type DataStreamProps = {
  data: string;
  brackets: Map<number, string>;
  usedBrackets: number[];
  wordLength: number;
  active: boolean;
  onSelect: (value: string) => void;
  onClick: (value: string) => void;
};

export const DataStream: React.FC<DataStreamProps> = ({
  data,
  brackets,
  usedBrackets,
  wordLength,
  active,
  onSelect,
  onClick
}) => {
  const { isMouse } = useContext(InputDeviceContext);

  const renderChar = useCallback((key: string, display: string, value?: string) => {
    const val = value ?? display;

    const handleHover = () => onSelect(val);
    
    const handleLeave = () => {
      if (isMouse) {
        onSelect('');
      }
    }

    const handleClick = () => {
      onClick(val);
    }

    const none = () => void(0);

    if (active) {
      return (
        <Char key={key} value={display} onHover={handleHover} onLeave={handleLeave} onClick={handleClick}/>
      )
    } else {
      return (
        <Char key={key} value={display} onHover={none} onLeave={none} onClick={none}/>
      );
    }
  }, [onSelect, onClick, active, isMouse])

  const chars: React.ReactNode[] = useMemo(() => {
    const fragments: React.ReactNode[] = [];

    const renderBrackets = (start: number, value: string): [React.ReactNode, number] => {
      const result: React.ReactNode[] = [];
      
      let finalIdx = (value.length - 1) + start;
      for (let i = start; i < value.length + start; i++) {
        if (i !== start && brackets.has(i) && !usedBrackets.includes(i)) {
          const [renderedBrackets, newIdx] = renderBrackets(i, brackets.get(i) ?? '');
          result.push(renderedBrackets);
          if (newIdx > finalIdx) {
            finalIdx = newIdx;
            break;
          } else {
            i = newIdx;
          }
        } else {
          const char = data[i];
          result.push(renderChar(`${char}-${i}`, char, i === start ? value : char));
        }
      }

      return [(
        <span className="bracket" key={`bracket-${start}`}>{result}</span>
      ), finalIdx];
    }

    for (let i = 0; i < data.length; i++) {
      // Found a word
      if (data[i].match(/[A-Za-z]/)) {
        const word = data.slice(i, i + wordLength);
        fragments.push(
          renderChar(word, word)
        );
        i += wordLength - 1;
      } else if (brackets.has(i) && !usedBrackets.includes(i)) {
        const bracket = brackets.get(i) ?? '';
        const [ renderedBrackets, newIdx ] = renderBrackets(i, bracket);
        fragments.push(renderedBrackets)
        i = newIdx;
      } else {
        const char = data[i];
        fragments.push(
          renderChar(`${char}-${i}`, char)
        );
      }
    }
    return fragments;
  }, [data, wordLength, brackets, usedBrackets, renderChar]);

  const addresses: string = useMemo(() => {
    let fragments: string = "";
    
    const addr = 0xF964;
    for (let row = 0; row < 34; row++) {
      fragments += `0x${(addr + (row * 12)).toString(16).toUpperCase()}`;
    }

    return fragments;
  }, []);

  return (
    <div className="DataStream">
      <div className="address-stream">{addresses}</div>
      <div className={`data-stream ${active ? '' : 'disabled'}`}>{chars}</div>
    </div>
  );
}