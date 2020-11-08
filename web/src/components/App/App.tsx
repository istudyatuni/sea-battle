import React, { useState, useEffect } from 'react';

import './App.css';
import Buttons from'../Buttons/Buttons'
import Battlefield from '../Battlefield/Battlefield'

import {
  FieldInit, HitOrMiss,
  togglePopup, validateAndTransform,
  HideOrNot
} from './AppFunctions'

import { initLocale, getString } from '../Translation/String'

import { SendShips } from './api/MainServerAPI'

function useKeyup(key: string, action: ()=>void) {
  useEffect(()=>{
    function onKeyup(e: any) {
      if(e.key === key) {
        e.preventDefault()
        action()
      }
    }
    window.addEventListener('keyup', onKeyup)
    return () => window.removeEventListener('keyup', onKeyup)
  }, []);
}

const App: React.FC = () => {
  initLocale()

  const [gameMode, setMode] = useState(0)
  const [field, setField] = useState<number[][]>(FieldInit())
  const [isClear, setClear] = useState(false)

  useKeyup(' ', () => setClear(isClear => !isClear))

  const [opponentID, setOpponentID] = useState("0")
  const [ID, setID] = useState("0")

  function getTheme (): string {
    let t = (new Date).getHours()
    if(t > 6 && t < 18) {
      return 'light'
    }
    return 'dark'
  }

  const [theme, setTheme] = useState(getTheme())

  function toggleTheme() {
    if(theme==='light') {
      setTheme('dark')
    } else if(theme==='dark') {
      setTheme('light')
    }
  }

  useEffect(()=>{
    let html = document.getElementById('html')
    if(html!==null) {
      if(theme==='light') {
        html.classList.remove('dark-mode')
      } else if(theme==='dark') {
        html.classList.add('dark-mode')
      }
    }
  }, [theme]);

  function changeField(x: number, y: number, new_value: number) {
    let f = field
    f[x][y] = new_value
    setField(f)
  }

  const goBattle = async () => {
    let ships = validateAndTransform(field)
    if(ships.result === 'fail') {
      togglePopup(true, 'warn', getString('incorrect_ship_placement'))
      return
    }

    await SendShips(ships, setID, opponentID, setOpponentID, setMode)

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
  async function shot (x: number, y: number) {
    await HitOrMiss(ID, x, y, changeField)
    setWTF((wtf+1)%2)
  }

  function copyOpponentID() {
    navigator.clipboard.writeText(ID)
    togglePopup(true, 'success', getString('copied'))
  }

  // ¯\_(ツ)_/¯
  return (
    <div className="App">
      <span role="img" aria-label="toggler" className="theme-toggle" onClick={toggleTheme}>🌓</span>
      <div className="inline-board">
        <h1 className="title" style={HideOrNot(gameMode)}>Sea Battle</h1>
        <div style={HideOrNot((gameMode+1)%2)}>
          <Battlefield
            key={gameMode.toString()}
            isClear={isClear}
            gameMode={gameMode}
            field={field}
            shot={shot}
          />
        </div>
        <Buttons
          gameMode={gameMode}
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
