import React, { useState } from 'react';


type CellProps = {
  state: number,
  stateGame: number,
  isShip: boolean
}

const Cell: React.FC<CellProps> = ({ state, stateGame, isShip }) => {

  const [ship, setShip] = useState(isShip)
  function block(first: boolean, state: number): any {
    console.log(first, state, stateGame, isShip)
    let path
    if(first===false && stateGame===0 || isShip===true){
      path = "Ship"
      setShip(true)
    } else if(state===1) {
      path = "Miss"
    } else if(state===2){
      path = "Hit"
    } else {
      path = "Empty"
    }
    path = "assets/" + path + ".png"
    return <img src={path} alt="" width="100%" height="100%"/>
  }

  const [image, setImg] = useState(block(true, state))
  isShip = ship
  return (
    <>
      <div className="Cell" onClick={()=>setImg(block(false, state+1))}>
        {image}
      </div>
    </>
  );
};

export default React.memo(Cell);
