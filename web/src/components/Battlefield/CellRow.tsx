import React, { useState } from 'react';
import Cell from './Cell'

type CellRowProps = {
  i: number,
  isClear: boolean,
  gameMode: number,
  row: number[],
  shot: (arg0: number, arg1: number)=>any
}

const CellRow: React.FC<CellRowProps> = ({ i, isClear, gameMode, row, shot }) => {
  let tmpShip = useState(row)
  row = tmpShip[0]

  function shotCell(j: number) {
    (async ()=>{
      await shot(i, j)
    })()
  }

  function setCell(ind: number) {
    if(isClear===false)
      row[ind] = 1
    else
      row[ind] = 0
  }

  function renderCells(): object[] {
    let cells = []
    for(let ind=0; ind<10; ind++) {
      cells.push(<Cell
        i={ind}
        isClear={isClear}
        gameMode={gameMode}
        setCell={setCell}
        shot={shotCell}
        element={row[ind]}
      />)
    }
    return cells
  }

  let cells = renderCells()
  return (
    <>
      <div className="CellRow">
        {/*<button onClick={()=>{console.log(row)}}>check</button>*/}
        {cells}
      </div>
    </>
  );
};

export default React.memo(CellRow);
