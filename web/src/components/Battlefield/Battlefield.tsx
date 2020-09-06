import React from 'react';
import Cell from './Cell'
import './Battlefield.css'

/*type BattlefieldProps = {
}*/

function TestOnClick(a: number): number {
  return a++;
}

const Battlefield: React.FC = () => {
  let fieldWidth = 10
  let rows = []
  for(let i=0; i<fieldWidth; i++) {
    let row = []
    for(let j=0; j<fieldWidth; j++) {
      row.push(<td onClick={()=>TestOnClick(i+j)}>{i+j}</td>)
    }
    rows.push(<tr>{row}</tr>)
  }
  return (
    <div className="Battlefield">
        <table>
          <tbody>{rows}</tbody>
        </table>
    </div>
  );
};

export default Battlefield;
