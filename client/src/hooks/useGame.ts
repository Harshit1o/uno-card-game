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
    });

    socket.on('error', (message) => {
      alert(`Error: ${message}`);
    });

    return () => {
      socket.off('game-created');
      socket.off('game-joined');
      socket.off('game-state');
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

  const playAgain = () => {
    socket?.emit('play-again');
  };

  return {
    gameState,
    gameCode,
    currentPlayerId,
    createGame,
    joinGame,
    setPlayerInfo,
    rollDice,
    selectCards,
    drawCard,
    playAgain
  };
};
