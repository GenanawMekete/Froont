export default function CardPicker({ cards, selected, onSelect }) {
  return (
    <div className="card-list">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`card ${selected === card ? 'selected' : ''}`}
          onClick={() => onSelect(card)}
        >
          {card.map((row, r) => (
            <div key={r} className="row">
              {row.map((cell, c) => (
                <div key={c} className="cell">
                  {cell ?? '★'}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}