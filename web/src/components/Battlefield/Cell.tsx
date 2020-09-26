import React, { useEffect, useState } from 'react';

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

  useEffect(()=>{
    setImg(fillBlock(true))
  },[isClear]);

  function fillBlock(first: boolean): object {
    let path
    if(gameMode===0){
      // setting ships
      if(first===false) {
        path = settingShips(first, isClear)
        setShip(i)
      } else {
        // here instead isClear set param for
        // detecting hit/miss
        // and move it away
        if(isClear===false) {
          path = "Hit"
        } else {
          path = "Empty"
        }

        path = "Empty"
      }
    } else if(gameMode===1) {
      // when battle
      if(first===false) {
        // when player tap to cell
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
