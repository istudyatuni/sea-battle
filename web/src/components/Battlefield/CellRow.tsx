import React, { useState } from 'react';
import Cell from './Cell'

type CellRowProps = {
  i: number,
  j: number[],
  stateGame: number,
  ship: boolean[]
}

const CellRow: React.FC<CellRowProps> = ({ i, j, stateGame, ship }) => {
  let tmpShip = useState(ship)
  ship = tmpShip[0]
  return (
    <>
      <div className="CellRow">
        <Cell state={j[0]} stateGame={stateGame} isShip={ship[0]} />
        <Cell state={j[1]} stateGame={stateGame} isShip={ship[1]} />
        <Cell state={j[2]} stateGame={stateGame} isShip={ship[2]} />
        <Cell state={j[3]} stateGame={stateGame} isShip={ship[3]} />
        <Cell state={j[4]} stateGame={stateGame} isShip={ship[4]} />
        <Cell state={j[5]} stateGame={stateGame} isShip={ship[5]} />
        <Cell state={j[6]} stateGame={stateGame} isShip={ship[6]} />
        <Cell state={j[7]} stateGame={stateGame} isShip={ship[7]} />
        <Cell state={j[8]} stateGame={stateGame} isShip={ship[8]} />
        <Cell state={j[9]} stateGame={stateGame} isShip={ship[9]} />
      </div>
    </>
  );
};

export default React.memo(CellRow);
