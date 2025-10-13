
import React, { useState } from 'react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';
import { useUser } from '../../hooks/useUser';
import { KycStatus, TransactionType, Currency } from '../../types';
import { CreditCardIcon, BanknotesIcon } from './ui/Icons';
import { CURRENCY_RATES } from '../../constants';

interface CashierModalProps {
  onClose: () => void;
}

const CashierModal: React.FC<CashierModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | null>(null);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [depositCurrency, setDepositCurrency] = useState<Currency>('USD');
  const { user, deposit, withdraw, transactions } = useUser();

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount);
    if (depositAmount > 0 && paymentMethod) {
      if (paymentMethod === 'card') {
        if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
            alert('Por favor, completa los detalles de la tarjeta.');
            return;
        }
      }
      
      const rate = CURRENCY_RATES[depositCurrency].rate;
      const amountInUSD = depositAmount * rate;
      
      deposit(amountInUSD);
      setAmount('');
      setDepositCurrency('USD');
      setPaymentMethod(null);
      setCardDetails({ number: '', expiry: '', cvv: '' });
      alert(`${CURRENCY_RATES[depositCurrency].symbol}${depositAmount.toFixed(2)} (${depositCurrency}) depositados con éxito (equivalente a $${amountInUSD.toFixed(2)} USD).`);
    } else {
        alert('Por favor, selecciona un método de pago e ingresa un monto válido.');
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.kycStatus !== KycStatus.VERIFIED) {
        alert("Debes verificar tu cuenta (KYC) antes de poder retirar fondos.");
        return;
    }
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > 0 && user && user.balance >= withdrawAmount) {
        withdraw(withdrawAmount);
        setAmount('');
        alert(`$${withdrawAmount.toFixed(2)} retirados con éxito.`);
    } else {
        alert("Monto de retiro inválido o fondos insuficientes.");
    }
  };

  const handleCardDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardDetails({...cardDetails, [e.target.name]: e.target.value});
  }

  const isFirstDeposit = transactions.filter(t => t.type === TransactionType.DEPOSIT).length === 0;

  const TabButton: React.FC<{tab: 'deposit' | 'withdraw', children: React.ReactNode}> = ({ tab, children }) => (
    <button 
        onClick={() => {
            setActiveTab(tab);
            setAmount('');
            setPaymentMethod(null);
        }}
        className={`w-1/2 py-3 text-lg font-black uppercase transition-colors ${activeTab === tab ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 hover:text-white'}`}
    >
        {children}
    </button>
  );

  const PaymentMethodButton: React.FC<{method: 'card' | 'transfer', children: React.ReactNode, icon: React.ReactNode}> = ({ method, children, icon }) => (
    <button
        type="button"
        onClick={() => setPaymentMethod(method)}
        className={`w-full p-4 border-2 rounded-lg flex items-center justify-center space-x-3 transition-all duration-300
            ${paymentMethod === method 
                ? 'bg-cyan-900/50 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]' 
                : 'bg-gray-800 border-gray-700 hover:border-cyan-500'}`
        }
    >
        {icon}
        <span className="font-bold uppercase tracking-wider">{children}</span>
    </button>
  );

  return (
    <Modal isOpen={true} onClose={onClose} title="Cajero">
      <div className="flex border-b border-gray-700 mb-6">
        <TabButton tab="deposit">Depositar</TabButton>
        <TabButton tab="withdraw">Retirar</TabButton>
      </div>

      {activeTab === 'deposit' && (
        <form onSubmit={handleDeposit} className="space-y-6">
          <p className="text-center text-gray-400 -mt-2">Balance Actual: ${user?.balance.toFixed(2)}</p>
          {isFirstDeposit && (
            <div className="text-center bg-green-900/50 border border-green-500 text-green-300 p-3 rounded-md">
              <p className="font-bold">¡Bono de Primer Depósito!</p>
              <p className="text-sm">Recibirás un bono del 100% sobre el monto de tu primer depósito.</p>
            </div>
          )}

          <div>
              <label className="block text-sm font-bold text-cyan-400 mb-2 uppercase tracking-wider">
                1. Selecciona un método de pago
              </label>
              <div className="grid grid-cols-2 gap-4">
                <PaymentMethodButton method="card" icon={<CreditCardIcon className="h-6 w-6"/>}>Tarjeta</PaymentMethodButton>
                <PaymentMethodButton method="transfer" icon={<BanknotesIcon className="h-6 w-6"/>}>Transferencia</PaymentMethodButton>
              </div>
          </div>
          
          {paymentMethod && (
            <div className="animate-fade-in-up">
              {paymentMethod === 'card' && (
                <div>
                   <label className="block text-sm font-bold text-cyan-400 mb-2 uppercase tracking-wider">
                    2. Detalles de la tarjeta
                  </label>
                  <Input label="Número de Tarjeta" id="cardNumber" name="number" type="text" placeholder="**** **** **** ****" value={cardDetails.number} onChange={handleCardDetailChange} required />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Vencimiento" id="cardExpiry" name="expiry" type="text" placeholder="MM/AA" value={cardDetails.expiry} onChange={handleCardDetailChange} required />
                    <Input label="CVV" id="cardCvv" name="cvv" type="text" placeholder="123" value={cardDetails.cvv} onChange={handleCardDetailChange} required />
                  </div>
                </div>
              )}
              {paymentMethod === 'transfer' && (
                <div>
                  <label className="block text-sm font-bold text-cyan-400 mb-2 uppercase tracking-wider">
                    2. Realiza la transferencia
                  </label>
                  <div className="bg-gray-800 p-4 rounded-md border border-gray-700 text-sm">
                    <p><strong className="text-gray-400">Banco:</strong> Banco del Inframundo</p>
                    <p><strong className="text-gray-400">Beneficiario:</strong> Vector's 666 Casino</p>
                    <p><strong className="text-gray-400">CLABE:</strong> 666 123 4567890123 6</p>
                    <p><strong className="text-gray-400">Concepto:</strong> Depósito {user?.email.split('@')[0]}</p>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-cyan-400 mb-2 uppercase tracking-wider mt-4">
                  3. Ingresa el monto
                </label>
                <div className="flex items-start gap-2">
                    <Input
                        id="depositAmount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="10"
                        step="0.01"
                        placeholder="100.00"
                        required
                        containerClassName="flex-grow !mb-0"
                    />
                    <select
                        value={depositCurrency}
                        onChange={(e) => setDepositCurrency(e.target.value as Currency)}
                        className="bg-gray-800 border-2 border-gray-700 rounded-md py-2 px-3 text-white h-[46px] focus:outline-none focus:border-cyan-500"
                        aria-label="Moneda de depósito"
                    >
                        {Object.keys(CURRENCY_RATES).map(curr => (
                            <option key={curr} value={curr}>{curr}</option>
                        ))}
                    </select>
                </div>
                 {depositCurrency !== 'USD' && amount && parseFloat(amount) > 0 && (
                    <div className="mt-2 text-sm text-center bg-gray-800 p-2 rounded-md border border-cyan-800">
                        <p>Tasa de cambio: 1 {depositCurrency} = ${CURRENCY_RATES[depositCurrency].rate} USD</p>
                        <p className="font-bold text-cyan-400">Total a acreditar: ${(parseFloat(amount) * CURRENCY_RATES[depositCurrency].rate).toFixed(2)} USD</p>
                    </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={!amount}>Depositar</Button>
            </div>
          )}

        </form>
      )}

      {activeTab === 'withdraw' && (
        <form onSubmit={handleWithdraw}>
          <p className="text-center text-gray-400 mb-4">Balance Retirable: ${user?.balance.toFixed(2)}</p>
           <Input
            label="Monto a Retirar"
            id="withdrawAmount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="20"
            step="0.01"
            placeholder="$50.00"
            required
          />
          <Button type="submit" className="w-full" variant='secondary' disabled={user?.kycStatus !== KycStatus.VERIFIED}>
            {user?.kycStatus !== KycStatus.VERIFIED ? 'Verificación KYC Requerida' : 'Retirar Fondos'}
          </Button>
        </form>
      )}
    </Modal>
  );
};

export default CashierModal;
