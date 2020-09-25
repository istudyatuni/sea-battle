import React, { useState } from 'react';


type CellProps = {
  i: number,
  state: number,
  gameMode: number,
  isShip: boolean,
  setShip: (arg0: number)=>void
}

function settingShips(first: boolean, isShip: boolean): string {
  let path
  if(isShip===false) {
    path = "Ship"
  } else if(first===false) {
    path = "Ship"
  } else {
    path = "Empty"
  }
  // console.log(path)
  return path
}

function battle(state: number): string {
  let path
  if(state===1) {
    path = "Miss"
  } else if(state===2){
    path = "Hit"
  } else {
    path = "Empty"
  }
  // console.log(path)
  return path
}

const Cell: React.FC<CellProps> = ({ i, state, gameMode, isShip, setShip }) => {
  // first == true when first cell's render

  function fillBlock(first: boolean): object {
    let path
    if(gameMode===0){
      if(first===false) {
        path = settingShips(first, isShip)
        setShip(i)
      } else if(isShip===true){
        // path = "Ship"
      } else {
        path = "Empty"
      }
    } else if(gameMode===1) {
      if(first===false) {
        path = battle(1)
      } else {
        // before battle need clear field
        path = "Empty"
      }
    }
    if(isShip===true)
      path = "Ship"
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
