import React from 'react';
import './Counter.css'
import CounterTab from './CounterTab'

type CounterProps = {
  player1: number,
  player2: number
}

const Counter: React.FC<CounterProps> = ({ player1, player2 }) => {
  return (
    <div className="Counter">
      <CounterTab count={player1} name="player 1" />
      <CounterTab count={player2} name="player 2" />
    </div>
  );
};

export default Counter;
