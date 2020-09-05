import React from 'react';

type CounterProps = {
  player1: number,
  player2: number
}

const Counter: React.FC<CounterProps> = ({ player1, player2 }) => {
  return (
    <div className="Counter">
      <p>Hello</p>
      <div><p>{ player1 }</p></div>
    </div>
  );
};

export default Counter;
