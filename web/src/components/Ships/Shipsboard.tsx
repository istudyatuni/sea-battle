import React, { useEffect, useState } from 'react';

import './Shipboard.css'
import Ship from './Ship'

let shipName = ["Aircraft", "Battleship",
"Cruiser", "Submarine", "Carrier"]

type ShipsboardProps = {
  kills: number[]
}

const Shipsboard: React.FC<ShipsboardProps> = ({ kills }) => {

  useEffect(()=>{
    console.log('useEffect')
    setShips(renderShips())
  }, [kills]);

  function changeKill(i: number) {
    kills[i]++
    console.log('changeKill', kills)
  }

  function renderShips(): object[] {
    let ships = []
    console.log('rerender')
    for(let i=0; i<5; i++) {
      ships.push(<Ship
          key={[i, kills[i]].toString()}
          i={i}
          name={shipName[i]}
          count={i+1}
          kill={kills[i]}
          changeKill={changeKill}
        />)
      // console.log([i, kills[i]].toString())
    }
    return ships
  }

  const [ships, setShips] = useState(renderShips())

  return (
    <div className="Shipsboard">
      {renderShips()}
    </div>
  );
};

export default Shipsboard;
