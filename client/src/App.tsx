import React from 'react';
import { useSocket } from './hooks/useSocket';
import { useGame } from './hooks/useGame';
import { HomeScreen } from './components/HomeScreen';
import { GameSetup } from './components/GameSetup';
import { GameBoard } from './components/GameBoard';
import { VictoryScreen } from './components/VictoryScreen';

function App() {
  const { socket, isConnected } = useSocket();
  const {
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
  } = useGame(socket);

  const currentPlayer = gameState.players.find(p => p.id === currentPlayerId);
  const opponent = gameState.players.find(p => p.id !== currentPlayerId);

  const handleBackToHome = () => {
    window.location.reload();
  };

  // Show loading screen while connecting
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 
                      flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Connecting to server...</p>
        </div>
      </div>
    );
  }

  // Show home screen if no game code
  if (!gameCode) {
    return <HomeScreen onCreateGame={createGame} onJoinGame={joinGame} />;
  }

  // Show setup screen while waiting for players or during setup
  if (gameState.phase === 'waiting' || gameState.phase === 'setup') {
    return (
      <GameSetup
        gameCode={gameCode}
        onSetPlayerInfo={setPlayerInfo}
        waitingForOpponent={gameState.players.length < 2}
      />
    );
  }

  // Show game board during play
  if (gameState.phase === 'playing') {
    return (
      <GameBoard
        gameState={gameState}
        currentPlayerId={currentPlayerId}
        onRollDice={rollDice}
        onSelectCards={selectCards}
        onDrawCard={drawCard}
      />
    );
  }

  // Show victory screen when game ends
  if (gameState.phase === 'ended' && gameState.winner) {
    const isWinner = currentPlayer?.name === gameState.winner;
    
    return (
      <>
        <GameBoard
          gameState={gameState}
          currentPlayerId={currentPlayerId}
          onRollDice={rollDice}
          onSelectCards={selectCards}
          onDrawCard={drawCard}
        />
        <VictoryScreen
          winner={gameState.winner}
          isWinner={isWinner}
          onPlayAgain={playAgain}
          onBackToHome={handleBackToHome}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 
                    flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">🎮 Game Loading...</h2>
        <p className="text-gray-600">Please wait while the game loads</p>
      </div>
    </div>
  );
}

export default App;
