import React, { useState } from 'react';

import {
  settingShips,
  battle
} from './CellFunctions'

type CellProps = {
  i: number,
  isClear: boolean,
  gameMode: number,
  setShip: (arg0: number)=>void
}

const Cell: React.FC<CellProps> = ({ i, isClear, gameMode, setShip }) => {
  // first == true when first cell's render

  function fillBlock(first: boolean): object {
    let path
    if(gameMode===0){
      // setting ships
      if(first===false) {
        path = settingShips(first, isClear)
        setShip(i)
      } else {
        path = "Empty"
      }
    } else if(gameMode===1) {
      // when battle
      if(first===false) {
        path = battle(1)
      } else {
        // before battle need clear field
        path = "Empty"
      }
    }
    path = "assets/" + path + ".png"
    return <img src={path} alt="" width="100%" height="100%"/>
  }

  const [image, setImg] = useState(fillBlock(true))
  return (
    <div className="Cell" onClick={()=>setImg(fillBlock(false))}>
      {image}
    </div>
  );
};

export default React.memo(Cell);
