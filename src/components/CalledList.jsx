import React from 'react';

export default function CalledList({ calls = [] }) {
  // show last 20 calls at top plus grid of 1..75
  const last = calls.slice(-20).reverse();
  return (
    <div className="called-list">
      <h4>Last called</h4>
      <div className="last-row">
        {last.map((c, i) => <div key={i} className="last-item">{c}</div>)}
      </div>

      <h4>All numbers</h4>
      <div className="numbers-grid">
        {Array.from({length:75}, (_,i)=>i+1).map(n => (
          <div key={n} className={`num ${calls.includes(n) ? 'active' : ''}`}>{n}</div>
        ))}
      </div>
    </div>
  );
}