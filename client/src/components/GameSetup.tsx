import React, { useState } from 'react';

interface GameSetupProps {
  gameCode: string;
  onSetPlayerInfo: (name: string, avatar: string) => void;
  waitingForOpponent: boolean;
}

const AVATARS = ['🐵', '🐱', '🐮', '🦊', '🐺', '🦁', '🐯', '🐨'];

export const GameSetup: React.FC<GameSetupProps> = ({ 
  gameCode, 
  onSetPlayerInfo, 
  waitingForOpponent 
}) => {
  const [playerName, setPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onSetPlayerInfo(playerName.trim(), selectedAvatar);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 
                    flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Game Setup</h2>
          <div className="bg-gray-100 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600 mb-1">Game Code:</p>
            <p className="text-2xl font-bold text-blue-600 tracking-wider">{gameCode}</p>
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 
                         focus:outline-none text-lg"
                maxLength={15}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Avatar
              </label>
              <div className="grid grid-cols-4 gap-3">
                {AVATARS.map((avatar, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`
                      w-12 h-12 text-2xl rounded-xl border-2 transition-all
                      ${selectedAvatar === avatar 
                        ? 'border-blue-500 bg-blue-100 scale-110' 
                        : 'border-gray-300 hover:border-gray-400'
                      }
                    `}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 
                       rounded-xl transform transition-all duration-200 hover:scale-105"
            >
              Ready to Play!
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="text-4xl">{selectedAvatar}</div>
              <div>
                <p className="font-bold text-lg text-gray-800">{playerName}</p>
                <p className="text-green-600">Ready!</p>
              </div>
            </div>

            {waitingForOpponent ? (
              <div className="bg-yellow-100 border-2 border-yellow-300 rounded-lg p-4">
                <p className="text-yellow-800 font-medium">
                  Waiting for opponent to join...
                </p>
                <div className="flex justify-center mt-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
                </div>
              </div>
            ) : (
              <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  Both players ready! Starting game...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
