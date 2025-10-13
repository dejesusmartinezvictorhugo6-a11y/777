import React, { useState, useEffect } from 'react';
import { useUser } from '../../hooks/useUser';
import Button from '../cashier/ui/Button';
import Modal from '../cashier/ui/Modal';
import { useSound } from '../../hooks/useSound';

// Sound Effects
const SPIN_SOUND = 'https://cdn.pixabay.com/audio/2022/03/15/audio_1303839281.mp3';
const WIN_SOUND = 'https://cdn.pixabay.com/audio/2022/03/10/audio_c29d9876a1.mp3';
const LOSE_SOUND = 'https://cdn.pixabay.com/audio/2021/08/04/audio_c332822a18.mp3';
const JACKPOT_SOUND = 'https://cdn.pixabay.com/audio/2022/05/17/audio_472b4f9a77.mp3';
const REEL_STOP_SOUND = 'https://cdn.pixabay.com/audio/2022/03/10/audio_2eb224b589.mp3';

// Configuración del juego
const JACKPOT_SYMBOL = '6️⃣';
const RARE_SYMBOL = '7️⃣';
const COMMON_SYMBOLS = ['😈', '💀', '🔥', '💎'];
const ALL_SYMBOLS = [JACKPOT_SYMBOL, RARE_SYMBOL, ...COMMON_SYMBOLS];

const PAYOUTS: Record<string, number> = {
  [RARE_SYMBOL]: 15, // 15x
  '😈': 5,
  '💀': 5,
  '🔥': 5,
  '💎': 5,
};

const REEL_STRIP = [
  JACKPOT_SYMBOL, '😈', '💀', RARE_SYMBOL, '🔥', '💎', '😈', '💀', '🔥', '💎', '😈', '💀', '🔥', '😈', '💀', RARE_SYMBOL, '🔥', '💎', '😈', '💀', '🔥', '😈'
];

const REEL_STRIPS = [REEL_STRIP, REEL_STRIP, REEL_STRIP];
const BET_LEVELS = [5, 10, 25, 50];

interface SlotMachineProps {
    isRulesOpen?: boolean;
    onCloseRules?: () => void;
}

const SlotMachine: React.FC<SlotMachineProps> = ({ isRulesOpen = false, onCloseRules = () => {} }) => {
  const [reels, setReels] = useState<string[]>(['😈', '😈', '😈']);
  const [spinning, setSpinning] = useState([false, false, false]);
  const [result, setResult] = useState<string | null>(null);
  const [winningIndices, setWinningIndices] = useState<number[]>([]);
  const [betAmount, setBetAmount] = useState(BET_LEVELS[0]);
  const { user, placeBet, addWinnings, progressiveJackpot, resetJackpot } = useUser();
  const { playSoundEffect } = useSound();

  const handleSpin = () => {
    if (spinning.some(s => s) || !user || user.balance < betAmount) {
      if(user && user.balance < betAmount) setResult("Fondos insuficientes.");
      return;
    }

    if (!placeBet(betAmount)) {
        setResult("Error al realizar la apuesta.");
        return;
    }

    playSoundEffect(SPIN_SOUND);
    setSpinning([true, true, true]);
    setResult(null);
    setWinningIndices([]);

    const finalReels = REEL_STRIPS.map(strip => strip[Math.floor(Math.random() * strip.length)]);

    setTimeout(() => {
        playSoundEffect(REEL_STOP_SOUND);
        setReels(prev => [finalReels[0], prev[1], prev[2]]);
        setSpinning(prev => [false, prev[1], prev[2]]);
    }, 1500);

    setTimeout(() => {
        playSoundEffect(REEL_STOP_SOUND);
        setReels(prev => [prev[0], finalReels[1], prev[2]]);
        setSpinning(prev => [prev[0], false, prev[2]]);
    }, 2000);

    setTimeout(() => {
        playSoundEffect(REEL_STOP_SOUND);
        setReels(finalReels);
        setSpinning([false, false, false]);
        checkWin(finalReels);
    }, 2500);
  };
  
  useEffect(() => {
    if (spinning.some(s => s)) {
      const spinInterval = setInterval(() => {
        setReels(prevReels => prevReels.map((reel, index) => 
          spinning[index] ? ALL_SYMBOLS[Math.floor(Math.random() * ALL_SYMBOLS.length)] : reel
        ));
      }, 80);
      return () => clearInterval(spinInterval);
    }
  }, [spinning]);


  const checkWin = (finalReels: string[]) => {
    if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
        const symbol = finalReels[0];
        let winAmount = 0;
        if (symbol === JACKPOT_SYMBOL) {
            winAmount = progressiveJackpot;
            playSoundEffect(JACKPOT_SOUND);
            setResult(`¡¡¡JACKPOT!!! ¡GANASTE $${winAmount.toFixed(2)}!`);
            addWinnings(winAmount);
            resetJackpot();
        } else {
            winAmount = (PAYOUTS[symbol] || 0) * betAmount;
            playSoundEffect(WIN_SOUND);
            setResult(`¡GANASTE $${winAmount.toFixed(2)}!`);
            addWinnings(winAmount);
        }
        setWinningIndices([0, 1, 2]);
    } else {
        playSoundEffect(LOSE_SOUND);
        setResult("Inténtalo de nuevo.");
    }
  };
  
  const Reel: React.FC<{ symbol: string; isSpinning: boolean; isWinning: boolean }> = ({ symbol, isSpinning, isWinning }) => (
    <div className={`w-24 h-24 sm:w-32 sm:h-32 bg-gray-900 border-4 border-cyan-900 rounded-lg flex items-center justify-center overflow-hidden transition-all duration-300 ${isWinning ? 'animate-symbol-win-glow' : ''}`}>
      <div className={`text-5xl sm:text-6xl transition-transform duration-100 ${isSpinning ? 'animate-spin-reel' : ''}`}>
        {symbol}
      </div>
    </div>
  );
  
  const isJackpotWin = result?.includes('JACKPOT');

  return (
    <div className="flex flex-col items-center justify-center p-4 h-full text-white bg-gradient-to-b from-gray-900 via-red-900/50 to-gray-900">
      <div className="bg-black/50 border-4 border-gray-700 rounded-2xl p-4 sm:p-6 shadow-[inset_0_0_20px_black,_0_0_30px_rgba(239,68,68,0.4)]">
        <div className="text-center mb-4">
            <h2 className="text-lg uppercase font-bold text-red-500">Jackpot Infernal</h2>
            <p className="text-4xl font-black text-yellow-300 animate-jackpot-text-glow">${progressiveJackpot.toFixed(2)}</p>
        </div>

        <div className="flex space-x-2 sm:space-x-4">
          {reels.map((symbol, index) => (
            <Reel key={index} symbol={symbol} isSpinning={spinning[index]} isWinning={winningIndices.includes(index)} />
          ))}
        </div>
        
        {result && (
          <div className={`text-2xl font-black uppercase text-center mt-4 min-h-[32px] ${result.includes('GANASTE') ? 'text-yellow-400' : 'text-gray-400'}`}>
            {isJackpotWin ? <span className="animate-jackpot-text-glow text-3xl">{result}</span> : result}
          </div>
        )}

        <div className="text-center space-y-4 mt-4">
          <div className="space-x-2" id="bet-level-selector">
              {BET_LEVELS.map(level => (
                  <button
                      key={level}
                      onClick={() => setBetAmount(level)}
                      className={`px-3 py-1 text-sm font-bold rounded-md border-2 transition-all ${betAmount === level ? 'bg-red-600 border-red-500 text-white' : 'bg-gray-800 border-gray-700 hover:border-red-500'}`}
                  >
                      ${level}
                  </button>
              ))}
          </div>
          <p className="font-bold text-lg">Apuesta: ${betAmount.toFixed(2)}</p>
        </div>

        <Button id="spin-button" onClick={handleSpin} disabled={spinning.some(s => s) || (user ? user.balance < betAmount : true)} className="w-full mt-4">
          {spinning.some(s => s) ? 'GIRANDO...' : 'GIRAR'}
        </Button>
      </div>


      {isRulesOpen && (
        <Modal isOpen={isRulesOpen} onClose={onCloseRules} title="Cómo Jugar: Tragamonedas">
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-bold text-lg text-cyan-400 uppercase">Objetivo</h3>
              <p>Consigue tres símbolos iguales en la línea central para ganar.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg text-cyan-400 uppercase">Límites de Apuesta</h3>
              <p>Puedes apostar ${BET_LEVELS.join(', $')}. La apuesta máxima por giro es de ${BET_LEVELS[BET_LEVELS.length - 1]}.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg text-cyan-400 uppercase">Tabla de Pagos</h3>
              <ul className="list-none space-y-2 pt-2">
                <li className="flex items-center gap-4"><span className="text-2xl">6️⃣ 6️⃣ 6️⃣</span> <span className="font-bold text-yellow-400">Premio Mayor Progresivo</span></li>
                <li className="flex items-center gap-4"><span className="text-2xl">7️⃣ 7️⃣ 7️⃣</span> <span className="font-bold text-white">Ganas: 15x tu apuesta</span></li>
                <li className="flex items-center gap-4"><span className="text-2xl">💎 💎 💎</span> <span className="font-bold text-white">Ganas: 5x tu apuesta</span></li>
                <li className="flex items-center gap-4"><span className="text-2xl">🔥 🔥 🔥</span> <span className="font-bold text-white">Ganas: 5x tu apuesta</span></li>
                <li className="flex items-center gap-4"><span className="text-2xl">💀 💀 💀</span> <span className="font-bold text-white">Ganas: 5x tu apuesta</span></li>
                <li className="flex items-center gap-4"><span className="text-2xl">😈 😈 😈</span> <span className="font-bold text-white">Ganas: 5x tu apuesta</span></li>
              </ul>
            </div>
            <div className="pt-4 text-center">
                <Button onClick={onCloseRules} variant="secondary">Entendido</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SlotMachine;