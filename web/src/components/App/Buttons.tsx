import React, { useState } from 'react';

import './App.css'

import {
  HideOrNot, BoolToOnOff
} from './AppFunctions'

import { getString } from '../Translation/String'

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

const Buttons: React.FC<ButtonsProps> = ({ setMode,
                                         gameMode,
                                         goBattle,
                                         setClear,
                                         isClear,
                                         setOpponentID,
                                         ID,
                                         copyOpID }) => {
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
      <form onSubmit={submitID} style={HideOrNot(gameMode)} >
        <label>
          {getString('friend_id')}: <input
            type="number"
            value={newID}
            placeholder="0"
            onChange={handleChange} />
        </label>
        <input type="submit" value={getString('go_battle')}/>
      </form>

      <button
          onClick={()=>setClear(!isClear)}
          style={HideOrNot(gameMode)}>{getString('fix_ships')}</button>
      <i style={HideOrNot(gameMode)}>
        {BoolToOnOff(isClear)}</i>
      <p style={HideOrNot(gameMode)}>{getString('fix_ships_explain')}</p>
      <span style={HideOrNot((gameMode+1)%2)}
         id="yID"
         onClick={handleClickID}
      >{getString('your_id')}: {ID}</span>
    </div>
  );
};

export default Buttons
