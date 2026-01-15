import React, { useState, useEffect } from 'react';

export default function Board({ grid = [], marks = [], onMark = ()=>{} }) {
  const [localMarks, setLocalMarks] = useState(marks);

  useEffect(()=> setLocalMarks(marks), [marks]);

  function toggle(r,c){
    const nm = localMarks.map(row => row.slice());
    nm[r][c] = !nm[r][c];
    setLocalMarks(nm);
    onMark(nm);
  }

  return (
    <div className="board">
      {grid.map((row, r) => (
        <div key={r} className="board-row">
          {row.map((val, c) => {
            const isFree = val === null;
            return (
              <button
                key={c}
                className={`cell ${localMarks[r][c] ? 'marked' : ''} ${isFree ? 'free' : ''}`}
                onClick={() => !isFree && toggle(r,c)}
                disabled={isFree}
              >
                {isFree ? '★' : val}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
