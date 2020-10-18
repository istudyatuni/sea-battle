import React from 'react';
import './Scoreboard.css'
import CounterTab from './CounterTab'

import { getString } from '../Translation/String'

type ScoreboardProps = {
  player1: number,
  player2: number
}

const Scoreboard: React.FC<ScoreboardProps> = ({ player1, player2 }) => {
  return (
    <div className="Scoreboard">
      <CounterTab count={player1} name={getString('player') + ' 1'} />
      <CounterTab count={player2} name={getString('player') + ' 2'} />
    </div>
  );
};

export default Scoreboard;
