import React, { useMemo } from 'react';

type DataStreamProps = {
  data: string;
};

const DataStream: React.FC<DataStreamProps> = ({data}) => {
  const lines: React.ReactNode[] = useMemo(() => {
    const fragments: React.ReactNode[] = [];

    // TODO: Randomize
    // Iterate addr by 12 for each line
    const addr = 0xF964;

    // Two columns to print, one row at a time means I need characters at: Col1 = n, Col2 = n + 204 where n iterates by 12
    for (let row = 0; row < 17; row++) {
      const start_c1 = row * 12;
      const start_c2 = start_c1 + 204;

      fragments.push(
        <>
          <span className="address">0x{(addr + start_c1).toString(16).toUpperCase()} </span>
          <span className="data">{data.slice(start_c1, start_c1 + 12)} </span>
          <span className="address">0x{(addr + start_c2).toString(16).toUpperCase()} </span>
          <span className="data">{data.slice(start_c2, start_c2 + 12)}</span>
          <br/>
        </>
      );
    }

    return fragments;
  }, [data]);

  return (
    <div className="DataStream">
      {lines}
    </div>
  );
}

export default DataStream;