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

function BoolArrayToInt(a: boolean[][]): number[][] {
  let num = []
  for(let i=0; i<10; i++) {
    let tmp = []
    for(let j=0; j<10; j++) {
      if(a[i][j]===true){
        tmp.push(1)
      } else {
        tmp.push(0)
      }
    }
    num.push(tmp)
  }
  return num
}

const App: React.FC = () => {
  const [countPlayer1, setCount1] = useState(0)

  const [gameMode, setMode] = useState(0)
  const [ships, setShips] = useState<boolean[][]>(ShipsInit())
  const [isClear, setClear] = useState(false)

  const go_battle = async () => {
    let sendShips = BoolArrayToInt(ships)
    const response = await fetch('/ships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ships: sendShips }),
    });
    let resp = await response.json() as {
      id: string;
    }
    let id = resp.id
    console.log("good luck :)")

    setShips(ShipsInit())
    setMode(1)
  }

  // ¯\_(ツ)_/¯
  return (
    <div className="App">
      <div className="inline-board">
        <Scoreboard player1={countPlayer1} player2={3}/>
        <Shipsboard/>
        <button onClick={()=>setClear(!isClear)}>
          Fix ships is now <i>{isClear.toString()}</i>
        </button>
        <button onClick={go_battle}>Go battle</button>
        <p>Fix ships - if you place it wrong</p>
      </div>
      <div className="inline-field">
        <Battlefield
          key={gameMode.toString()}
          isClear={isClear}
          gameMode={gameMode}
          ships={ships}
        />
      </div>
    </div>
  );
};

export default App;
