import React, { useState } from 'react';


type CellProps = {
  i: number,
  state: number,
  gameMode: number,
  isShip: boolean,
  setShip: (arg0: number)=>void
}

const Cell: React.FC<CellProps> = ({ i, state, gameMode, isShip, setShip }) => {
  // maybe isShip no need more?
  function block(first: boolean, state: number): any {
    let path
    if(first===false && gameMode===0){
      path = "Ship"
      setShip(i)
    } else if(state===1) {
      path = "Miss"
    } else if(state===2){
      path = "Hit"
    } else {
      path = "Empty"
    }
    if(gameMode===1)
      path = "Empty"
    path = "assets/" + path + ".png"
    return <img src={path} alt="" width="100%" height="100%"/>
  }

  const [image, setImg] = useState(block(true, state))
  return (
    <>
      <div className="Cell" onClick={()=>setImg(block(false, state+1))}>
        {image}
      </div>
    </>
  );
};

export default React.memo(Cell);
