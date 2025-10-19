
import React, { useState, useMemo } from 'react';
import { useUser } from '../../hooks/useUser';
import Button from '../cashier/ui/Button';
import Modal from '../cashier/ui/Modal';
import { useSound } from '../../hooks/useSound';

// Sound Effects
const BET_SOUND = 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_ad48b06972.mp3';
const SPIN_SOUND = 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_551b91c13d.mp3';
const WIN_SOUND = 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_a16f90b345.mp3';
const LOSE_SOUND = 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_c332822a18.mp3';

// Game Configuration
const ROULETTE_NUMBERS = [0, 11, 5, 10, 6, 9, 7, 8, 1, 12, 2, 3, 4];
const RED_NUMBERS = [1, 3, 5, 7, 9, 12];
const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11];

const CHIP_VALUES = [1, 5, 10, 25];
const MAX_STRAIGHT_BET = 25;
const MAX_TOTAL_BET = 100;

type BetType = 'red' | 'black' | string; // Use string for number keys

interface RouletteProps {
    isRulesOpen?: boolean;
    onCloseRules?: () => void;
}

const Roulette: React.FC<RouletteProps> = ({ isRulesOpen = false, onCloseRules = () => {} }) => {
    const { user, placeBet, addWinnings } = useUser();
    const { playSoundEffect } = useSound();
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [winningNumber, setWinningNumber] = useState<number | null>(null);
    const [rotation, setRotation] = useState(0);

    const [selectedChip, setSelectedChip] = useState(CHIP_VALUES[0]);
    const [bets, setBets] = useState<Record<BetType, number>>({});
    
    const totalBet = useMemo(() => Object.values(bets).reduce((sum, amount) => sum + amount, 0), [bets]);

    const handlePlaceBet = (betType: BetType) => {
        if (spinning || !user) return;

        // FIX: Removed unnecessary and potentially buggy `Number()` wrapper. `bets[betType]` is already a number or undefined.
        const newAmountOnSpot = (bets[betType] || 0) + selectedChip;
        const newTotalBet = totalBet - (bets[betType] || 0) + newAmountOnSpot;

        if (newTotalBet > user.balance) {
            setResult("Fondos insuficientes para esta apuesta.");
            return;
        }
        if (newTotalBet > MAX_TOTAL_BET) {
            setResult(`Límite de apuesta total ($${MAX_TOTAL_BET}) excedido.`);
            return;
        }
        if (betType !== 'red' && betType !== 'black' && newAmountOnSpot > MAX_STRAIGHT_BET) {
            setResult(`Límite de apuesta por número ($${MAX_STRAIGHT_BET}) excedido.`);
            return;
        }
        
        playSoundEffect(BET_SOUND);
        setBets(prev => ({ ...prev, [betType]: newAmountOnSpot }));
        setResult(null);
        setWinningNumber(null);
    };

    const handleClearBets = () => {
        if (spinning) return;
        setBets({});
    }

    const handleSpin = () => {
        if (spinning || totalBet === 0 || !user || user.balance < totalBet) {
            if (totalBet === 0) setResult("Realiza una apuesta.");
            if (user && user.balance < totalBet) setResult("Fondos insuficientes.");
            return;
        }

        if (!placeBet(totalBet)) {
            setResult("Error al realizar la apuesta.");
            return;
        }

        playSoundEffect(SPIN_SOUND);
        setSpinning(true);
        setResult(null);
        setWinningNumber(null);
        
        const randomIndex = Math.floor(Math.random() * ROULETTE_NUMBERS.length);
        const winner = ROULETTE_NUMBERS[randomIndex];
        
        const currentRotation = rotation % 360;
        const baseRotations = 5 * 360;
        const anglePerSegment = 360 / ROULETTE_NUMBERS.length;
        const finalAngle = baseRotations + (randomIndex * -anglePerSegment);
        
        setRotation(prev => prev - currentRotation + finalAngle);

        setTimeout(() => {
            setWinningNumber(winner);
            let totalWinnings = 0;

            for (const [betType, betAmount] of Object.entries(bets)) {
                if (betType === winner.toString()) {
                    // FIX: Removed redundant `Number()` wrapper as `betAmount` is already a number.
                    totalWinnings += betAmount * 10;
                } else if (betType === 'red' && RED_NUMBERS.includes(winner)) {
                    // FIX: Removed redundant `Number()` wrapper as `betAmount` is already a number.
                    totalWinnings += betAmount * 2;
                } else if (betType === 'black' && BLACK_NUMBERS.includes(winner)) {
                    // FIX: Removed redundant `Number()` wrapper as `betAmount` is already a number.
                    totalWinnings += betAmount * 2;
                }
            }

            let winMessage = `El número es ${winner}. No has ganado.`;
            if (totalWinnings > 0) {
                addWinnings(totalWinnings);
                playSoundEffect(WIN_SOUND);
                winMessage = `El número es ${winner}. ¡Ganaste $${totalWinnings.toFixed(2)}!`;
            } else {
                playSoundEffect(LOSE_SOUND);
            }
            
            setResult(winMessage);
            setSpinning(false);
            setBets({});
        }, 4100);
    };

    const getNumberColor = (num: number) => {
        if (RED_NUMBERS.includes(num)) return 'bg-red-600';
        if (BLACK_NUMBERS.includes(num)) return 'bg-gray-700';
        return 'bg-green-600';
    };

    return (
        <div className="flex flex-col items-center justify-between p-2 space-y-2 text-white h-full bg-gradient-to-b from-gray-900 via-green-900/40 to-gray-900">
            <div className="relative w-48 h-48 lg:w-56 lg:h-56">
                <div 
                    className="w-full h-full rounded-full border-8 border-gray-600 bg-gray-900 transition-transform duration-[4000ms] ease-out"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    {ROULETTE_NUMBERS.map((num, i) => {
                        const angle = (360 / ROULETTE_NUMBERS.length) * i;
                        return (
                            <div key={num} className="absolute w-full h-full" style={{ transform: `rotate(${angle}deg)` }}>
                                <div className={`absolute top-0 left-1/2 -ml-4 w-8 h-1/2 flex items-start justify-center pt-2 text-white font-bold ${getNumberColor(num)}`} style={{clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)'}}>
                                    <span>{num}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gray-700 rounded-full border-4 border-gray-500"></div>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-yellow-400"></div>
            </div>

            <div className="w-full max-w-sm">
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <button onClick={() => handlePlaceBet('red')} disabled={spinning} className={`relative p-2 text-lg font-bold uppercase rounded-md transition-all border-2 ${bets['red'] ? 'border-yellow-400' : 'border-red-600'} bg-red-600`}>
                      Rojo {bets['red'] && <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">${bets['red']}</span>}
                    </button>
                    <button onClick={() => handlePlaceBet('black')} disabled={spinning} className={`relative p-2 text-lg font-bold uppercase rounded-md transition-all border-2 ${bets['black'] ? 'border-yellow-400' : 'border-gray-500'} bg-gray-700`}>
                      Negro {bets['black'] && <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">${bets['black']}</span>}
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs justify-items-center">
                    {ROULETTE_NUMBERS.map(num => (
                        <button
                            key={num}
                            onClick={() => handlePlaceBet(num.toString())}
                            disabled={spinning}
                            className={`relative h-8 w-8 rounded-full font-bold flex items-center justify-center transition-all ${getNumberColor(num)} hover:ring-2 ring-white ${winningNumber === num ? 'animate-number-win-glow' : ''}`}
                        >
                            {num}
                            {bets[num.toString()] && <span className="absolute bg-yellow-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">${bets[num.toString()]}</span>}
                        </button>
                    ))}
                </div>
            </div>

            {result && <div className={`text-lg font-black uppercase text-center h-7 ${result.includes('Ganaste') ? 'text-yellow-400' : 'text-gray-400'}`}>{result}</div>}

            <div className="w-full text-center space-y-2">
                <div className="flex justify-center items-center space-x-2">
                    <span className="text-gray-400 text-sm">FICHA:</span>
                    {CHIP_VALUES.map(chip => (
                        <button key={chip} onClick={() => setSelectedChip(chip)} className={`w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center border-2 transition-all ${selectedChip === chip ? 'bg-cyan-500 border-white scale-110' : 'bg-cyan-800 border-cyan-600'}`}>
                            ${chip}
                        </button>
                    ))}
                </div>
                 <div className="flex justify-center gap-4">
                    <Button variant="danger" onClick={handleClearBets} disabled={spinning || totalBet === 0} className="!px-3 !py-1 !text-sm">Limpiar</Button>
                    <p className="font-bold text-lg">Apuesta Total: ${totalBet.toFixed(2)}</p>
                </div>
                <Button onClick={handleSpin} disabled={spinning || totalBet === 0 || (user ? user.balance < totalBet : true)}>{spinning ? 'GIRANDO...' : 'GIRAR'}</Button>
            </div>
            
            {isRulesOpen && (
                <Modal isOpen={isRulesOpen} onClose={onCloseRules} title="Cómo Jugar: Ruleta">
                    <div className="space-y-4 text-gray-300">
                        <div>
                            <h3 className="font-bold text-lg text-cyan-400 uppercase">Cómo Apostar</h3>
                            <p>1. Selecciona una ficha ($1, $5, $10, $25).</p>
                            <p>2. Haz clic en los números o colores para colocar tus fichas.</p>
                            <p>3. Puedes colocar múltiples fichas en diferentes lugares.</p>
                            <p>4. Presiona "GIRAR" para iniciar la ronda.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-cyan-400 uppercase">Límites de Apuesta</h3>
                            <ul className="list-disc list-inside">
                                <li>Apuesta máxima en un solo número: <strong className="text-white">${MAX_STRAIGHT_BET}</strong>.</li>
                                <li>Apuesta máxima total por ronda: <strong className="text-white">${MAX_TOTAL_BET}</strong>.</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-cyan-400 uppercase">Tabla de Pagos</h3>
                            <ul className="list-none space-y-2 pt-2">
                                <li><strong className="text-white">Número Exacto:</strong> Paga 10 a 1.</li>
                                <li><strong className="text-white">Rojo / Negro:</strong> Paga 2 a 1.</li>
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

export default Roulette;
