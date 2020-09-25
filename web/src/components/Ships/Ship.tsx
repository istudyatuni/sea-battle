import React, { useEffect } from 'react';
import './Shipboard.css'
import Indicator from './Indicator'

type ShipProps = {
  i: number,
  name: string,
  count: number,
  kill: number,
  changeKill: (arg0: number, arg1: number)=>void
}

const Ship: React.FC<ShipProps> = ({ i, name, count, kill, changeKill }) => {
  let path = "assets/" + name + "Shape.png"
  let KillLine: object[] = []

  function renderKillLine(): object[] {
    // console.log("renderKillLine")
    let line = []
    for(let i = 0; i < kill; i++){
      line.push(<Indicator isKill={true}/>)
    }
    for(let i = kill; i < count; i++){
      line.push(<Indicator isKill={false}/>)
    }
    return line
  }

  useEffect(()=>{
    KillLine = renderKillLine()
  }, [kill]);

  function addKill() {
    changeKill(i, 1)
  }

  KillLine = renderKillLine()

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
