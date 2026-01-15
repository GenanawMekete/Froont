import React from 'react';

export default function CalledList({ calls = [], onClickNumber = ()=>{} }) {
  return (
    <div className="called-panel">
      <div className="called-header">
        <div className="dot"></div>
        <h3>Called Numbers</h3>
      </div>
      <div className="called-grid">
        {Array.from({length:75}, (_,i)=>i+1).map(n => {
          const called = calls.includes(n);
          return (
            <div key={n} className={`called-num ${called ? 'active' : ''}`} onClick={()=>onClickNumber(n)}>
              {n}
            </div>
          );
        })}
      </div>
    </div>
  );
}
