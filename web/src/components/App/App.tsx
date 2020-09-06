import React, { useState } from 'react';
import './App.css';
import Scoreboard from '../Counter/Scoreboard'
import Shipsboard from '../Ships/Shipsboard'
import Battlefield from '../Battlefield/Battlefield'

function ShipsInit(): boolean[][] {
  let ships = []
  for(let i=0; i<100; i++) {
    let ship = []
    for(let j=0; j<10; j++) {
      ship.push(false)
    }
    ships.push(ship)
  }
  return ships
}

const App: React.FC = () => {
  const [allShips, _] = useState<boolean[][]>(ShipsInit())
  const [gameMode, setMode] = useState(0)
  const [ships, setShips] = useState<boolean[][]>(getShips())

  function getShips(): boolean[][] {
    let ship: boolean[][]
    if(gameMode===0)
      ship = allShips
    else
      ship = ShipsInit()
    return ship
  }

  function showShips() {
    for(let i=0; i<100; i++) {
      for(let j=0; j<10; j++) {
        if(allShips[i][j]===true)
          console.log("ship: ", i, j)
      }
    }
    console.log('--')
    setShips(getShips())
  }
  return (
    <div className="App">
      <div className="inline-board">
        <Scoreboard player1={2} player2={3}/>
        <Shipsboard/>
        <button onClick={()=>setMode((gameMode+1)%2)}>Change mode {gameMode}</button>
        <button onClick={showShips}>Show ships</button>
      </div>
      <div className="inline-field">
        <Battlefield gameMode={gameMode} ships={ships}/>
      </div>
    </div>
  );
};

export default App;
