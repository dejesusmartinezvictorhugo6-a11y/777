
import React, { useState } from 'react';
import { GAMES } from '../../constants';
import { Game, GameCategory } from '../../types';
import GameCard from './GameCard';

interface GameLobbyProps {
  onGameSelect: (game: Game) => void;
  onAnalysisSelect: (game: Game) => void;
}

const GameLobby: React.FC<GameLobbyProps> = ({ onGameSelect, onAnalysisSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory | 'ALL'>('ALL');

  const categories = [GameCategory.SLOTS, GameCategory.TABLE, GameCategory.LIVE, GameCategory.JACKPOTS];

  const filteredGames = selectedCategory === 'ALL'
    ? GAMES
    : GAMES.filter(game => game.category === selectedCategory);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-black text-center text-white mb-2 uppercase">
          Bienvenido al <span className="text-red-500">Infierno</span>
        </h1>
        <p className="text-center text-gray-400 text-lg">Donde el riesgo es alto y las recompensas son eternas.</p>
      </div>

      <div className="flex justify-center flex-wrap gap-2 md:gap-4 p-2 bg-gray-900/50 rounded-md border border-gray-800">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-4 py-2 text-sm font-bold uppercase rounded-md transition-all ${selectedCategory === 'ALL' ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.7)]' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
        >
          Todos
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 text-sm font-bold uppercase rounded-md transition-all ${selectedCategory === category ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.7)]' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredGames.map(game => (
          <GameCard key={game.id} game={game} onPlay={() => onGameSelect(game)} onAnalyze={() => onAnalysisSelect(game)} />
        ))}
      </div>
    </div>
  );
};

export default GameLobby;