import React, { useEffect, useState } from 'react';

import {
  settingShips
} from './CellFunctions'

type CellProps = {
  i: number,
  isClear: boolean,
  element: number,
  gameMode: number,
  setCell: (arg0: number)=>void,
  shot: (arg0: number)=>void
}

const Cell: React.FC<CellProps> = ({ i, isClear, element, gameMode, setCell, shot }) => {
  // first == true when first cell's render

  useEffect(()=>{
    setImg(fillBlock(true))
  },[element]);

  function fillBlock(first: boolean): object {
    let path
    if(gameMode===0){
      // setting ships
      if(first===false) {
        path = settingShips(first, isClear)
        setCell(i)
      } else if(isClear===true) {
        path = "Empty"
        if(element===1)
          path = "Ship"
      } else {
        path = "Empty"
      }
    } else if(gameMode===1) {
      // when battle
      if(first===false) {
        if(element===0) {
          shot(i)
          path = "Empty"
        } else {
          // if tap more one time
          if(element===1)
            path = "Miss"
          else if(element===2)
            path = "Hit"
        }
      } else {
        if(element===0) {
          // before battle need clear field
          path = "Empty"
        } else if(element===1) {
          path = "Miss"
        } else {
          path = "Hit"
        }
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
