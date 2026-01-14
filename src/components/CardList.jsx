import React from 'react';

export default function CardList({ cards, onSelect }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {cards.map(card => (
        <div key={card.id} onClick={() => onSelect(card.id)}
          style={{
            border: '2px solid black',
            padding: '10px',
            cursor: 'pointer',
            width: '100px',
            textAlign: 'center'
          }}>
          {card.numbers.join(', ')}
        </div>
      ))}
    </div>
  );
}