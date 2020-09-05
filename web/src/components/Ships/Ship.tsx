import React from 'react';
import './Shipboard.css'
import Indicator from './Indicator'

type ShipProps = {
  name: string,
  count: number,
  kill: number
}

const Ship: React.FC<ShipProps> = ({ name, count, kill }) => {
  let path = "assets/" + name + "Shape.png"
  let KillsLine = []
  if(kill > count || kill < 0)
    // better not change props
    kill=0
  for(let i = 0; i < kill; i++){
    KillsLine.push(<Indicator isKill={true}/>)
  }
  for(let i = kill; i < count; i++){
    KillsLine.push(<Indicator isKill={false}/>)
  }
  return (
    <div className="Ship">
      <img src={path} alt={name} />
      {KillsLine}
    </div>
  );
};

export default Ship;
