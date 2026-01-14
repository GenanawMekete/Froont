import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE = 'http://localhost:3000/api';
const SOCKET_URL = 'http://localhost:3000';

export const socket = io(SOCKET_URL);

export async function fetchLobby() {
  const res = await axios.get(`${API_BASE}/lobby`);
  return res.data;
}

export async function joinGame(telegramId, cardId) {
  const res = await axios.post(`${API_BASE}/join`, { telegramId, cardId });
  return res.data;
}

export async function fetchWallet(telegramId) {
  const res = await axios.get(`${API_BASE}/wallet/${telegramId}`);
  return res.data.balance;
}

export async function requestWithdraw(telegramId, amount, method, account) {
  const res = await axios.post(`${API_BASE}/withdraw`, { telegramId, amount, method, account });
  return res.data;
}
