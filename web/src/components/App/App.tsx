import React, { useState, useEffect } from 'react';

import './App.css';
import Buttons from'./Buttons'
import Scoreboard from '../Scoreboard/Scoreboard'
import Shipsboard from '../Ships/Shipsboard'
import Battlefield from '../Battlefield/Battlefield'

import {
  FieldInit, HideOrNot,
  BoolToOnOff, HitOrMiss,
  togglePopup
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

  const [theme, setTheme] = useState('light')

  function toggleTheme() {
    if(theme==='light')
      setTheme('dark')
    else if(theme==='dark')
      setTheme('light')
  }

  useEffect(()=>{
    let html = document.getElementById('html')
    if(html!==null) {
      if(theme==='light')
        html.classList.remove('dark-mode')
      else if(theme==='dark')
        html.classList.add('dark-mode')
    }
  }, [theme]);

  function changeField(x: number, y: number, new_value: number) {
    let f = field
    f[x][y] = new_value
    setField(f)
  }

  const goBattle = async () => {
    await SendShips(field, setID, opponentID, setOpponentID)

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

  function copyOpponentID() {
    navigator.clipboard.writeText(ID)
  }

  // ¯\_(ツ)_/¯
  return (
    <div className="App">
      <div className="theme-toggle" onClick={toggleTheme}>🌓</div>
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
          copyOpID={copyOpponentID}
        />
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
        <div className="popup-box" id="popup" onClick={()=>togglePopup(false)}></div>
      </div>
    </div>
  );
};

export default App;
