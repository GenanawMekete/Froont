import React from 'react';
export default function CalledList({ calls = [] }) {
  return (
    <div className="called">
      <h3>Called</h3>
      <div className="called-list">
        {calls.map((n, i) => <div className="call" key={i}>{n}</div>)}
      </div>
    </div>
  );
}
