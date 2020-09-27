import React, { useState } from 'react';

import './App.css';
import Scoreboard from '../Scoreboard/Scoreboard'
import Shipsboard from '../Ships/Shipsboard'
import Battlefield from '../Battlefield/Battlefield'

import {
  FieldInit, HideOrNot,
  BoolArrayToInt, BoolToOnOff,
  HitOrMiss
} from './AppFunctions'

import { SendShips, SendShot } from './AppServerAPI'

const App: React.FC = () => {
  const [countPlayer1, setCount1] = useState(0)
  const [countPlayer2, setCount2] = useState(0)

  const [gameMode, setMode] = useState(0)
  const [field, setField] = useState<boolean[][]>(FieldInit())
  const [isClear, setClear] = useState(false)
  const [ID, setID] = useState("0")

  function changeField(x: number, y: number, new_value: boolean) {
    let f = field
    f[x][y] = new_value
    setField(f)
  }

  const goBattle = async () => {
    let sendShips = BoolArrayToInt(field)

    SendShips(sendShips, setID)

    setField(FieldInit())
    setMode(1)
    setClear(false)
  }

  const shot = async (x: number, y: number) => {
    HitOrMiss(ID, x, y, changeField)
  }

  // ¯\_(ツ)_/¯
  return (
    <div className="App">
      <div className="inline-board">
        <Scoreboard player1={countPlayer1} player2={countPlayer2}/>
        <Shipsboard/>

        <button
            onClick={goBattle}
            style={HideOrNot(gameMode)}>
          Go battle
        </button>
        <button
            onClick={()=>setClear(!isClear)}
            style={HideOrNot(gameMode)}>
          Fix ships
        </button>
        <i style={HideOrNot(gameMode)}>{BoolToOnOff(isClear)}</i>

        <p style={HideOrNot(gameMode)}>
          You can fix ships if place them wrong
        </p>
        <p style={HideOrNot((gameMode+1)%2)} onClick={()=>setMode(0)}>
          Good game! id={ID}
        </p>
        <button style={HideOrNot((gameMode+1)%2)} onClick={async()=>shot(1,1)}>
          Shot
        </button>
      </div>

      <div className="inline-field">
        <Battlefield
          key={gameMode.toString()}
          isClear={isClear}
          gameMode={gameMode}
          ships={field}
        />
      </div>
    </div>
  );
};

export default App;
