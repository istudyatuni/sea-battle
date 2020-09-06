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
      state = 0
      path = 0
    }
    let image
    if(state>0){
      path = "assets/" + path + ".png"
      image = <img src={path} alt="" width="100%" height="100%"/>
    } else {
      image = <div></div>
    }
    return image
  }
  const [image, setImg] = useState(block(state))
  return (
    <>
      <td className="Cell" onClick={()=>setImg(block(state+1))}>
        {image}
      </td>
    </>
  );
};

export default React.memo(Cell);
