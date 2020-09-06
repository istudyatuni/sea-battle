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
  const [allShips, setShips] = useState<boolean[][]>(ShipsInit())
  const [gameMode, setMode] = useState(0)

  function showShips() {
    for(let i=0; i<100; i++) {
      for(let j=0; j<10; j++) {
        if(allShips[i][j]===true)
          console.log("ship: ", i, j)
      }
    }
    console.log('--')
  }
  return (
    <div className="App">
      <div className="inline-board">
        <Scoreboard player1={2} player2={3}/>
        <Shipsboard/>
        <button onClick={showShips/*()=>setMode((gameMode+1)%2)*/}>Show ships</button>
      </div>
      <div className="inline-field">
        <Battlefield stateGame={gameMode} ships={allShips}/>
      </div>
    </div>
  );
};

export default App;
