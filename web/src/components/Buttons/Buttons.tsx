import React, { useState } from 'react';
import './Buttons.css'
import { newGame, BoolToOnOff } from './ButtonFunctions'
import { HideOrNot } from '../App/AppFunctions'
import { getString } from '../Translation/String'

type ButtonsProps = {
  gameMode: number,
  goBattle: () => void,
  setClear: (arg0: boolean) => any,
  isClear: boolean,
  setOpponentID: (arg0: string) => any,
  ID: string,
  copyOpID: () => void
  theme: string
}

const Buttons: React.FC<ButtonsProps> = ({ gameMode,
                                         goBattle,
                                         setClear,
                                         isClear,
                                         setOpponentID,
                                         ID,
                                         copyOpID,
                                         theme }) => {
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
        <div className={"gh-logo " + theme}>
          <a href="https://www.github.com" target="blank">
            <img src="assets/github.svg" alt="Github logo" />
          </a>
        </div>
      </div>

      <div style={HideOrNot((gameMode+1)%2)} >
        <span
           id="yID"
           className="middle"
           onClick={handleClickID}
        >{getString('your_id')}: {ID}</span>
        <br/>
        <button
          className="middle hide"
          id="new_game"
          onClick={()=>window.location.reload()}
        >{getString('new_game')}</button>
      </div>
    </div>
  );
};

export default Buttons
