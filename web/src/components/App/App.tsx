import React from 'react';
import './App.css';
import Scoreboard from '../Counter/Scoreboard'
import Shipsboard from '../Ships/Shipsboard'
import Battlefield from '../Battlefield/Battlefield'

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="inline-board">
        <Scoreboard player1={2} player2={3}/>
        <Shipsboard/>
      </div>
      <div className="inline-field">
        <Battlefield/>
      </div>
    </div>
  );
};

export default App;
