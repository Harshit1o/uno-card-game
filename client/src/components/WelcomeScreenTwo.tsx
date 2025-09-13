import React from 'react';

interface WelcomeScreenTwoProps {
  onContinue: () => void;
}

export const WelcomeScreenTwo: React.FC<WelcomeScreenTwoProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-orange-500 
                    flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-12 text-center shadow-2xl max-w-md w-full
                      transform transition-all duration-300 hover:scale-105">
        <div className="mb-8">
          <div className="text-6xl mb-6">😅</div>
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">
            Oops sorry my bad!
          </h2>
          <h1 className="text-3xl font-bold text-orange-600 mb-2">
            Hello Cowiee
          </h1>
          <p className="text-xl text-gray-700 font-medium">
            Let's play!
          </p>
        </div>
        
        <div className="mb-6">
          <div className="text-4xl mb-2">🎯</div>
          <p className="text-sm text-gray-600 italic">
            Ready for some dice action?
          </p>
        </div>
        
        <button
          onClick={onContinue}
          className="bg-gradient-to-r from-pink-500 to-orange-500 
                     hover:from-pink-600 hover:to-orange-600
                     text-white font-bold py-4 px-8 rounded-xl text-lg
                     transform transition-all duration-200 
                     hover:scale-105 hover:shadow-lg
                     focus:outline-none focus:ring-4 focus:ring-pink-300"
        >
          Let's Go!
        </button>
      </div>
    </div>
  );
};
