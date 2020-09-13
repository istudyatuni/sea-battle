import React from 'react';
import CellRow from './CellRow'
import './Battlefield.css'

type BattlefieldProps = {
  gameMode: number,
  ships: boolean[][]
}

const Battlefield: React.FC<BattlefieldProps> = ({ gameMode, ships }) => {
  // 0 - empty, 1 - miss, 2 - hit (in j)
  // gameMode: 0 - placing ships, 1 -battle

  function renderRows(): object[] {
    let rows = []
    for(let ind=0; ind<10; ind++) {
      rows.push(<CellRow
        i={ind}
        j={[0,0,0,0,0,0,0,0,0,0]}
        gameMode={gameMode}
        ship={ships[ind]}
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
