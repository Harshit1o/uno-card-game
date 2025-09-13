import React from 'react';

interface WelcomeScreenOneProps {
  onContinue: () => void;
}

export const WelcomeScreenOne: React.FC<WelcomeScreenOneProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 
                    flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-12 text-center shadow-2xl max-w-md w-full
                      transform transition-all duration-300 hover:scale-105">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎮 UNO Dice Duel
          </h1>
          <div className="text-6xl mb-6">🎲</div>
          <h2 className="text-2xl font-semibold text-purple-600 mb-2">
            Hello Jyeshtaaaa
          </h2>
          <p className="text-xl text-gray-700 font-medium">
            Let's play!
          </p>
        </div>
        
        <button
          onClick={onContinue}
          className="bg-gradient-to-r from-purple-500 to-blue-500 
                     hover:from-purple-600 hover:to-blue-600
                     text-white font-bold py-4 px-8 rounded-xl text-lg
                     transform transition-all duration-200 
                     hover:scale-105 hover:shadow-lg
                     focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
