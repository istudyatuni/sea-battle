import React from 'react';

import CellRow from './CellRow'
import './Battlefield.css'

type BattlefieldProps = {
  isClear: boolean,
  gameMode: number,
  field: number[][]
}

const Battlefield: React.FC<BattlefieldProps> = ({ isClear, gameMode, field }) => {
  // 0 - empty, 1 - miss, 2 - hit (in j)
  // gameMode: 0 - placing ships, 1 -battle

  function renderRows(): object[] {
    let rows = []
    for(let ind=0; ind<10; ind++) {
      rows.push(<CellRow
        i={ind}
        isClear={isClear}
        gameMode={gameMode}
        row={field[ind]}
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
