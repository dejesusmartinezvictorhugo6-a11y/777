
import React from 'react';
import { useUser } from '../../hooks/useUser';
import { VipTierInfo, VIP_TIERS } from '../../constants';
import { CheckCircleIcon } from '../cashier/ui/Icons';

interface VipTierCardProps {
  tier: VipTierInfo;
}

const VipTierCard: React.FC<VipTierCardProps> = ({ tier }) => {
  const { user } = useUser();
  const isCurrentTier = user?.vipTier === tier.level;
  const isUnlocked = user ? user.vipPoints >= tier.pointsRequired : false;

  const cardClasses = `
    bg-gray-900 border-2 rounded-lg p-6 flex flex-col h-full transition-all duration-300
    ${isCurrentTier ? 'border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.6)] transform scale-105' : ''}
    ${!isUnlocked && !isCurrentTier ? 'border-gray-800 opacity-60' : 'border-gray-700'}
  `;

  return (
    <div className={cardClasses}>
      <h3 className={`text-2xl font-black uppercase tracking-wider mb-2 ${isUnlocked || isCurrentTier ? 'text-cyan-400' : 'text-gray-500'}`}>{tier.level}</h3>
      <p className={`font-bold mb-4 ${isUnlocked || isCurrentTier ? 'text-white' : 'text-gray-400'}`}>{tier.pointsRequired.toLocaleString()} Puntos</p>
      <ul className="space-y-2 text-gray-300 flex-grow">
        {tier.benefits.map((benefit, index) => (
          <li key={index} className="flex items-start">
            <CheckCircleIcon className={`h-5 w-5 mr-2 mt-0.5 flex-shrink-0 ${isUnlocked || isCurrentTier ? 'text-green-500' : 'text-gray-600'}`} />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
      {isCurrentTier && <div className="mt-4 text-center text-red-500 font-bold uppercase">Tu Nivel Actual</div>}
    </div>
  );
};

export default VipTierCard;