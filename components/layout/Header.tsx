
import React from 'react';
import { useUser } from '../../hooks/useUser';
import Button from '../cashier/ui/Button';
import { View } from '../../App';
import { CURRENCY_RATES } from '../../constants';
import { Currency } from '../../types';
import { useTutorial } from '../../hooks/useTutorial';

interface HeaderProps {
    onNavigate: (view: View) => void;
    onAuthClick: () => void;
    onCashierClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onAuthClick, onCashierClick }) => {
    const { user, logout, displayCurrency, changeDisplayCurrency } = useUser();
    const { startTutorial } = useTutorial();
    
    return (
        <header className="bg-black/80 backdrop-blur-sm border-b-2 border-red-600 shadow-[0_5px_25px_rgba(220,38,38,0.3)] sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="text-3xl font-black text-red-500 tracking-widest cursor-pointer" onClick={() => onNavigate(View.LOBBY)}>
                    VECTOR'S <span className="text-white">666</span>
                </div>
                <nav className="hidden md:flex items-center space-x-6">
                    <a onClick={() => onNavigate(View.LOBBY)} className="text-gray-300 hover:text-red-500 transition-colors font-bold uppercase cursor-pointer">Lobby</a>
                    {user && <a onClick={() => onNavigate(View.VIP)} className="text-gray-300 hover:text-red-500 transition-colors font-bold uppercase cursor-pointer">Club 666</a>}
                    {user && <a onClick={() => onNavigate(View.ACCOUNT)} className="text-gray-300 hover:text-red-500 transition-colors font-bold uppercase cursor-pointer">Mi Cuenta</a>}
                    <button onClick={startTutorial} className="text-gray-300 hover:text-red-500 transition-colors font-bold uppercase cursor-pointer">Reiniciar Tutorial</button>
                </nav>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <div className="text-right" id="user-balance-display">
                                <div className="text-sm text-cyan-400">{user.email}</div>
                                <div className="font-bold text-lg flex items-center gap-2">
                                     <span>
                                        {CURRENCY_RATES[displayCurrency].symbol}
                                        {((user.balance + user.bonusBalance) / CURRENCY_RATES[displayCurrency].rate).toFixed(2)}
                                    </span>
                                    <select
                                        value={displayCurrency}
                                        onChange={(e) => changeDisplayCurrency(e.target.value as Currency)}
                                        className="bg-gray-800 border border-gray-700 rounded-md text-sm p-1 focus:outline-none focus:ring-1 focus:ring-cyan-500 appearance-none"
                                        aria-label="Seleccionar Moneda"
                                    >
                                        {Object.keys(CURRENCY_RATES).map(curr => (
                                            <option key={curr} value={curr}>{curr}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <Button onClick={onCashierClick} variant="secondary" id="cashier-button">Cajero</Button>
                            <Button onClick={logout} variant="danger">Salir</Button>
                        </>
                    ) : (
                        <Button onClick={onAuthClick}>Registrar / Entrar</Button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;