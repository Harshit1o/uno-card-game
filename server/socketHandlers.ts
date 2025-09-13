import { Server, Socket } from 'socket.io';
import { GameLogic } from './gameLogic';

const gameLogic = new GameLogic();

// Clean up old rooms every hour
setInterval(() => {
  gameLogic.cleanupOldRooms();
}, 60 * 60 * 1000);

export function setupSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`Player connected: ${socket.id}`);
    
    let currentGameCode: string | null = null;

    socket.on('create-game', () => {
      try {
        const room = gameLogic.createRoom();
        currentGameCode = room.id;
        
        // Join the socket room
        socket.join(currentGameCode);
        
        // Add player to game
        gameLogic.joinRoom(currentGameCode, socket.id);
        
        socket.emit('game-created', currentGameCode);
        
        // Send initial game state
        const gameState = gameLogic.getGameState(currentGameCode);
        io.to(currentGameCode).emit('game-state', gameState);
        
        console.log(`Game created: ${currentGameCode}`);
      } catch (error) {
        console.error('Error creating game:', error);
        socket.emit('error', 'Failed to create game');
      }
    });

    socket.on('join-game', (gameCode: string) => {
      try {
        const room = gameLogic.getRoom(gameCode);
        
        if (!room) {
          socket.emit('game-joined', false, 'Game not found');
          return;
        }
        
        if (room.players.length >= 2) {
          socket.emit('game-joined', false, 'Game is full');
          return;
        }
        
        currentGameCode = gameCode;
        socket.join(currentGameCode);
        
        const joinedRoom = gameLogic.joinRoom(currentGameCode, socket.id);
        
        if (joinedRoom) {
          socket.emit('game-joined', true);
          
          // Send updated game state to all players
          const gameState = gameLogic.getGameState(currentGameCode);
          io.to(currentGameCode).emit('game-state', gameState);
          
          console.log(`Player ${socket.id} joined game: ${currentGameCode}`);
        } else {
          socket.emit('game-joined', false, 'Failed to join game');
        }
      } catch (error) {
        console.error('Error joining game:', error);
        socket.emit('error', 'Failed to join game');
      }
    });

    socket.on('set-player-info', ({ name, avatar }) => {
      if (!currentGameCode) {
        socket.emit('error', 'Not in a game');
        return;
      }
      
      try {
        const success = gameLogic.setPlayerInfo(currentGameCode, socket.id, name, avatar);
        
        if (success) {
          // Send updated game state to all players
          const gameState = gameLogic.getGameState(currentGameCode);
          io.to(currentGameCode).emit('game-state', gameState);
          
          console.log(`Player ${socket.id} set info: ${name} ${avatar}`);
        } else {
          socket.emit('error', 'Failed to set player info');
        }
      } catch (error) {
        console.error('Error setting player info:', error);
        socket.emit('error', 'Failed to set player info');
      }
    });

    socket.on('roll-dice', () => {
      if (!currentGameCode) {
        socket.emit('error', 'Not in a game');
        return;
      }
      
      try {
        const diceValue = gameLogic.rollDice(currentGameCode, socket.id);
        
        if (diceValue !== null) {
          // Send updated game state to all players
          const gameState = gameLogic.getGameState(currentGameCode);
          io.to(currentGameCode).emit('game-state', gameState);
          
          console.log(`Player ${socket.id} rolled: ${diceValue}`);
        } else {
          socket.emit('error', 'Cannot roll dice now');
        }
      } catch (error) {
        console.error('Error rolling dice:', error);
        socket.emit('error', 'Failed to roll dice');
      }
    });

    socket.on('select-cards', (cardIndices: number[]) => {
      if (!currentGameCode) {
        socket.emit('error', 'Not in a game');
        return;
      }
      
      try {
        const success = gameLogic.selectCards(currentGameCode, socket.id, cardIndices);
        
        if (success) {
          // Send updated game state to all players
          const gameState = gameLogic.getGameState(currentGameCode);
          io.to(currentGameCode).emit('game-state', gameState);
          
          console.log(`Player ${socket.id} selected cards:`, cardIndices);
        } else {
          socket.emit('error', 'Invalid card selection');
        }
      } catch (error) {
        console.error('Error selecting cards:', error);
        socket.emit('error', 'Failed to select cards');
      }
    });

    socket.on('draw-card', () => {
      if (!currentGameCode) {
        socket.emit('error', 'Not in a game');
        return;
      }
      
      try {
        const success = gameLogic.drawCard(currentGameCode, socket.id);
        
        if (success) {
          // Send updated game state to all players
          const gameState = gameLogic.getGameState(currentGameCode);
          io.to(currentGameCode).emit('game-state', gameState);
          
          console.log(`Player ${socket.id} drew a card`);
        } else {
          socket.emit('error', 'Cannot draw card now');
        }
      } catch (error) {
        console.error('Error drawing card:', error);
        socket.emit('error', 'Failed to draw card');
      }
    });

    socket.on('reconnect-to-game', ({ gameCode, playerName }: { gameCode: string; playerName: string }) => {
      try {
        const room = gameLogic.getRoom(gameCode);
        
        if (!room) {
          socket.emit('reconnection-result', { success: false, message: 'Game not found' });
          return;
        }
        
        // Check if socket is already in a game room
        if (currentGameCode) {
          socket.emit('reconnection-result', { success: false, message: 'Already connected to a game' });
          return;
        }
        
        // Check if this socket is already a player in this room
        const existingPlayer = room.players.find(p => p.id === socket.id);
        if (existingPlayer) {
          socket.emit('reconnection-result', { success: false, message: 'Socket already in this game' });
          return;
        }
        
        const player = gameLogic.findPlayerByName(gameCode, playerName);
        
        if (!player) {
          socket.emit('reconnection-result', { success: false, message: 'Player not found in this game' });
          return;
        }
        
        // CRITICAL: Only allow reconnection if player is actually disconnected
        if (player.isConnected) {
          socket.emit('reconnection-result', { success: false, message: 'Player is still connected to the game' });
          return;
        }
        
        // Update player's socket ID and connection status
        const oldId = player.id;
        const reconnectedPlayer = gameLogic.reconnectPlayer(gameCode, oldId, socket.id);
        
        if (reconnectedPlayer) {
          currentGameCode = gameCode;
          socket.join(currentGameCode);
          
          socket.emit('reconnection-result', { success: true, message: 'Successfully reconnected' });
          
          // Notify other players that this player reconnected
          socket.to(currentGameCode).emit('player-reconnected', {
            playerName: reconnectedPlayer.name,
            message: `${reconnectedPlayer.name} has reconnected`
          });
          
          // Send current game state
          const gameState = gameLogic.getGameState(currentGameCode);
          io.to(currentGameCode).emit('game-state', gameState);
          
          console.log(`Player ${reconnectedPlayer.name} successfully reconnected to game ${gameCode}`);
        } else {
          socket.emit('reconnection-result', { success: false, message: 'Reconnection failed' });
        }
      } catch (error) {
        console.error('Error handling reconnection:', error);
        socket.emit('reconnection-result', { success: false, message: 'Reconnection failed' });
      }
    });

    socket.on('play-again', () => {
      if (!currentGameCode) {
        socket.emit('error', 'Not in a game');
        return;
      }
      
      try {
        // For now, just notify the other player
        socket.to(currentGameCode).emit('error', 'Opponent wants to play again');
        console.log(`Player ${socket.id} wants to play again`);
      } catch (error) {
        console.error('Error handling play again:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Player disconnected: ${socket.id}`);
      
      if (currentGameCode) {
        // Mark player as disconnected
        gameLogic.handlePlayerDisconnect(currentGameCode, socket.id);
        
        // Notify other players in the room
        socket.to(currentGameCode).emit('player-disconnected', {
          message: 'Your opponent has disconnected. They can reconnect using their name and game code.',
          showReconnectInfo: true
        });
        
        // Send updated game state to remaining players
        const gameState = gameLogic.getGameState(currentGameCode);
        io.to(currentGameCode).emit('game-state', gameState);
      }
    });
  });
}
