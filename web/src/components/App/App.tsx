import React, { useState } from 'react';
import './App.css';
import Scoreboard from '../Counter/Scoreboard'
import Shipsboard from '../Ships/Shipsboard'
import Battlefield from '../Battlefield/Battlefield'

function ShipsInit(): boolean[][] {
  // return array filled with false value
  let ships = []
  for(let i=0; i<10; i++) {
    let ship = []
    for(let j=0; j<10; j++) {
      ship.push(false)
    }
    ships.push(ship)
  }
  return ships
}

const App: React.FC = () => {
  const [allShips, setAllShips] = useState<boolean[][]>(ShipsInit())
  const [gameMode, setMode] = useState(0)
  const [ships, setShips] = useState<boolean[][]>(getShips(0))
  const [i, setI] = useState(0)
  const [j, setJ] = useState(0)
  const [countPlayer1, setCount1] = useState(0)

  function getShips(mode: number): boolean[][] {
    // wtf? when gameMode==0, it return ship
    // as empty array (filled with false)
    // but, maybe it happend not in this func

    // i add param mode, and it work good
    if(mode===0)
      return allShips
    else
      return ShipsInit()
  }

  function showShips() {
    for(let i=0; i<10; i++) {
      for(let j=0; j<10; j++) {
        if(ships[i][j]===true)
          console.log("ship: ", i, j)
      }
    }
    console.log('--')
    // setShips(getShips())
  }

  function setGameMode(a: number) {
    setShips(getShips((gameMode+1)%2))
    setMode(a)
    showShips()
  }

  function addShip() {
    let ships = allShips
    ships[i][j] = true
    setAllShips(ships)
    setShips(getShips((gameMode+1)%2))
    setI((i+1)%10)
    setJ((j+1)%10)
    setCount1(countPlayer1+1)
  }

  return (
    <div className="App">
      <div className="inline-board">
        <Scoreboard player1={countPlayer1} player2={3}/>
        <Shipsboard/>
        <button onClick={()=>setGameMode((gameMode+1)%2)}>Change mode, now {gameMode}</button>
        <button onClick={showShips}>Show ships</button>
        <button onClick={addShip}>Add ship</button>
      </div>
      <div className="inline-field">
        <Battlefield key={gameMode.toString()} gameMode={gameMode} ships={ships}/>
      </div>
    </div>
  );
};

export default App;
