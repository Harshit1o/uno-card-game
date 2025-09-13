export interface Player {
  id: string;
  name: string;
  avatar: string;
  cards: number[];
  isReady: boolean;
}

export interface GameState {
  id: string;
  players: Player[];
  currentPlayer: number;
  deck: number[];
  lastDiceRoll: number | null;
  phase: 'waiting' | 'setup' | 'playing' | 'ended';
  winner: string | null;
  message: string;
  canRollDice: boolean;
  canDrawCard: boolean;
  selectedCards: number[];
}

export interface SocketEvents {
  // Client to Server
  'create-game': () => void;
  'join-game': (gameCode: string) => void;
  'set-player-info': (info: { name: string; avatar: string }) => void;
  'roll-dice': () => void;
  'select-cards': (cardIndices: number[]) => void;
  'draw-card': () => void;
  'play-again': () => void;

  // Server to Client
  'game-created': (gameCode: string) => void;
  'game-joined': (success: boolean, message?: string) => void;
  'game-state': (gameState: GameState) => void;
  'player-joined': (player: Player) => void;
  'error': (message: string) => void;
}
