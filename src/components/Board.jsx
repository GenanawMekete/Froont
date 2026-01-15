import React, { useState, useEffect } from 'react';

/*
Props:
- grid: 2D array of numbers (null for free)
- called: Set of called numbers
- onMarkChange: function(newMarks)
*/
export default function Board({ grid = [], called = new Set(), onMarkChange = ()=>{} }) {
  const size = grid.length || 5;
  const initMarks = (g) => g.map(row => row.map(cell => cell === null));
  const [marks, setMarks] = useState(() => initMarks(grid));

  useEffect(()=> setMarks(initMarks(grid)), [grid]);

  function toggle(r,c) {
    if (grid[r][c] === null) return;
    const nm = marks.map(row => row.slice());
    nm[r][c] = !nm[r][c];
    setMarks(nm);
    onMarkChange(nm);
  }

  function cellClass(r,c) {
    const isMarked = marks[r][c];
    const val = grid[r][c];
    const calledNow = val !== null && called.has(val);
    return [
      'cell',
      isMarked ? 'marked' : '',
      calledNow ? 'called' : '',
      val === null ? 'free' : ''
    ].join(' ');
  }

  return (
    <div className="board-wrapper">
      <div className="board-grid" role="grid" style={{ gridTemplateColumns: `repeat(${size}, 64px)`}}>
        {grid.map((row, r) => row.map((val, c) => (
          <button
            key={`${r}-${c}`}
            className={cellClass(r,c)}
            onClick={() => toggle(r,c)}
            aria-label={`cell ${r}-${c}`}
          >
            {val === null ? '★' : val}
          </button>
        )))}
      </div>
    </div>
  );
}
