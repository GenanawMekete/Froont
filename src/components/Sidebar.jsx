import React from 'react';

export default function Sidebar({ state, messages = [] }) {
  return (
    <div className="sidebar">
      <div className="card">
        <h4>Game</h4>
        <div>Status: <b>{state?.roundActive ? 'Running' : 'Stopped'}</b></div>
        <div>Calls: <b>{state?.calls?.length || 0}</b></div>
        <div>Remaining: <b>{state?.remainingCount ?? '-'}</b></div>
      </div>

      <div className="card">
        <h4>Messages</h4>
        <div className="msgs">
          {messages.map((m,i) => <div key={i} className="msg">{m}</div>)}
        </div>
      </div>
    </div>
  );
}