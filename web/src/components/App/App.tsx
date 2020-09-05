import React from 'react';
import './App.css';
import Scoreboard from '../Counter/Scoreboard'

const App: React.FC = () => {
  return (
    <div className="App">
      <Scoreboard player1={2} player2={3}/>
    </div>
  );
};

export default App;
