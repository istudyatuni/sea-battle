import React, { useState } from 'react';
import Cell from './Cell'

type CellRowProps = {
  i: number,
  j: number[],
  gameMode: number,
  ship: boolean[]
}

const CellRow: React.FC<CellRowProps> = ({ i, j, gameMode, ship }) => {
  let tmpShip = useState(ship)
  ship = tmpShip[0]

  function setShip(ind: number) {
    ship[ind] = true
  }

  function renderCells(): object[] {
    let cells = []
    for(let ind=0; ind<10; ind++) {
      cells.push(<Cell
        i={ind}
        state={j[ind]}
        gameMode={gameMode}
        isShip={ship[ind]}
        setShip={setShip}
      />)
    }
    return cells
  }

  let cells = renderCells()
  return (
    <>
      <div className="CellRow">
        {cells}
      </div>
    </>
  );
};

export default React.memo(CellRow);
