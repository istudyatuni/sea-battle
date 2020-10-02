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
    console.log('useEffect')
    setImg(fillBlock(true))
  },[element]);

  function fillBlock(first: boolean): object {
    let path
    console.log('el : ', element)
    if(gameMode===0){
      // setting ships
      if(first===false) {
        path = settingShips(first, isClear)
        setCell(i)
      } else {
        path = "Empty"
      }
    } else if(gameMode===1) {
      // when battle
      if(first===false) {
        // when player tap to cell
        /*(async ()=>{
          await shot(i)
        })()*/
        shot(i)
        // path = "Hit"
        if(element===0) {
          // before battle need clear field
          path = "Miss"
        } else if(element===1) {
          path = "Hit"
        } else {
          path = "Empty"
        }
        console.log('f 0: ', path)
      } else {
        if(element===0) {
          // before battle need clear field
          path = "Empty"
        } else if(element===1) {
          path = "Miss"
        } else {
          path = "Hit"
        }
        console.log('f 1: ', path)
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
