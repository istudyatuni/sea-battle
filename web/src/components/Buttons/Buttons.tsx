import React, { useState } from 'react';

import './Buttons.css'
import { BoolToOnOff } from './ButtonFunctions'

import { HideOrNot } from 'components/App/AppFunctions'

import { getString } from 'components/Translation/String'

type ButtonsProps = {
  gameMode: number,

  goBattle: () => void,

  setClear: (arg0: boolean) => any,
  isClear: boolean,

  setOpponentID: (arg0: string) => any,
  ID: string,

  copyOpID: () => void
}

const Buttons: React.FC<ButtonsProps> = ({ gameMode,
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
      <div style={HideOrNot(gameMode)} >
        <form onSubmit={submitID}>
          <label>
            {getString('friend_id')}: <input
              type="number"
              value={newID}
              placeholder="0"
              onChange={handleChange} />
          </label>
          <input type="submit" value={getString('go_battle')}/>
        </form>

        <code>{getString('space')}</code>
        <button
          onClick={()=>setClear(!isClear)}
        >{getString('fix_ships')}</button>
        <i>{BoolToOnOff(isClear)}</i>
        <p>{getString('fix_ships_explain')}</p>
        <p>{getString('esc_for_new_game')}</p>
      </div>

      <div style={HideOrNot((gameMode+1))} className="middle" >
        <span
           id="yID"
           onClick={handleClickID}
        >{getString('your_id')}: {ID}</span>
        <br/>
        <button
          className="hide"
          id="new_game"
          onClick={()=>window.location.reload()}
        >{getString('new_game')}</button>
      </div>
    </div>
  );
};

export default Buttons
