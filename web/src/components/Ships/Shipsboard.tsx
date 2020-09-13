import React, { useEffect, useState } from 'react';
import Ship from './Ship'
import './Shipboard.css'

let shipName = ["Aircraft", "Battleship",
"Cruiser", "Submarine", "Carrier"]

const Shipsboard: React.FC = () => {

  const [kills, setKills] = useState([0,0,0,0,0])

  function changeKill(i: number, updown: number) {
    let kill = kills
    /*if(updown < 0) {
      kill[i]--
    } else if(updown > 0) {
      kill[i]++
    }*/
    kill[i]=(kill[i]+1)%(i+2)
    setKills(kill)
    // console.log(kills)
  }

  function renderShips(): object[] {
    let ships = []
    for(let i=0; i<5; i++) {
      ships.push(<Ship
          key={[i, kills[i]].toString()}
          i={i}
          name={shipName[i]}
          count={i+1}
          kill={kills[i]}
          changeKill={changeKill}
        />)
      console.log([i, kills[i]].toString())
    }
    return ships
  }

  useEffect(()=>{
    console.log("useEffect Shipsboard")
    renderShips()
  }, [kills]);

  return (
    <div className="Shipsboard">
      {renderShips()}
    </div>
  );
};

export default Shipsboard;
