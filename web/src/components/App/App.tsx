import React, { useState } from 'react';

import './App.css';
import Scoreboard from '../Scoreboard/Scoreboard'
import Shipsboard from '../Ships/Shipsboard'
import Battlefield from '../Battlefield/Battlefield'

import {
  ShipsInit,
  BoolArrayToInt,
  hideOrNot,
  boolToOnOff
} from './AppFunctions'

const App: React.FC = () => {
  const [countPlayer1, setCount1] = useState(0)
  const [countPlayer2, setCount2] = useState(0)

  const [gameMode, setMode] = useState(0)
  const [ships, setShips] = useState<boolean[][]>(ShipsInit())
  const [isClear, setClear] = useState(false)

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
    setClear(false)
  }

  // ¯\_(ツ)_/¯
  return (
    <div className="App">
      <div className="inline-board">
        <Scoreboard player1={countPlayer1} player2={countPlayer2}/>
        <Shipsboard/>

        <button
            onClick={go_battle}
            style={hideOrNot(gameMode)}>
          Go battle
        </button>
        <button
            onClick={()=>setClear(!isClear)}
            style={hideOrNot(gameMode)}>
          Fix ships
        </button>
        <i style={hideOrNot(gameMode)}>{boolToOnOff(isClear)}</i>

        <p style={hideOrNot(gameMode)}>
          You can fix ships if place them wrong
        </p>
        <p style={hideOrNot((gameMode+1)%2)} onClick={()=>setMode(0)}>
          Good game!
        </p>
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
