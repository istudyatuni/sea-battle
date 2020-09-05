import React from 'react';
import './Counter.css'

type CounterProps = {
  count: number,
  name: string
}

const CounterTab: React.FC<CounterProps> = ({ count, name }) => {
  return (
    <div className="CounterTab">
      <p>{count}</p>
      <p>{name}</p>
    </div>
  );
};

export default CounterTab;
