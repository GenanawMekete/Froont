import React from 'react';

export default function CountdownTimer({ timer }) {
  return (
    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
      {timer} sec
    </div>
  );
}