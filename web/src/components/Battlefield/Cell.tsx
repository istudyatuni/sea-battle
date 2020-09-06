import React, { useState } from 'react';


type CellProps = {
  i: number,
  state: number,
  stateGame: number,
  isShip: boolean,
  setShip: (arg0: number)=>void
}

const Cell: React.FC<CellProps> = ({ i, state, stateGame, isShip, setShip }) => {

  function block(first: boolean, state: number): any {
    console.log(first, state, stateGame, isShip)
    let path
    if(first===false && stateGame===0 || isShip===true){
      path = "Ship"
      setShip(i)
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
  return (
    <>
      <div className="Cell" onClick={()=>setImg(block(false, state+1))}>
        {image}
      </div>
    </>
  );
};

export default React.memo(Cell);
