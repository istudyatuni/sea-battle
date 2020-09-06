import React from 'react';
import CellRow from './CellRow'
import './Battlefield.css'

/*type BattlefieldProps = {
}*/

const Battlefield: React.FC = () => {
  // 0 - empty, 1 - miss, 2 - hit
  return (
    <div className="Battlefield">
        <table>
          <tbody>
            <CellRow i={0} j={[0,0,0,0,0,0,1,0,1,0]}/>
            <CellRow i={1} j={[0,0,0,0,0,0,1,0,1,0]}/>
            <CellRow i={2} j={[0,0,0,0,0,0,0,0,1,0]}/>
            <CellRow i={3} j={[0,0,0,1,0,0,1,0,0,0]}/>
            <CellRow i={4} j={[0,0,0,0,0,0,1,0,1,0]}/>
            <CellRow i={5} j={[0,0,0,0,0,0,0,0,1,0]}/>
            <CellRow i={6} j={[0,0,0,0,0,0,1,0,0,0]}/>
            <CellRow i={7} j={[0,2,0,0,0,0,1,0,0,0]}/>
            <CellRow i={8} j={[0,0,0,0,0,0,1,0,1,0]}/>
            <CellRow i={9} j={[0,0,0,0,0,0,1,0,1,0]}/>
          </tbody>
        </table>
    </div>
  );
};

export default Battlefield;
