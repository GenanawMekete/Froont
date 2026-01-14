import React, { useState } from 'react';

export default function Lobby({ onJoin, onCreate, currentPlayer }) {
  const [name, setName] = useState('');
  const [cards, setCards] = useState(1);

  return (
    <div className="lobby">
      <h3>Lobby</h3>

      <div style={{marginBottom:8}}>
        <input placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
      </div>

      <div style={{marginBottom:8}}>
        <label>Cards: </label>
        <input type="number" min="1" max="10" value={cards} onChange={e=>setCards(Number(e.target.value))} />
      </div>

      <div style={{display:'flex', gap:8}}>
        <button onClick={() => onJoin(name || 'Player', cards)}>Join Game</button>
        <button onClick={() => onCreate()}>Start Round</button>
      </div>

      <div style={{marginTop:12}}>
        <strong>Signed in:</strong> {currentPlayer ? currentPlayer.name : 'No'}
      </div>
    </div>
  );
}