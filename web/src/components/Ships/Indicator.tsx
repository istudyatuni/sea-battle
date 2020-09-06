import React from 'react';
import './Shipboard.css'

type ShipProps = {
  isKill: boolean
}

const Indicator: React.FC<ShipProps> = ({ isKill }) => {
  let path
  if(isKill===true)
    path = "Hit"
  else path = "Miss"
  path = "assets/" + path + " small.png"
  return (
    <div className="Indicator">
      <img src={path} alt=""/>
    </div>
  );
};

export default Indicator;
