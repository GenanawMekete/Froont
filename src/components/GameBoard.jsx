import React from 'react';

export default function GameBoard({ calledNumbers }) {
  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>Called Numbers:</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
        {calledNumbers.map((num, idx) => (
          <div key={idx} style={{
            width: '30px',
            height: '30px',
            backgroundColor: '#4caf50',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px'
          }}>
            {num}
          </div>
        ))}
      </div>
    </div>
  );
}