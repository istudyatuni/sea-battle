import React from 'react';
import './Scoreboard.css'
import CounterTab from './CounterTab'

type ScoreboardProps = {
  player1: number,
  player2: number
}

const Scoreboard: React.FC<ScoreboardProps> = ({ player1, player2 }) => {
  return (
    <div className="Scoreboard">
      <CounterTab count={player1} name="Player 1" />
      <CounterTab count={player2} name="Player 2" />
    </div>
  );
};

export default Scoreboard;
