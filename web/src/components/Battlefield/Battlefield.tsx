import React from 'react';
import CellRow from './CellRow'
import './Battlefield.css'

type BattlefieldProps = {
  stateGame: number,
  ships: boolean[][]
}

const Battlefield: React.FC<BattlefieldProps> = ({ stateGame, ships }) => {
  // 0 - empty, 1 - miss, 2 - hit (in j)
  // stateGame: 0 - placing ships

  function renderRows(): any {
    let rows = []
    for(let ind=0; ind<10; ind++) {
      rows.push(<CellRow
        i={ind}
        j={[0,0,0,0,0,0,0,0,0,0]}
        stateGame={stateGame}
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
