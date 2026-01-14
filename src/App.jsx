import React, { useEffect, useState } from 'react';
import CountdownTimer from './components/CountdownTimer';
import CardList from './components/CardList';
import GameBoard from './components/GameBoard';
import { fetchLobby, joinGame, socket, fetchWallet } from './services/api';

export default function App() {
  const tg = window.Telegram?.WebApp;
  tg?.ready();

  const telegramUser = tg?.initDataUnsafe?.user;
  const TELEGRAM_ID = telegramUser?.id;

  const [timer, setTimer] = useState(30);
  const [cards, setCards] = useState([]);
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [balance, setBalance] = useState(0);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (!TELEGRAM_ID) return;

    fetchLobby().then(data => {
      setCards(data.cards);
      setTimer(data.timer);
    });

    fetchWallet(TELEGRAM_ID).then(setBalance);
  }, [TELEGRAM_ID]);

  useEffect(() => {
    socket.on('lobby:update', setTimer);

    socket.on('round:reset', data => {
      setCards(data.cards);
      setTimer(data.timer);
      setCalledNumbers([]);
      setJoined(false);
    });

    socket.on('number:draw', num => {
      setCalledNumbers(prev => [...prev, num]);
    });

    socket.on('game:winner', id => {
      if (id === TELEGRAM_ID) {
        alert('🎉 YOU WON!');
      }
    });

    return () => socket.off();
  }, [TELEGRAM_ID]);

  const handleJoin = async (cardId) => {
    try {
      await joinGame(TELEGRAM_ID, cardId);
      setJoined(true);
      setBalance(prev => prev - 10);
    } catch (err) {
      alert(err.response?.data?.error || 'Join failed');
    }
  };

  const handleDeposit = () => {
    tg.sendData(JSON.stringify({ action: 'deposit' }));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🎮 Bingo Game</h2>

      <div style={{ marginBottom: 10 }}>
        💰 Wallet: <b>{balance} ETB</b>
        <button onClick={handleDeposit} style={{ marginLeft: 10 }}>
          Deposit
        </button>
      </div>

      <CountdownTimer timer={timer} />

      <h3>Select a Card</h3>
      <CardList cards={cards} onSelect={handleJoin} />

      <GameBoard calledNumbers={calledNumbers} />
    </div>
  );
}