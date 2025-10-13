
import React from 'react';
import { useUser } from '../../hooks/useUser';
import { VIP_TIERS } from '../../constants';
import VipProgress from './VipProgress';
import VipTierCard from './VipTierCard';
import Button from '../cashier/ui/Button';

const VipView: React.FC = () => {
    const { addVipPoints } = useUser();

    const simulateActivity = () => {
        // Add between 1000 and 2500 points
        const points = Math.floor(Math.random() * 1501) + 1000;
        addVipPoints(points);
    };

    return (
        <div className="space-y-12">
            <div className="text-center">
                <h1 className="text-5xl font-black text-red-500 uppercase">Club 666</h1>
                <p className="text-gray-400 text-lg">Lealtad infernal, recompensas divinas.</p>
            </div>

            <VipProgress />

            <div className="text-center">
                <p className="text-gray-400 mb-2">Gana 1 Punto Infernal por cada $1 apostado en cualquier juego.</p>
                <Button onClick={simulateActivity} variant="secondary">
                    Simular Actividad (+1000-2500 Puntos)
                </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {VIP_TIERS.map(tier => (
                    <VipTierCard key={tier.level} tier={tier} />
                ))}
            </div>
        </div>
    );
};

export default VipView;