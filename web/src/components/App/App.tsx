import React, { useState } from 'react';

import './App.css';
import Scoreboard from '../Counter/Scoreboard'
import Shipsboard from '../Ships/Shipsboard'
import Battlefield from '../Battlefield/Battlefield'

import {
  ShipsInit,
  BoolArrayToInt,
  hideOrNot
} from './AppFunctions'

const App: React.FC = () => {
  const [countPlayer1, setCount1] = useState(0)

  const [gameMode, setMode] = useState(0)
  const [ships, setShips] = useState<boolean[][]>(ShipsInit())
  const [kills, setKills] = useState([0,0,0,0,0])
  const [isClear, setClear] = useState(false)

  function addZero() {
    let a = kills
    a[0]++
    setKills(a)
    console.log(kills)
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

  // ¯\_(ツ)_/¯
  return (
    <div className="App">
      <div className="inline-board">
        <Scoreboard player1={countPlayer1} player2={3}/>
        <Shipsboard kills={kills}/>

        <button onClick={()=>setClear(!isClear)} style={hideOrNot(gameMode)}>
          Fix ships is now <i>{isClear.toString()}</i>
        </button>
        <button onClick={go_battle} style={hideOrNot(gameMode)}>Go battle</button>
        <button onClick={addZero}>add kill in 0 row</button>

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
