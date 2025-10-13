
import React from 'react';
import { Game } from '../../types';
import { AIIcon } from '../cashier/ui/Icons';

interface GameCardProps {
  game: Game;
  onPlay: () => void;
  onAnalyze: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onPlay, onAnalyze }) => {
    
  const handlePlay = () => {
    if (game.gameType !== 'static') {
      onPlay();
    } else {
      alert('Este juego es solo una demo visual por ahora.');
    }
  };

  return (
    <div className="group relative rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-cyan-400 transition-all duration-300 transform hover:-translate-y-1">
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 z-10"></div>
      <img src={game.image} alt={game.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
      
      {game.is666 && (
        <div className="absolute top-2 right-2 bg-red-600 text-white font-black text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,1)] z-20">
            666
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
        <h3 className="text-white font-bold text-lg truncate group-hover:text-cyan-400 transition-colors">{game.name}</h3>
        <p className="text-gray-400 text-sm">{game.category}</p>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 p-4">
          <button onClick={handlePlay} className="w-full px-4 py-2 bg-red-600 text-white font-bold uppercase tracking-wider rounded-md text-sm hover:bg-red-700 transition-colors">
              {game.gameType !== 'static' ? 'Jugar Ahora' : 'Ver Demo'}
          </button>
          <button onClick={onAnalyze} className="w-full px-4 py-2 bg-cyan-600 text-white font-bold uppercase tracking-wider rounded-md text-sm hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2">
              <AIIcon className="w-5 h-5"/>
              Análisis IA
          </button>
      </div>
    </div>
  );
};

export default GameCard;