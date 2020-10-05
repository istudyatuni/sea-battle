import React, { useState } from 'react';

import './App.css'

import {
  HideOrNot, BoolToOnOff
} from './AppFunctions'

type ButtonsProps = {
  setMode: (arg0: number) => any,
  gameMode: number,

  goBattle: () => void,

  setClear: (arg0: boolean) => any,
  isClear: boolean,

  setOpponentID: (arg0: string) => any,
  ID: string,

  copyOpID: () => void
}

const Buttons: React.FC<ButtonsProps> = ({ setMode, gameMode, goBattle, setClear, isClear, setOpponentID, ID, copyOpID }) => {
  const [newID, setNewID] = useState("")

  function handleChange(event: any) {
    let a = event.target.value
    if(a > 0) {
      setNewID(a)
      setOpponentID(a)
    }
  }

  function submitID(event: any) {
    goBattle()
    event.preventDefault()
  }

  function handleClickID() {
    copyOpID()
  }

  return (
    <div className="Buttons">
      <span style={HideOrNot(gameMode)}>
        You can fix ships if place them wrong</span>
      <button
          onClick={()=>setClear(!isClear)}
          style={HideOrNot(gameMode)}>
        Fix ships</button>
      <i style={HideOrNot(gameMode)}>
        {BoolToOnOff(isClear)}</i>

      <form onSubmit={submitID} style={HideOrNot(gameMode)} >
        <label>
          Friend ID: <input
            type="number"
            value={newID}
            placeholder="0"
            onChange={handleChange} />
        </label>
        <input type="submit" value="Go battle"/>
      </form>
      <span style={HideOrNot((gameMode+1)%2)}
         id="yID"
         onClick={handleClickID}
      >Your ID: {ID}</span>
    </div>
  );
};

export default Buttons
