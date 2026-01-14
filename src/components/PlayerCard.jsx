import React from 'react';

export default function PlayerCard({ boardId, grid = [], selected = false, onSelect = () => {} }) {
  return (
    <div className={`player-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="pc-id">#{boardId.slice(0,6)}</div>
      <div className="pc-grid">
        {grid.map((row, r) => row.map((val, c) => (
          <div key={`${r}-${c}`} className={`pc-cell ${val === null ? 'free' : ''}`}>
            {val === null ? '★' : val}
          </div>
        )))}
      </div>
    </div>
  );
}