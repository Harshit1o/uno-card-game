export interface Player {
  id: string;
  name: string;
  avatar: string;
  cards: number[];
  isReady: boolean;
  isConnected: boolean;
  lastSeen: Date;
}

export interface GameRoom {
  id: string;
  players: Player[];
  currentPlayer: number;
  deck: number[];
  lastDiceRoll: number | null;
  phase: 'waiting' | 'setup' | 'playing' | 'ended';
  winner: string | null;
  createdAt: Date;
}

export class GameLogic {
  private rooms: Map<string, GameRoom> = new Map();

  generateGameCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  createRoom(): GameRoom {
    const gameCode = this.generateGameCode();
    const room: GameRoom = {
      id: gameCode,
      players: [],
      currentPlayer: 0,
      deck: [],
      lastDiceRoll: null,
      phase: 'waiting',
      winner: null,
      createdAt: new Date()
    };
    
    this.rooms.set(gameCode, room);
    return room;
  }

  getRoom(gameCode: string): GameRoom | undefined {
    return this.rooms.get(gameCode);
  }

  joinRoom(gameCode: string, playerId: string): GameRoom | null {
    const room = this.rooms.get(gameCode);
    if (!room || room.players.length >= 2) {
      return null;
    }

    // Check if player already in room
    if (room.players.some(p => p.id === playerId)) {
      return room;
    }

    room.players.push({
      id: playerId,
      name: '',
      avatar: '',
      cards: [],
      isReady: false,
      isConnected: true,
      lastSeen: new Date()
    });

    return room;
  }

  setPlayerInfo(gameCode: string, playerId: string, name: string, avatar: string): boolean {
    const room = this.rooms.get(gameCode);
    if (!room) return false;

    const player = room.players.find(p => p.id === playerId);
    if (!player) return false;

    player.name = name;
    player.avatar = avatar;
    player.isReady = true;

    // If both players are ready, start the game
    if (room.players.length === 2 && room.players.every(p => p.isReady)) {
      this.startGame(gameCode);
    }

    return true;
  }

  private startGame(gameCode: string): void {
    const room = this.rooms.get(gameCode);
    if (!room) return;

    // Create deck with numbers 1-6
    const fullDeck: number[] = [];
    for (let i = 1; i <= 6; i++) {
      // Add multiple copies of each number to ensure enough cards
      fullDeck.push(i, i, i, i);
    }

    // Shuffle deck
    this.shuffleDeck(fullDeck);
    room.deck = fullDeck;

    // Deal 6 cards to each player
    room.players.forEach(player => {
      player.cards = [];
      for (let i = 0; i < 6; i++) {
        if (room.deck.length > 0) {
          player.cards.push(room.deck.pop()!);
        }
      }
      player.cards.sort((a, b) => a - b);
    });

    room.phase = 'playing';
    room.currentPlayer = Math.floor(Math.random() * 2); // Random starting player
  }

  private shuffleDeck(deck: number[]): void {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  rollDice(gameCode: string, playerId: string): number | null {
    const room = this.rooms.get(gameCode);
    if (!room || room.phase !== 'playing') return null;

    const currentPlayer = room.players[room.currentPlayer];
    if (currentPlayer.id !== playerId) return null;

    const diceValue = Math.floor(Math.random() * 6) + 1;
    room.lastDiceRoll = diceValue;
    
    return diceValue;
  }

  selectCards(gameCode: string, playerId: string, cardIndices: number[]): boolean {
    const room = this.rooms.get(gameCode);
    if (!room || room.phase !== 'playing' || !room.lastDiceRoll) return false;

    const currentPlayer = room.players[room.currentPlayer];
    if (currentPlayer.id !== playerId) return false;

    // Validate card indices
    if (cardIndices.some(index => index < 0 || index >= currentPlayer.cards.length)) {
      return false;
    }

    // Calculate sum of selected cards
    const selectedCards = cardIndices.map(index => currentPlayer.cards[index]);
    const sum = selectedCards.reduce((total, card) => total + card, 0);

    // Check if sum matches dice roll
    if (sum !== room.lastDiceRoll) return false;

    // Remove cards (sort indices in descending order to maintain correct indices)
    const sortedIndices = [...cardIndices].sort((a, b) => b - a);
    sortedIndices.forEach(index => {
      currentPlayer.cards.splice(index, 1);
    });

    // Check for win condition
    if (currentPlayer.cards.length === 0) {
      room.winner = currentPlayer.name;
      room.phase = 'ended';
      return true;
    }

    // Next turn
    this.nextTurn(room);
    return true;
  }

  drawCard(gameCode: string, playerId: string): boolean {
    const room = this.rooms.get(gameCode);
    if (!room || room.phase !== 'playing') return false;

    const currentPlayer = room.players[room.currentPlayer];
    if (currentPlayer.id !== playerId) return false;

    // Draw a card if deck is not empty
    if (room.deck.length > 0) {
      const newCard = room.deck.pop()!;
      currentPlayer.cards.push(newCard);
      currentPlayer.cards.sort((a, b) => a - b);
    }

    // Next turn
    this.nextTurn(room);
    return true;
  }

  private nextTurn(room: GameRoom): void {
    room.currentPlayer = (room.currentPlayer + 1) % room.players.length;
    room.lastDiceRoll = null;
  }

  canPlayCards(gameCode: string, playerId: string): boolean {
    const room = this.rooms.get(gameCode);
    if (!room || room.phase !== 'playing' || !room.lastDiceRoll) return false;

    const player = room.players.find(p => p.id === playerId);
    if (!player) return false;

    // Check if any combination of cards can sum to the dice roll
    return this.hasValidCombination(player.cards, room.lastDiceRoll);
  }

  private hasValidCombination(cards: number[], target: number): boolean {
    // Use dynamic programming to check if any subset sums to target
    const dp: boolean[] = new Array(target + 1).fill(false);
    dp[0] = true;

    for (const card of cards) {
      for (let sum = target; sum >= card; sum--) {
        if (dp[sum - card]) {
          dp[sum] = true;
        }
      }
    }

    return dp[target];
  }

  getGameState(gameCode: string): any {
    const room = this.rooms.get(gameCode);
    if (!room) return null;

    const currentPlayer = room.players[room.currentPlayer];
    let message = '';

    switch (room.phase) {
      case 'waiting':
        message = 'Waiting for players to join...';
        break;
      case 'setup':
        message = 'Setting up game...';
        break;
      case 'playing':
        if (room.lastDiceRoll) {
          message = `${currentPlayer?.name || 'Current player'}'s turn - Dice rolled: ${room.lastDiceRoll}`;
        } else {
          message = `${currentPlayer?.name || 'Current player'}'s turn - Roll the dice!`;
        }
        break;
      case 'ended':
        message = `${room.winner} wins!`;
        break;
    }

    return {
      id: room.id,
      players: room.players,
      currentPlayer: room.currentPlayer,
      deck: [], // Don't send full deck to clients
      lastDiceRoll: room.lastDiceRoll,
      phase: room.phase,
      winner: room.winner,
      message,
      canRollDice: room.phase === 'playing' && !room.lastDiceRoll,
      canDrawCard: room.phase === 'playing' && room.lastDiceRoll !== null,
      selectedCards: []
    };
  }

  removeRoom(gameCode: string): void {
    this.rooms.delete(gameCode);
  }

  // Handle player disconnection
  handlePlayerDisconnect(gameCode: string, playerId: string): void {
    const room = this.rooms.get(gameCode);
    if (!room) return;

    const player = room.players.find(p => p.id === playerId);
    if (player) {
      player.isConnected = false;
      player.lastSeen = new Date();
      console.log(`Player ${player.name || playerId} disconnected from game ${gameCode}`);
    }
  }

  // Handle player reconnection
  reconnectPlayer(gameCode: string, oldPlayerId: string, newSocketId: string): Player | null {
    const room = this.rooms.get(gameCode);
    if (!room) return null;

    // Find player by old ID or by name if available
    let player = room.players.find(p => p.id === oldPlayerId);
    
    if (!player) {
      return null;
    }

    // Update the player's socket ID and connection status
    player.id = newSocketId;
    player.isConnected = true;
    player.lastSeen = new Date();
    
    console.log(`Player ${player.name || oldPlayerId} reconnected to game ${gameCode} with new socket ${newSocketId}`);
    return player;
  }

  // Find player by name for reconnection
  findPlayerByName(gameCode: string, playerName: string): Player | null {
    const room = this.rooms.get(gameCode);
    if (!room) return null;

    return room.players.find(p => p.name === playerName) || null;
  }

  // Update player connection status
  updatePlayerConnection(gameCode: string, playerId: string, isConnected: boolean): void {
    const room = this.rooms.get(gameCode);
    if (!room) return;

    const player = room.players.find(p => p.id === playerId);
    if (player) {
      player.isConnected = isConnected;
      player.lastSeen = new Date();
    }
  }

  // Clean up old rooms (called periodically)
  cleanupOldRooms(): void {
    const now = new Date();
    const maxAge = 2 * 60 * 60 * 1000; // 2 hours

    for (const [gameCode, room] of Array.from(this.rooms.entries())) {
      if (now.getTime() - room.createdAt.getTime() > maxAge) {
        this.rooms.delete(gameCode);
      }
    }
  }
}
