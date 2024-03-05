import React, { useMemo } from 'react';
import Char from '../Data/Char';

type DataStreamProps = {
  data: string;
  brackets: Map<number, string>;
  usedBrackets: number[];
  wordLength: number;
  onSelect: (value: string) => void;
  onClick: () => void;
};

const DataStream: React.FC<DataStreamProps> = ({
  data,
  brackets,
  usedBrackets,
  wordLength,
  onSelect,
  onClick
}) => {
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
          result.push(<Char key={`${char}-${i}`} value={char} onHover={() => i === start ? onSelect(value) : onSelect(char)} onLeave={() => onSelect('')} onClick={onClick}/>)
        }
      }

      return [(
        <span className="Bracket" key={`bracket-${start}`}>{result}</span>
      ), finalIdx];
    }

    for (let i = 0; i < data.length; i++) {
      // Found a word
      if (data[i].match(/[A-Za-z]/)) {
        const word = data.slice(i, i + wordLength);
        fragments.push(
          <Char key={word} value={word} onHover={() => onSelect(word)} onLeave={() => onSelect('')} onClick={onClick}/>
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
          <Char key={`${char}-${i}`} value={char} onHover={() => onSelect(char)} onLeave={() => onSelect('')} onClick={onClick}/>
        );
      }
    }
    return fragments;
  }, [data, wordLength, brackets, usedBrackets, onSelect]);

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
      <div className="data-stream">{chars}</div>
    </div>
  );
}

export default DataStream;