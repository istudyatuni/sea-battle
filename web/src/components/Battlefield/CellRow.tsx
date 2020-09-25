import React, { useState } from 'react';
import Cell from './Cell'

type CellRowProps = {
  i: number,
  isClear: boolean,
  gameMode: number,
  ship: boolean[]
}

const CellRow: React.FC<CellRowProps> = ({ i, isClear, gameMode, ship }) => {
  let tmpShip = useState(ship)
  ship = tmpShip[0]

  function setShip(ind: number) {
    if(isClear===false)
      ship[ind] = true
    else
      ship[ind] = false
  }

  function renderCells(): object[] {
    let cells = []
    for(let ind=0; ind<10; ind++) {
      cells.push(<Cell
        i={ind}
        isClear={isClear}
        gameMode={gameMode}
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
