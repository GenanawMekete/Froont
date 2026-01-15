import React from 'react';

export default function Sidebar({ game, calls, message }) {
  return (
    <div className="sidebar">
      <div className="card">
        <h4>Game</h4>
        <div>Id: <b>{game?._id || '-'}</b></div>
        <div>Status: <b>{game?.status || '-'}</b></div>
        <div>Calls: <b>{calls.length}</b></div>
      </div>

      <div className="card">
        <h4>Messages</h4>
        <div className="message">{message || 'No messages'}</div>
      </div>

      <div className="card">
        <h4>Help</h4>
        <p>Press <b>BINGO!</b> to claim and the server will validate your board.</p>
      </div>
    </div>
  );
}
