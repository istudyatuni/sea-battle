import React, { useState, useEffect } from 'react';
import Cookie from 'js-cookie'

import './App.css';
import Buttons from'../Buttons/Buttons'
import Battlefield from '../Battlefield/Battlefield'

import {
  FieldInit, HitOrMiss,
  togglePopup, validateAndTransform,
  HideOrNot, transformBack
} from './AppFunctions'

import { newGame } from '../Buttons/ButtonFunctions'

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
    function onKeydown(e: any) {
      if(e.key === key) {
        e.preventDefault()
      }
    }
    window.addEventListener('keyup', onKeyup)
    window.addEventListener('keydown', onKeydown)
    return () => {
      window.removeEventListener('keyup', onKeyup)
      window.removeEventListener('keydown', onKeydown)
    }
  }, []);
}

function useKeydown(key: number, action: ()=>void) {
  useEffect(()=>{
    function onKeydown(e: any) {
      if(e.keyCode === key) {
        e.preventDefault()
        action()
      }
    }
    window.addEventListener('keydown', onKeydown)
    return () => window.removeEventListener('keydown', onKeydown)
  }, []);
}

const App: React.FC = () => {
  initLocale()

  const [gameMode, setMode] = useState(0)
  const [playerField, setPlayerField] = useState<number[][]>(FieldInit())
  const [opponentField, setOpField] = useState<number[][]>(FieldInit())
  const [isClear, setClear] = useState(false)

  useKeyup(' ', () => setClear(isClear => !isClear))

  const [opponentID, setOpponentID] = useState("0")
  const [ID, setID] = useState("0")

  function getTheme (): string {
    let c = Cookie.get('theme')
    if(c!==undefined) {
      return c
    }
    let t = (new Date()).getHours()
    if(t > 6 && t < 18) {
      return 'light'
    }
    return 'dark'
  }

  const [theme, setTheme] = useState(getTheme())

  function toggleTheme() {
    let t = ''
    if(theme==='light') {
      t = 'dark'
    } else if(theme==='dark') {
      t = 'light'
    }
    Cookie.set('theme', t)
    setTheme(t)
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
    const f = opponentField
    f[x][y] = new_value
    setOpField(f)
  }

  function changeViewField(x: number, y: number, new_value: number) {
    const f = [...playerField]
    f[x][y] = new_value
    setPlayerField(f)
  }

  const goBattle = async () => {
    let ships = validateAndTransform(opponentField)
    if(ships.result === 'fail') {
      togglePopup(true, 'warn', getString('incorrect_ship_placement'))
      return
    }

    await SendShips(ships, setID, opponentID, setOpponentID, changeViewField)

    let t = transformBack(opponentField)
    setPlayerField([...t])
    setOpField(FieldInit())
    setMode(gameMode => 1)
    setClear(false)
  }

  useKeydown(27, () => newGame())

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
    if(navigator.clipboard) {
      navigator.clipboard.writeText(ID)
      togglePopup(true, 'success', getString('copied'))
    }
  }

  // ¯\_(ツ)_/¯
  return (
    <div className="App">
      <span role="img" aria-label="toggler" className="theme-toggle" onClick={toggleTheme}>🌓</span>
      <div className="inline-board">
        <h1 className="title" style={HideOrNot(gameMode)}>{getString('sea_battle_title')}</h1>
        <div style={HideOrNot((gameMode+1)%2)}>
          <Battlefield
            key={playerField.toString()}
            isClear={isClear}
            gameMode={2}
            field={playerField}
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
          field={opponentField}
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
