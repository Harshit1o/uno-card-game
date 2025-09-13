import React, { useState } from 'react';

interface HomeScreenProps {
  onCreateGame: () => void;
  onJoinGame: (gameCode: string) => void;
  onReconnect: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onCreateGame, onJoinGame, onReconnect }) => {
  const [gameCode, setGameCode] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameCode.trim()) {
      onJoinGame(gameCode.trim().toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 
                    flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🎲 UNO Dice</h1>
          <p className="text-gray-600">2-Player Online Card Game</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onCreateGame}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 
                     rounded-xl transform transition-all duration-200 hover:scale-105 shadow-lg"
          >
            🎮 Create Game
          </button>

          {!showJoinForm ? (
            <>
              <button
                onClick={() => setShowJoinForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 
                         rounded-xl transform transition-all duration-200 hover:scale-105 shadow-lg"
              >
                🚪 Join Game
              </button>
              
              <button
                onClick={onReconnect}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 
                         rounded-xl transform transition-all duration-200 hover:scale-105 shadow-lg"
              >
                🔌 Reconnect
              </button>
            </>
          ) : (
            <form onSubmit={handleJoinGame} className="space-y-3">
              <input
                type="text"
                placeholder="Enter Game Code"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                className="w-full p-4 border-2 border-gray-300 rounded-xl text-center text-lg font-bold
                         uppercase tracking-wider focus:border-blue-500 focus:outline-none"
                maxLength={6}
              />
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowJoinForm(false);
                    setGameCode('');
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 
                           rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!gameCode.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white 
                           font-bold py-3 px-4 rounded-xl transition-colors"
                >
                  Join
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Match dice rolls with your cards to win!</p>
        </div>
      </div>
    </div>
  );
};
