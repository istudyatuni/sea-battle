import React from 'react';

import CellRow from './CellRow'
import './Battlefield.css'

type BattlefieldProps = {
  isClear: boolean,
  gameMode: number,
  field: number[][],
  shot: (arg0: number, arg1: number)=>any
}

const Battlefield: React.FC<BattlefieldProps> = ({ isClear, gameMode, field, shot }) => {
  // 0 - empty, 1 - miss, 2 - hit (in j)
  // gameMode: 0 - placing ships, 1 -battle

  function renderRows(): object[] {
    let rows = []
    for(let ind = 0; ind < 10; ind++) {
      rows.push(<CellRow
        key={ind}
        i={ind}
        isClear={isClear}
        gameMode={gameMode}
        row={field[ind]}
        shot={shot}
      />)
    }
    return rows
  }

  let rows = renderRows()
  return (
    <div className="Battlefield">
      {rows}
    </div>
  );
};

export default Battlefield;
