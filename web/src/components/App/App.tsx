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

  const hide = {
    display: 'none'
  }

  const go_battle = async () => {
    let sendShips = BoolArrayToInt(ships)

    const NO_RESPONSE_CODE = 0

    const response = await fetch('/ships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ships: sendShips }),
    });

    let id
    if (response.status === NO_RESPONSE_CODE) {
      // server unavailable
      console.log('Server unavailable')
      return Promise.reject(new Error('Server unavailable'));
    } else if(response.ok) {
      let resp = await response.json() as {
        id: string;
      }
      id = resp.id
    }

    setShips(ShipsInit())
    setMode(1)
  }

  function hideOrNot(a: number): any {
    if(a===1) {
      return hide
    }
  }

  // ¯\_(ツ)_/¯
  return (
    <div className="App">
      <div className="inline-board">
        <Scoreboard player1={countPlayer1} player2={3}/>
        <Shipsboard/>

        <button onClick={()=>setClear(!isClear)} style={hideOrNot(gameMode)}>
          Fix ships is now <i>{isClear.toString()}</i>
        </button>
        <button onClick={go_battle} style={hideOrNot(gameMode)}>Go battle</button>

        <p style={hideOrNot(gameMode)}>Fix ships - if you place it wrong</p>
        <p style={hideOrNot((gameMode+1)%2)}>Good game!</p>
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
