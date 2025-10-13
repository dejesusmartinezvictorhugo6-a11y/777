import React from 'react';
import { useUser } from '../../hooks/useUser';
import { CogIcon, InformationCircleIcon, QuestionMarkCircleIcon, XIcon } from '../cashier/ui/Icons';
import Button from '../cashier/ui/Button';

interface GameToolbarProps {
  onClose: () => void;
  onRulesClick: () => void;
  onSettingsClick: () => void;
}

const IconButton: React.FC<{onClick: () => void, 'aria-label': string, children: React.ReactNode, id?: string}> = ({ onClick, children, 'aria-label': ariaLabel, id }) => (
    <button onClick={onClick} aria-label={ariaLabel} id={id} className="p-2 text-gray-400 hover:text-cyan-400 transition-colors rounded-full hover:bg-white/10">
        {children}
    </button>
)

const GameToolbar: React.FC<GameToolbarProps> = ({ onClose, onRulesClick, onSettingsClick }) => {
    const { user } = useUser();

    return (
        <div className="bg-gray-900/80 border-t-2 border-gray-700 px-4 py-2 flex justify-between items-center rounded-b-lg">
            <div className="flex items-center gap-4">
                <IconButton onClick={onSettingsClick} aria-label="Ajustes">
                    <CogIcon className="w-6 h-6" />
                </IconButton>
                 <IconButton onClick={onRulesClick} aria-label="Reglas del juego">
                    <InformationCircleIcon className="w-6 h-6" />
                </IconButton>
            </div>
            <div className="text-center">
                 <div className="text-xs text-cyan-400">Balance</div>
                 <div className="font-bold text-lg">${user?.balance.toFixed(2)}</div>
            </div>
            <div className="flex items-center">
                <IconButton onClick={onClose} aria-label="Cerrar juego" id="game-toolbar-close">
                    <XIcon className="w-8 h-8 text-red-500 hover:text-red-400" />
                </IconButton>
            </div>
        </div>
    );
};

export default GameToolbar;
