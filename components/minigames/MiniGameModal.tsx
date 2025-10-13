import React from 'react';
import { Game } from '../../types';
import Modal from '../cashier/ui/Modal';
import SlotMachine from './SlotMachine';
import Roulette from './Roulette';
import GameContainer from './GameContainer';
import { View } from '../../App';

interface MiniGameModalProps {
  game: Game;
  onClose: () => void;
  onNavigate: (view: View) => void;
}

const MiniGameModal: React.FC<MiniGameModalProps> = ({ game, onClose, onNavigate }) => {
  const renderGame = (props: { openRules: () => void }) => {
    switch (game.gameType) {
      case 'slot':
        // FIX: Removed spreading of props. The `openRules` prop is not accepted by the game components and was causing a type error.
        return <SlotMachine />;
      case 'roulette':
        // FIX: Removed spreading of props. The `openRules` prop is not accepted by the game components and was causing a type error.
        return <Roulette />;
      default:
        // This case should ideally not be reached if triggered correctly from GameCard
        onClose();
        return null;
    }
  };
  
  const isIframeGame = game.gameType === 'iframe';

  if (isIframeGame) {
    return (
        <Modal isOpen={true} onClose={onClose} title={game.name} size={'lg'}>
            <div className="w-full aspect-video bg-black">
                <iframe
                    src={game.iframeUrl}
                    className="w-full h-full border-0"
                    title={game.name}
                    allow="fullscreen"
                    sandbox="allow-scripts allow-same-origin"
                ></iframe>
            </div>
        </Modal>
    )
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={game.name} size={'lg'}>
      <div className="min-h-[500px] h-[60vh] max-h-[600px] -m-6">
        <GameContainer game={game} onClose={onClose} onNavigate={onNavigate}>
            { (props) => renderGame(props) }
        </GameContainer>
      </div>
    </Modal>
  );
};

export default MiniGameModal;
