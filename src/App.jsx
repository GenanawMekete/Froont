import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Lobby from './components/Lobby';
import Board from './components/Board';
import CalledList from './components/CalledList';
import Sidebar from './components/Sidebar';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const SOCKET = import.meta.env.VITE_SOCKET_URL || API;

export default function App() {
  const [socket, setSocket] = useState(null);
  const [game, setGame] = useState(null);
  const [board, setBoard] = useState(null);
  const [calls, setCalls] = useState([]);
  const [playersCount, setPlayersCount] = useState(0);
  const [message, setMessage] = useState('');
  const [isTelegram, setIsTelegram] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Telegram WebApp detection
    if (window.Telegram && window.Telegram.WebApp) {
      setIsTelegram(true);
    }
  }, []);

  useEffect(() => {
    const s = io(SOCKET, { transports: ['websocket'] });
    setSocket(s);
    socketRef.current = s;

    s.on('call', ({ pick, calls: newCalls }) => {
      setCalls(newCalls || (prev => [...prev, pick]));
    });
    s.on('player-joined', (data) => {
      setPlayersCount(prev => prev + 1);
    });
    s.on('winner', (data) => {
      setMessage(`Winner! Board ${data.boardId} — pattern: ${data.pattern}`);
    });
    s.on('game-updated', (g) => setGame(g));
    s.on('connect', () => console.log('socket connect', s.id));

    return () => {
      s.disconnect();
    };
  }, []);

  async function createGame({ name, stake }) {
    try {
      const res = await fetch(`${API}/api/game/create`, {
        method: 'POST',
        headers: {'content-type':'application/json'},
        body: JSON.stringify({ name, config: { stake } })
      });
      const g = await res.json();
      setGame(g);
      setCalls([]);
      setBoard(null);
      setMessage('Game created — Join to get a board.');
    } catch (e) {
      setMessage('Create failed: ' + e.message);
    }
  }

  async function joinGame(gameId, displayName) {
    try {
      const res = await fetch(`${API}/api/game/${gameId}/join`, {
        method: 'POST',
        headers: {'content-type':'application/json'},
        body: JSON.stringify({ user: { displayName } })
      });
      const body = await res.json();
      if (body?.board) {
        setBoard(body.board);
        setGame(prev => ({ ...(prev||{}), _id: gameId }));
        setMessage('Joined — welcome!');
        // join socket room
        socketRef.current?.emit('join-game', { gameId });
        // fetch game state to load calls
        const state = await (await fetch(`${API}/api/game/${gameId}/state`)).json();
        if (state?.calls) setCalls(state.calls);
        if (state?.players) setPlayersCount(state.players.length || 1);
      } else {
        setMessage('Join error');
      }
    } catch (e) {
      setMessage('Join failed: ' + e.message);
    }
  }

  async function callNextAsAdmin() {
    if (!game?._id) return setMessage('No game selected');
    try {
      const res = await fetch(`${API}/api/admin/${game._id}/call`, {
        method: 'POST',
        headers: { 'x-admin-secret': import.meta.env.VITE_ADMIN_SECRET }
      });
      const b = await res.json();
      if (b.pick) setMessage('Called ' + b.pick);
    } catch (e) {
      setMessage('Call error: '+ e.message);
    }
  }

  async function claimBingo(boardId) {
    if (!game?._id) return setMessage('No game');
    try {
      const res = await fetch(`${API}/api/game/${game._id}/claim`, {
        method: 'POST',
        headers: {'content-type':'application/json'},
        body: JSON.stringify({ boardId, userId: board?.owner })
      });
      const body = await res.json();
      if (body.ok) setMessage('Bingo confirmed! pattern: ' + body.pattern);
      else setMessage('Bingo rejected: ' + (body.reason || 'invalid'));
    } catch (e) {
      setMessage('Claim error: ' + e.message);
    }
  }

  return (
    <div className="app-root">
      <header className="topbar">
        <div className="title">Geez Bingo</div>
        <div className="info">
          <div className="box">Players <div className="val">{playersCount}</div></div>
          <div className="box">Calls <div className="val">{calls.length}</div></div>
        </div>
      </header>

      <main className="container">
        <aside className="left-column">
          <CalledList calls={calls} onClickNumber={(n)=>setMessage('Clicked ' + n)} />
        </aside>

        <section className="center">
          <Lobby onCreate={createGame} onJoin={(id, name) => joinGame(id, name)} currentGame={game} />
          <div className="game-area">
            {board ? (
              <>
                <Board grid={board.grid} called={new Set(calls)} onMarkChange={() => {}} />
                <div className="controls">
                  <button className="call-admin" onClick={callNextAsAdmin}>Admin Call</button>
                  <button className="bingo" onClick={() => claimBingo(board._id)}>BINGO!</button>
                </div>
              </>
            ) : (
              <div className="no-board">No board yet — create or join a game.</div>
            )}
          </div>
        </section>

        <aside className="right-column">
          <Sidebar game={game} calls={calls} message={message} />
        </aside>
      </main>

      <footer className="footer">Built with ❤️ — connect the backend engine & set VITE_API_URL</footer>
    </div>
  );
}
