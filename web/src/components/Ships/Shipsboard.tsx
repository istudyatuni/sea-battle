import React from 'react';
import Ship from './Ship'
import './Shipboard.css'

const Shipsboard: React.FC = () => {
  return (
    <div className="Shipsboard">
      <Ship name="Aircraft"   count={1} kill={0} />
      <Ship name="Battleship" count={2} kill={1} />
      <Ship name="Cruiser"    count={3} kill={0} />
      <Ship name="Submarine"  count={4} kill={1} />
      <Ship name="Carrier"    count={5} kill={3} />
    </div>
  );
};

export default Shipsboard;
