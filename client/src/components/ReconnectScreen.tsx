import React, { useState } from 'react';

interface ReconnectScreenProps {
  onReconnect: (gameCode: string, playerName: string) => void;
  onBackToHome: () => void;
}

export const ReconnectScreen: React.FC<ReconnectScreenProps> = ({
  onReconnect,
  onBackToHome
}) => {
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameCode.trim() && playerName.trim()) {
      setIsLoading(true);
      onReconnect(gameCode.trim().toUpperCase(), playerName.trim());
      // Reset loading state after a timeout in case reconnection fails
      setTimeout(() => setIsLoading(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 
                    flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🔌 Reconnect</h1>
          <p className="text-gray-600">Rejoin your ongoing game</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Game Code
            </label>
            <input
              type="text"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-digit code"
              className="w-full p-4 border-2 border-gray-300 rounded-xl text-center text-lg font-bold
                       uppercase tracking-wider focus:border-orange-500 focus:outline-none"
              maxLength={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your exact name"
              className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg
                       focus:border-orange-500 focus:outline-none"
              maxLength={15}
              required
            />
          </div>

          <div className="text-sm text-gray-600 bg-gray-100 rounded-lg p-3">
            <p className="mb-1">💡 <strong>Tip:</strong></p>
            <p>Use the same name you entered when you first joined the game.</p>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading || !gameCode.trim() || !playerName.trim()}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 
                       text-white font-bold py-4 px-6 rounded-xl transform 
                       transition-all duration-200 hover:scale-105 disabled:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Reconnecting...</span>
                </div>
              ) : (
                '🔄 Reconnect to Game'
              )}
            </button>

            <button
              type="button"
              onClick={onBackToHome}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 
                       rounded-xl transition-colors"
            >
              🏠 Back to Home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};