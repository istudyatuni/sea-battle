import React from 'react';
import CellRow from './CellRow'
import './Battlefield.css'

type BattlefieldProps = {
  stateGame: number,
  ships: boolean[][]
}

const Battlefield: React.FC<BattlefieldProps> = ({ stateGame, ships }) => {
  // 0 - empty, 1 - miss, 2 - hit (in j)
  // stateGame: 0 - placing ships
  return (
    <div className="Battlefield">
      <CellRow i={0} j={[1,0,0,0,0,0,0,0,0,0]} stateGame={stateGame} ship={ships[0]} />
      <CellRow i={1} j={[0,1,1,1,0,0,0,0,0,0]} stateGame={stateGame} ship={ships[1]} />
      <CellRow i={2} j={[0,0,0,0,0,0,1,0,0,0]} stateGame={stateGame} ship={ships[2]} />
      <CellRow i={3} j={[0,0,0,1,0,0,0,0,0,0]} stateGame={stateGame} ship={ships[3]} />
      <CellRow i={4} j={[0,0,1,0,0,0,0,1,0,0]} stateGame={stateGame} ship={ships[4]} />
      <CellRow i={5} j={[0,0,0,0,0,0,0,0,0,0]} stateGame={stateGame} ship={ships[5]} />
      <CellRow i={6} j={[0,0,0,0,0,0,0,1,0,0]} stateGame={stateGame} ship={ships[6]} />
      <CellRow i={7} j={[0,0,0,0,0,0,0,0,0,0]} stateGame={stateGame} ship={ships[7]} />
      <CellRow i={8} j={[0,0,0,0,0,0,0,0,0,0]} stateGame={stateGame} ship={ships[8]} />
      <CellRow i={9} j={[0,0,0,0,0,0,0,0,0,0]} stateGame={stateGame} ship={ships[9]} />
    </div>
  );
};

export default Battlefield;
