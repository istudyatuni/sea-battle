import React from 'react';
import Cell from './Cell'

type CellRowProps = {
  i: number,
  j: number[]
}

const CellRow: React.FC<CellRowProps> = ({ i, j }) => {
  return (
    <>
      <tr className="CellRow">
        <Cell state={j[0]}/>
        <Cell state={j[1]}/>
        <Cell state={j[2]}/>
        <Cell state={j[3]}/>
        <Cell state={j[4]}/>
        <Cell state={j[5]}/>
        <Cell state={j[6]}/>
        <Cell state={j[7]}/>
        <Cell state={j[8]}/>
        <Cell state={j[9]}/>
      </tr>
    </>
  );
};

export default React.memo(CellRow);
