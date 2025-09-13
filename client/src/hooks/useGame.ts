import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { GameState, Player, SocketEvents } from '../types/game';

const initialGameState: GameState = {
  id: '',
  players: [],
  currentPlayer: 0,
  deck: [],
  lastDiceRoll: null,
  phase: 'waiting',
  winner: null,
  message: 'Waiting for game to start...',
  canRollDice: false,
  canDrawCard: false,
  selectedCards: []
};

export const useGame = (socket: Socket<SocketEvents> | null) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [gameCode, setGameCode] = useState<string>('');
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');
  const [disconnectMessage, setDisconnectMessage] = useState<string>('');
  const [reconnectMessage, setReconnectMessage] = useState<string>('');

  useEffect(() => {
    if (!socket) return;

    // Store the socket ID as current player ID
    setCurrentPlayerId(socket.id || '');

    socket.on('game-created', (code) => {
      setGameCode(code);
    });

    socket.on('game-joined', (success, message) => {
      if (!success && message) {
        alert(message);
      }
    });

    socket.on('game-state', (newGameState) => {
      setGameState(newGameState);
      // Set game code from game state to handle reconnection navigation
      if (newGameState.id && !gameCode) {
        setGameCode(newGameState.id);
      }
    });

    socket.on('player-disconnected', ({ message }) => {
      setDisconnectMessage(message);
      setTimeout(() => setDisconnectMessage(''), 5000);
    });

    socket.on('player-reconnected', ({ message }) => {
      setReconnectMessage(message);
      setTimeout(() => setReconnectMessage(''), 3000);
    });

    socket.on('reconnection-result', ({ success, message }) => {
      if (success) {
        // Update current player ID with new socket ID
        setCurrentPlayerId(socket.id || '');
        setReconnectMessage(message);
        setTimeout(() => setReconnectMessage(''), 3000);
      } else {
        alert(`Reconnection failed: ${message}`);
      }
    });

    // Update current player ID when socket reconnects
    socket.on('connect', () => {
      setCurrentPlayerId(socket.id || '');
    });

    socket.on('error', (message) => {
      alert(`Error: ${message}`);
    });

    return () => {
      socket.off('game-created');
      socket.off('game-joined');
      socket.off('game-state');
      socket.off('player-disconnected');
      socket.off('player-reconnected');
      socket.off('reconnection-result');
      socket.off('error');
    };
  }, [socket]);

  const createGame = () => {
    socket?.emit('create-game');
  };

  const joinGame = (code: string) => {
    setGameCode(code);
    socket?.emit('join-game', code);
  };

  const setPlayerInfo = (name: string, avatar: string) => {
    socket?.emit('set-player-info', { name, avatar });
  };

  const rollDice = () => {
    socket?.emit('roll-dice');
  };

  const selectCards = (cardIndices: number[]) => {
    socket?.emit('select-cards', cardIndices);
  };

  const drawCard = () => {
    socket?.emit('draw-card');
  };

  const reconnectToGame = (gameCodeInput: string, playerName: string) => {
    socket?.emit('reconnect-to-game', { gameCode: gameCodeInput, playerName });
  };

  const playAgain = () => {
    socket?.emit('play-again');
  };

  return {
    gameState,
    gameCode,
    currentPlayerId,
    disconnectMessage,
    reconnectMessage,
    createGame,
    joinGame,
    setPlayerInfo,
    rollDice,
    selectCards,
    drawCard,
    reconnectToGame,
    playAgain
  };
};
