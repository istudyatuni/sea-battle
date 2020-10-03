import React, { useState } from 'react';

import './App.css';
import Scoreboard from '../Scoreboard/Scoreboard'
import Shipsboard from '../Ships/Shipsboard'
import Battlefield from '../Battlefield/Battlefield'

import {
  FieldInit, HideOrNot,
  BoolToOnOff, HitOrMiss
} from './AppFunctions'

import { SendShips } from './AppServerAPI'

const App: React.FC = () => {
  const [countPlayer1, setCount1] = useState(0)
  const [countPlayer2, setCount2] = useState(0)

  const [gameMode, setMode] = useState(0)
  const [field, setField] = useState<number[][]>(FieldInit())
  const [isClear, setClear] = useState(false)
  const [ID, setID] = useState("0")

  function changeField(x: number, y: number, new_value: number) {
    let f = field
    f[x][y] = new_value
    setField(f)
  }

  const goBattle = async () => {
    let sendShips = field

    await SendShips(sendShips, setID)

    setField(FieldInit())
    setMode(1)
    setClear(false)
  }

  /*
    WTF? if call in 'shot' just one async function with await,
    re-render child components not work (empty not change to
    "hit" / "miss"), but if use some changes for some state (like
    i below), then all work. How, just.. HOW??
  */
  const [wtf, setWTF] = useState(0)
  const shot = async (x: number, y: number) => {
    await HitOrMiss(ID, x, y, changeField)
    setWTF(wtf+1)
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
          Go battle</button>
        <button
            onClick={()=>setClear(!isClear)}
            style={HideOrNot(gameMode)}>
          Fix ships</button>
        <i style={HideOrNot(gameMode)}>
          {BoolToOnOff(isClear)}</i>

        <p style={HideOrNot(gameMode)}>
          You can fix ships if place them wrong</p>

        <p style={HideOrNot((gameMode+1)%2)} onClick={()=>setMode(0)}>
          Good game! id={ID}</p>
      </div>

      <div className="inline-field">
        <Battlefield
          key={field.toString()}
          isClear={isClear}
          gameMode={gameMode}
          field={field}
          shot={shot}
        />
      </div>
    </div>
  );
};

export default App;
