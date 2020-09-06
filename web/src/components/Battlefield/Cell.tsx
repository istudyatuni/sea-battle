import React, { useState } from 'react';


type CellProps = {
  state: number
}

const Cell: React.FC<CellProps> = ({ state }) => {

  function block(state: number): any {
    let path
    if(state===1) {
      path = "Miss"
    }
    else if(state===2){
      path = "Hit"
    }
    else {
      path = "Empty"
    }
    path = "assets/" + path + ".png"
    return <img src={path} alt="" width="100%" height="100%"/>
  }
  const [image, setImg] = useState(block(state))
  return (
    <>
      <div className="Cell" onClick={()=>setImg(block(state+1))}>
        {image}
      </div>
    </>
  );
};

export default React.memo(Cell);
