import React, { useState } from 'react';
import Modal from '../cashier/ui/Modal';
import { useSound } from '../../hooks/useSound';
import Slider from '../cashier/ui/Slider';
import { VolumeUpIcon, VolumeOffIcon } from '../cashier/ui/Icons';
import Button from '../cashier/ui/Button';
import { View } from '../../App';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: View) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'audio' | 'account' | 'support'>('audio');
  const { 
    masterVolume, setMasterVolume, 
    musicVolume, setMusicVolume, 
    sfxVolume, setSfxVolume 
  } = useSound();

  const TabButton: React.FC<{tab: 'audio' | 'account' | 'support', children: React.ReactNode}> = ({ tab, children }) => (
    <button 
        onClick={() => setActiveTab(tab)}
        className={`w-1/3 py-2 text-sm font-bold uppercase transition-colors ${activeTab === tab ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-white'}`}
    >
        {children}
    </button>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajustes">
        <div className="flex border-b border-gray-700 mb-6">
            <TabButton tab="audio">Audio</TabButton>
            <TabButton tab="account">Cuenta</TabButton>
            <TabButton tab="support">Soporte</TabButton>
        </div>
        <div className="min-h-[200px]">
            {activeTab === 'audio' && (
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        {masterVolume > 0 ? <VolumeUpIcon className="w-6 h-6 text-gray-400" /> : <VolumeOffIcon className="w-6 h-6 text-gray-400" />}
                        <Slider label="Volumen Maestro" id="master-volume" value={masterVolume} onChange={e => setMasterVolume(parseFloat(e.target.value))} />
                    </div>
                    <Slider label="Música" id="music-volume" value={musicVolume} onChange={e => setMusicVolume(parseFloat(e.target.value))} />
                    <Slider label="Efectos de Sonido" id="sfx-volume" value={sfxVolume} onChange={e => setSfxVolume(parseFloat(e.target.value))} />
                </div>
            )}
             {activeTab === 'account' && (
                <div className="text-center space-y-4">
                    <h3 className="font-bold text-lg text-white">Gestionar Cuenta</h3>
                    <p className="text-gray-400">Revisa tu balance, estado de verificación o cambia tu contraseña.</p>
                    <Button variant="secondary" onClick={() => {
                        onClose();
                        onNavigate(View.ACCOUNT);
                    }}>
                        Ir a Mi Cuenta
                    </Button>
                </div>
            )}
            {activeTab === 'support' && (
                 <div className="text-center space-y-4">
                    <h3 className="font-bold text-lg text-white">Soporte Infernal</h3>
                    <p className="text-gray-400">¿Problemas en el paraíso del pecado? Mis diablillos de soporte están listos para ayudarte (o para reírse de tu desgracia).</p>
                    <p className="font-bold text-cyan-400">support@vectors666.hell</p>
                    <p className="text-sm text-gray-500">(Canal de soporte simulado)</p>
                </div>
            )}
        </div>
    </Modal>
  );
};

export default SettingsModal;
