import React, { useState } from 'react';

import './App.css';
import Buttons from'./Buttons'
import Scoreboard from '../Scoreboard/Scoreboard'
import Shipsboard from '../Ships/Shipsboard'
import Battlefield from '../Battlefield/Battlefield'

import {
  FieldInit, HideOrNot,
  BoolToOnOff, HitOrMiss
} from './AppFunctions'

import { SendShips, getOpponentID } from './AppServerAPI'

const App: React.FC = () => {
  const [countPlayer1, setCount1] = useState(0)
  const [countPlayer2, setCount2] = useState(0)

  const [gameMode, setMode] = useState(0)
  const [field, setField] = useState<number[][]>(FieldInit())
  const [isClear, setClear] = useState(false)

  const [opponentID, setOpponentID] = useState("0")
  const [ID, setID] = useState("0")

  function changeField(x: number, y: number, new_value: number) {
    let f = field
    f[x][y] = new_value
    setField(f)
  }

  const goBattle = async () => {
    await SendShips(field, setID, opponentID)

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
    await HitOrMiss(opponentID, x, y, changeField)
    setWTF(wtf+1)
  }

  // ¯\_(ツ)_/¯
  return (
    <div className="App">
      <div className="inline-board">
        <Scoreboard player1={countPlayer1} player2={countPlayer2}/>
        <Shipsboard/>
        <Buttons
          gameMode={gameMode}
          setMode={setMode}
          goBattle={goBattle}
          isClear={isClear}
          setClear={setClear}
          setOpponentID={setOpponentID}
          ID={ID}
        />
        <button onClick={()=>{getOpponentID(ID, setOpponentID)}}
                style={HideOrNot((gameMode+1)%2)}
                id="getID"
        >Get opponent ID</button>
      </div>

      <div className="inline-field">
        <Battlefield
          key={gameMode.toString()}
          isClear={isClear}
          gameMode={gameMode}
          field={field}
          shot={shot}
        />
      </div>

      <div className="popup">
        <span className="popup-box" id="popup"></span>
      </div>
    </div>
  );
};

export default App;
