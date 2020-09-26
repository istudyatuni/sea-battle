import React, { useEffect, useState } from 'react';

import './Shipboard.css'
import Indicator from './Indicator'

type ShipProps = {
  i: number,
  name: string,
  count: number,
  kill: number,
  changeKill: (arg0: number)=>void
}

const Ship: React.FC<ShipProps> = ({ i, name, count, kill, changeKill }) => {
  let path = "assets/" + name + "Shape.png"

  useEffect(()=>{
    setKillLine(renderKillLine())
  }, [kill]);

  function renderKillLine(): object[] {
    let line = []
    if(kill > count)
      kill = count
    for(let i = 0; i < kill; i++){
      line.push(<Indicator isKill={true}/>)
    }
    for(let i = kill; i < count; i++){
      line.push(<Indicator isKill={false}/>)
    }
    return line
  }

  function addKill() {
    changeKill(i)
  }

  const [KillLine, setKillLine] = useState(renderKillLine())

  return (
    <div className="Ship">
      <img src={path} alt={name} />
      <p>{count}</p>
      {KillLine}
      <button onClick={addKill}>+</button>
      <p>{kill}</p>
    </div>
  );
};

export default Ship;
