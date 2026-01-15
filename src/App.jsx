import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Board from './components/Board';
import CalledList from './components/CalledList';

const BACKEND = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function App() {
  const [socket, setSocket] = useState(null);
  const [game, setGame] = useState(null);
  const [board, setBoard] = useState(null);
  const [calls, setCalls] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const s = io(BACKEND);
    setSocket(s);
    s.on('call', (num) => {
      setCalls(prev => [...prev, num]);
    });
    s.on('winner', (data) => {
      setMessage('We have a winner!');
    });
    return () => s.disconnect();
  }, []);

  async function createGame() {
    const res = await fetch(BACKEND + '/api/game', {
      method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ stake: 10 })
    });
    const g = await res.json();
    setGame(g);
    setMessage('Game created. Join to get a board.');
  }

  async function joinGame() {
    if (!game) return setMessage('Create a game first.');
    const name = prompt('Your name?') || 'anon';
    const res = await fetch(`${BACKEND}/api/game/${game._id}/join`, {
      method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ name })
    });
    const body = await res.json();
    setBoard(body.board);
    setMessage('Joined! Board ready.');
    // join socket room
    socket.emit('join-game', { gameId: game._id });
    // set calls from server snapshot
    const state = await (await fetch(`${BACKEND}/api/game/${game._id}/state`)).json();
    if (state.game.calls) setCalls(state.game.calls);
  }

  async function callNext() {
    if (!game) return;
    const res = await fetch(`${BACKEND}/api/game/${game._id}/call`, { method: 'POST' });
    const body = await res.json();
    // server emits 'call' so calls will update through socket
    setMessage('Called: ' + body.pick);
  }

  async function claimBingo() {
    if (!game || !board) return;
    const res = await fetch(`${BACKEND}/api/game/${game._id}/bingo`, {
      method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ boardId: board._id })
    });
    const body = await res.json();
    if (body.ok) {
      setMessage('Bingo! You won (maybe).');
    } else {
      setMessage('Invalid bingo: ' + (body.reason || 'unknown'));
    }
  }

  function onMark(newMarks) {
    // update local board marks (UX only; server-side validation uses server.calls and board.grid)
    setBoard(prev => ({ ...prev, marks: newMarks }));
  }

  return (
    <div className="app">
      <h1>Simple Bingo</h1>
      <div className="controls">
        <button onClick={createGame}>Create Game</button>
        <button onClick={joinGame}>Join Game</button>
        <button onClick={callNext}>Call Next (admin)</button>
        <button onClick={claimBingo} className="bingo">BINGO!</button>
      </div>

      <div className="main">
        <div className="left">
          <CalledList calls={calls} />
        </div>
        <div className="right">
          {board ? <Board grid={board.grid} marks={board.marks} onMark={onMark} /> : <div>No board yet</div>}
        </div>
      </div>

      <div className="message">{message}</div>
    </div>
  );
}
