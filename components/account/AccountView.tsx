
import React, { useState } from 'react';
import { useUser } from '../../hooks/useUser';
import KycSection from './KycSection';
import { KycStatus } from '../../types';
import Input from '../cashier/ui/Input';
import Button from '../cashier/ui/Button';

const AccountView: React.FC = () => {
  const { user, transactions } = useUser();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!user) {
    return <div className="text-center text-red-500">Error: Usuario no encontrado.</div>;
  }

  const kycStatusColors = {
    [KycStatus.UNVERIFIED]: 'text-yellow-400 border-yellow-400',
    [KycStatus.PENDING]: 'text-cyan-400 border-cyan-400',
    [KycStatus.VERIFIED]: 'text-green-500 border-green-500',
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Las nuevas contraseñas no coinciden.");
      return;
    }
    if (newPassword.length < 8) {
        alert("La nueva contraseña debe tener al menos 8 caracteres.");
        return;
    }
    alert("¡Contraseña cambiada con éxito! (Simulación)");
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-5xl font-black text-red-500 uppercase">Mi Cuenta</h1>
        <p className="text-gray-400">{user.email}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-gray-900 p-6 border border-gray-800 rounded-lg">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4 uppercase">Información</h2>
          <div className="space-y-3">
            <div>
              <span className="font-bold text-gray-400">Balance Real: </span>
              <span className="text-white text-lg">${user.balance.toFixed(2)}</span>
            </div>
            <div>
              <span className="font-bold text-gray-400">Balance de Bono: </span>
              <span className="text-white text-lg">${user.bonusBalance.toFixed(2)}</span>
            </div>
            <div>
              <span className="font-bold text-gray-400">Status KYC: </span>
              <span className={`font-bold text-lg px-2 py-1 border rounded-md ${kycStatusColors[user.kycStatus]}`}>{user.kycStatus}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 p-6 border border-gray-800 rounded-lg">
           <KycSection />
        </div>

        <div className="bg-gray-900 p-6 border border-gray-800 rounded-lg md:col-span-2">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4 uppercase">Seguridad</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md mx-auto">
                <Input label="Contraseña Actual" id="current-password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
                <Input label="Nueva Contraseña" id="new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                <Input label="Confirmar Nueva Contraseña" id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                <Button type="submit" variant="secondary" className="w-full">Cambiar Contraseña</Button>
            </form>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
         <h2 className="text-2xl font-bold text-cyan-400 mb-4 uppercase text-center">Historial de Transacciones</h2>
         <div className="bg-gray-900 p-4 border border-gray-800 rounded-lg max-h-96 overflow-y-auto">
            {transactions.length > 0 ? (
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="p-2">Fecha</th>
                            <th className="p-2">Tipo</th>
                            <th className="p-2">Monto</th>
                            <th className="p-2">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(tx => (
                            <tr key={tx.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="p-2 text-gray-400">{tx.date.toLocaleString()}</td>
                                <td className="p-2">{tx.type}</td>
                                <td className={`p-2 font-bold ${tx.type === 'Depósito' ? 'text-green-500' : 'text-red-500'}`}>
                                    ${tx.amount.toFixed(2)}
                                </td>
                                <td className="p-2 text-cyan-400">{tx.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-500 py-8">No hay transacciones todavía.</p>
            )}
         </div>
      </div>

    </div>
  );
};

export default AccountView;