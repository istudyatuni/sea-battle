import React, { useEffect, useState } from 'react';

import { battle, getCursor, view } from './CellFunctions'

type CellProps = {
  i: number,
  isClear: boolean,
  element: number,
  gameMode: number,
  setCell: (arg0: number)=>void,
  shot: (arg0: number)=>void
}

const Cell: React.FC<CellProps> = ({ i, isClear, element, gameMode, setCell, shot }) => {
  const [path, setPath] = useState('Empty')

  useEffect(()=>{
    if(gameMode===1) {
      setPath(battle(element))
    } else if(gameMode===2) {
      setPath(view(element))
    }
  },[element]);

  function fillBlock() {
    if(gameMode===0){
      if(isClear===false) {
        setPath('Ship')
      } else {
        setPath('Empty')
      }
      setCell(i)
    } else if(gameMode===1 && element===0) {
      shot(i)
    }
  }

  return (
    <div className="Cell"
         onClick={fillBlock}
         style={getCursor(gameMode)}>
      <img src={'assets/' + path + '.png'} alt="" width="100%" height="100%"/>
    </div>
  );
};

export default React.memo(Cell);
