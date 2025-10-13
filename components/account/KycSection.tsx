import React, { useState } from 'react';
import { useUser } from '../../hooks/useUser';
import Button from '../cashier/ui/Button';
import { KycStatus } from '../../types';

const KycSection: React.FC = () => {
    const { user, updateKycStatus } = useUser();
    const [idFile, setIdFile] = useState<File | null>(null);
    const [proofFile, setProofFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (idFile && proofFile && user?.kycStatus === KycStatus.UNVERIFIED) {
            updateKycStatus(KycStatus.PENDING);
        }
    };
    
    if (!user) return null;

    if (user.kycStatus === KycStatus.VERIFIED) {
        return (
             <div className="text-center">
                <h2 className="text-2xl font-bold text-green-500 mb-4 uppercase">Cuenta Verificada</h2>
                <p className="text-gray-400">Tu identidad ha sido confirmada. Ya puedes realizar retiros.</p>
            </div>
        )
    }

     if (user.kycStatus === KycStatus.PENDING) {
        return (
             <div className="text-center">
                <h2 className="text-2xl font-bold text-cyan-400 mb-4 uppercase">Verificación Pendiente</h2>
                <p className="text-gray-400 mb-4">Estamos revisando tus documentos. Esto puede tardar hasta 24 horas.</p>
                <Button variant="secondary" onClick={() => updateKycStatus(KycStatus.VERIFIED)}>
                    Forzar Verificación (Simulación)
                </Button>
            </div>
        )
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 uppercase">Verificación (KYC)</h2>
            <p className="text-gray-400 mb-4 text-sm">Sube tus documentos para poder retirar tus ganancias. Es un requisito legal.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-cyan-400 mb-2">Identificación Oficial (INE, Pasaporte)</label>
                    <input type="file" onChange={e => setIdFile(e.target.files ? e.target.files[0] : null)} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700" required/>
                </div>
                 <div>
                    <label className="block text-sm font-bold text-cyan-400 mb-2">Comprobante de Domicilio</label>
                    <input type="file" onChange={e => setProofFile(e.target.files ? e.target.files[0] : null)} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700" required/>
                </div>
                <Button type="submit" variant="primary" className="w-full" disabled={!idFile || !proofFile}>
                    Enviar para Verificación
                </Button>
            </form>
        </div>
    );
};

export default KycSection;