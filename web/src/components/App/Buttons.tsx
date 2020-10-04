import React from 'react';

import {
  HideOrNot, BoolToOnOff
} from './AppFunctions'

type ButtonsProps = {
  setMode: (arg0: number) => any,
  gameMode: number,

  goBattle: () => void,

  setClear: (arg0: boolean) => any,
  isClear: boolean,
  ID: string
}

const Buttons: React.FC<ButtonsProps> = ({ setMode, gameMode, goBattle, setClear, isClear, ID }) => {
  return (
    <div className="Buttons">
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
  );
};

export default Buttons
