import React from 'react';
import './App.css';
import Counter from '../Counter/Counter'

const App: React.FC = () => {
  return (
    <div className="App">
      <Counter player1={2} player2={3}/>
    </div>
  );
};

export default App;
