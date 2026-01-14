export default function Board({ card }) {
  if (!card) {
    return <div className="waiting">No card selected</div>;
  }

  return (
    <div className="board">
      {card.map((row, r) => (
        <div key={r} className="row">
          {row.map((cell, c) => (
            <div key={c} className="cell large">
              {cell ?? '★'}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}