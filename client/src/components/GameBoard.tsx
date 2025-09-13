import React, { useState, useEffect } from 'react';
import { GameState } from '../types/game';
import { Card, CardBack } from './Card';
import { Dice } from './Dice';
import { useAudio } from '../lib/stores/useAudio';

interface GameBoardProps {
  gameState: GameState;
  currentPlayerId: string;
  onRollDice: () => void;
  onSelectCards: (cardIndices: number[]) => void;
  onDrawCard: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  currentPlayerId,
  onRollDice,
  onSelectCards,
  onDrawCard
}) => {
  const [selectedCardIndices, setSelectedCardIndices] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const { playCardPlay } = useAudio();

  const currentPlayer = gameState.players.find(p => p.id === currentPlayerId);
  const opponent = gameState.players.find(p => p.id !== currentPlayerId);
  const isMyTurn = gameState.players[gameState.currentPlayer]?.id === currentPlayerId;

  // Reset selected cards when it's not my turn or after dice roll
  useEffect(() => {
    if (!isMyTurn) {
      setSelectedCardIndices([]);
    }
  }, [isMyTurn, gameState.lastDiceRoll]);

  // Handle dice roll animation
  useEffect(() => {
    if (gameState.lastDiceRoll && isMyTurn) {
      setIsRolling(true);
      setTimeout(() => setIsRolling(false), 1000);
    }
  }, [gameState.lastDiceRoll, isMyTurn]);

  const handleCardClick = (cardIndex: number) => {
    if (!isMyTurn || !gameState.lastDiceRoll) return;

    setSelectedCardIndices(prev => {
      const newSelected = prev.includes(cardIndex)
        ? prev.filter(i => i !== cardIndex)
        : [...prev, cardIndex];
      
      return newSelected;
    });
  };

  const handlePlayCards = () => {
    if (selectedCardIndices.length > 0) {
      playCardPlay();
      onSelectCards(selectedCardIndices);
      setSelectedCardIndices([]);
    }
  };

  const getSelectedCardsSum = () => {
    if (!currentPlayer) return 0;
    return selectedCardIndices.reduce((sum, index) => {
      return sum + currentPlayer.cards[index];
    }, 0);
  };

  const canPlaySelectedCards = () => {
    const sum = getSelectedCardsSum();
    return sum === gameState.lastDiceRoll;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Opponent Section */}
        <div className="mb-6">
          <div className="bg-white bg-opacity-90 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{opponent?.avatar}</span>
                <div>
                  <h3 className="font-bold text-lg">{opponent?.name || 'Waiting...'}</h3>
                  <p className="text-sm text-gray-600">
                    {opponent?.cards.length || 0} cards remaining
                  </p>
                </div>
              </div>
              {!isMyTurn && (
                <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                  Their Turn
                </div>
              )}
            </div>
            
            <div className="flex justify-center space-x-1">
              {opponent && Array.from({ length: opponent.cards.length }, (_, i) => (
                <CardBack key={i} className="scale-75" />
              ))}
            </div>
          </div>
        </div>

        {/* Game Center */}
        <div className="bg-white bg-opacity-95 rounded-2xl p-6 shadow-2xl mb-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">🎲 UNO Dice Game</h2>
            <p className="text-lg text-gray-600">{gameState.message}</p>
          </div>

          <div className="flex justify-center items-center space-x-8 mb-6">
            <Dice
              value={gameState.lastDiceRoll}
              isRolling={isRolling}
              onRoll={onRollDice}
              canRoll={isMyTurn && gameState.canRollDice}
            />

            {gameState.lastDiceRoll && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Target Sum:</p>
                <p className="text-3xl font-bold text-blue-600">{gameState.lastDiceRoll}</p>
                {selectedCardIndices.length > 0 && (
                  <p className="text-lg mt-2">
                    Selected: <span className={`font-bold ${canPlaySelectedCards() ? 'text-green-600' : 'text-red-600'}`}>
                      {getSelectedCardsSum()}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {isMyTurn && gameState.lastDiceRoll && (
            <div className="flex justify-center space-x-4 mb-4">
              {selectedCardIndices.length > 0 && (
                <button
                  onClick={handlePlayCards}
                  disabled={!canPlaySelectedCards()}
                  className={`
                    px-6 py-2 font-bold rounded-lg transition-all
                    ${canPlaySelectedCards()
                      ? 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-105'
                      : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    }
                  `}
                >
                  Play Cards ({getSelectedCardsSum()})
                </button>
              )}
              
              {gameState.canDrawCard && (
                <button
                  onClick={onDrawCard}
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold 
                           rounded-lg transform transition-all hover:scale-105"
                >
                  Draw Card
                </button>
              )}
            </div>
          )}
        </div>

        {/* Current Player Section */}
        <div className="bg-white bg-opacity-90 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{currentPlayer?.avatar}</span>
              <div>
                <h3 className="font-bold text-lg">{currentPlayer?.name || 'You'}</h3>
                <p className="text-sm text-gray-600">
                  {currentPlayer?.cards.length || 0} cards remaining
                </p>
              </div>
            </div>
            {isMyTurn && (
              <div className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-bold">
                Your Turn
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-2 overflow-x-auto pb-2">
            {currentPlayer?.cards.map((cardNumber, index) => (
              <Card
                key={index}
                number={cardNumber}
                isSelected={selectedCardIndices.includes(index)}
                isClickable={isMyTurn && gameState.lastDiceRoll !== null}
                onClick={() => handleCardClick(index)}
                className="flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
