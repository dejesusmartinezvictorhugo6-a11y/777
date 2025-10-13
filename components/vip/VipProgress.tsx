
import React from 'react';
import { useUser } from '../../hooks/useUser';
import { VIP_TIERS } from '../../constants';

const VipProgress: React.FC = () => {
    const { user } = useUser();

    if (!user) return null;

    const currentTierIndex = VIP_TIERS.findIndex(t => t.level === user.vipTier);
    const nextTier = currentTierIndex < VIP_TIERS.length - 1 ? VIP_TIERS[currentTierIndex + 1] : null;

    const pointsForCurrentTier = VIP_TIERS[currentTierIndex].pointsRequired;
    const pointsForNextTier = nextTier ? nextTier.pointsRequired : user.vipPoints;
    
    const progressPercentage = nextTier
        ? Math.min(((user.vipPoints - pointsForCurrentTier) / (pointsForNextTier - pointsForCurrentTier)) * 100, 100)
        : 100;

    return (
        <div className="bg-gray-900/50 border-2 border-cyan-500 rounded-lg p-6 shadow-[0_0_20px_rgba(34,211,238,0.4)] text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 uppercase tracking-wider">Tu Progreso VIP</h2>
            <p className="text-lg text-white mb-1">Nivel Actual: <span className="font-black text-red-500">{user.vipTier}</span></p>
            <p className="text-lg text-white mb-4">Puntos Infernales: <span className="font-black">{user.vipPoints.toLocaleString()}</span></p>

            <div className="w-full bg-gray-700 rounded-full h-4 mb-2 border-2 border-gray-600">
                <div
                    className="bg-gradient-to-r from-red-500 to-yellow-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
            
            {nextTier ? (
                 <p className="text-sm text-gray-400">
                    Siguiente Nivel: <span className="font-bold text-white">{nextTier.level}</span> en <span className="font-bold text-white">{nextTier.pointsRequired.toLocaleString()}</span> puntos.
                 </p>
            ) : (
                <p className="font-bold text-yellow-400">¡Has alcanzado el nivel máximo!</p>
            )}
        </div>
    );
};

export default VipProgress;
