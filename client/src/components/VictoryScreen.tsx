import React from 'react';

interface VictoryScreenProps {
  winner: string;
  isWinner: boolean;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  winner,
  isWinner,
  onPlayAgain,
  onBackToHome
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`
        bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center
        ${isWinner ? 'border-4 border-yellow-400' : 'border-4 border-gray-300'}
      `}>
        <div className="mb-6">
          <div className="text-6xl mb-4">
            {isWinner ? '🎉' : '😔'}
          </div>
          <h2 className={`
            text-3xl font-bold mb-2
            ${isWinner ? 'text-yellow-600' : 'text-gray-600'}
          `}>
            {isWinner ? 'Victory!' : 'Game Over'}
          </h2>
          <p className="text-lg text-gray-700">
            {isWinner ? 'Congratulations! You won!' : `${winner} wins!`}
          </p>
        </div>

        {isWinner && (
          <div className="mb-6">
            <div className="bg-yellow-100 border-2 border-yellow-300 rounded-lg p-4">
              <p className="text-yellow-800 font-medium">
                🏆 You successfully removed all your cards!
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={onPlayAgain}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 
                     rounded-xl transform transition-all duration-200 hover:scale-105"
          >
            🔄 Play Again
          </button>
          <button
            onClick={onBackToHome}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 
                     rounded-xl transform transition-all duration-200 hover:scale-105"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
