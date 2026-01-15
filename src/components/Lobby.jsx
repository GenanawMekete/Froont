import React, { useState } from 'react';

export default function Lobby({ onCreate, onJoin, currentGame }) {
  const [name, setName] = useState('');
  const [gameId, setGameId] = useState('');

  return (
    <div className="lobby">
      <div className="create">
        <h3>Create Game</h3>
        <input placeholder="Game name" value={name} onChange={e=>setName(e.target.value)} />
        <button onClick={()=>onCreate({ name: name || 'Game', stake: 10 })}>Create</button>
      </div>

      <div className="join">
        <h3>Join Game</h3>
        <input placeholder="Game ID" value={gameId} onChange={e=>setGameId(e.target.value)} />
        <input placeholder="Your name" id="join-name" />
        <button onClick={() => {
          const nm = document.getElementById('join-name').value || 'Player';
          onJoin(gameId, nm);
        }}>Join</button>
      </div>

      <div className="current">
        <h4>Current</h4>
        <div>Game ID: {currentGame?._id || '-'}</div>
        <div>Stake: {currentGame?.stake || '-'}</div>
      </div>
    </div>
  );
}
