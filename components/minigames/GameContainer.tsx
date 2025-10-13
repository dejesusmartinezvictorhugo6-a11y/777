import React, { useEffect, useState } from 'react';
import { Game } from '../../types';
import { useSound } from '../../hooks/useSound';
import GameToolbar from './GameToolbar';
import { View } from '../../App';
import SettingsModal from '../settings/SettingsModal';

interface GameContainerProps {
  game: Game;
  onClose: () => void;
  onNavigate: (view: View) => void;
  children: (props: { openRules: () => void }) => React.ReactNode;
}

const GameContainer: React.FC<GameContainerProps> = ({ game, onClose, onNavigate, children }) => {
  const { playMusic, stopMusic } = useSound();
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (game.musicUrl) {
      playMusic(game.musicUrl);
    }
    return () => {
      stopMusic();
    };
  }, [game.musicUrl, playMusic, stopMusic]);

  return (
    <div className="bg-black/50 rounded-lg flex flex-col h-full">
      <div className="flex-grow p-1 relative">
        {/* FIX: Refactored to render children only once, preventing duplicate game instances when rules are open. The `isRulesOpen` and `onCloseRules` props are now correctly passed via `cloneElement` in a single render path. */}
        {React.Children.map(children({ openRules: () => setIsRulesOpen(true) }), child => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, { 
                    isRulesOpen, 
                    onCloseRules: () => setIsRulesOpen(false) 
                });
            }
            return child;
        })}
      </div>
      <GameToolbar
        onClose={onClose}
        onRulesClick={() => setIsRulesOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />
      {isSettingsOpen && (
        <SettingsModal 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)}
            onNavigate={onNavigate}
        />
      )}
    </div>
  );
};

export default GameContainer;
