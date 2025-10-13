
import { Game, GameCategory, VipTier, Currency, TutorialStep } from './types';

export const GAMES: Game[] = [
  { id: 'slot1', name: 'Gates of Inferno', category: GameCategory.SLOTS, image: 'https://picsum.photos/seed/slot1/400/600', is666: true, gameType: 'slot', description: 'Una máquina tragamonedas con temática demoníaca que ofrece pagos volátiles y la oportunidad de ganar el favor de los señores oscuros.', musicUrl: 'https://cdn.pixabay.com/audio/2022/08/04/audio_3c383f2743.mp3' },
  { id: 'slot2', name: 'Cyberpunk Spins', category: GameCategory.SLOTS, image: 'https://picsum.photos/seed/slot2/400/600', is666: false, gameType: 'slot', description: 'Giros de neón en una distopía cyberpunk. Los símbolos de alta tecnología y los giros gratis son tu única esperanza en esta ciudad controlada por corporaciones.' },
  { id: 'slot3', name: 'Neon Samurai', category: GameCategory.SLOTS, image: 'https://picsum.photos/seed/slot3/400/600', is666: false, gameType: 'iframe', iframeUrl: 'https://play.idev.games/embed/subway-surfers', description: 'Un juego de habilidad y reflejos de un samurái cibernético que corre por tejados de neón, luchando por honor en un mundo sin él.' },
  { id: 'slot4', name: '666 Megaways', category: GameCategory.SLOTS, image: 'https://picsum.photos/seed/slot4/400/600', is666: true, gameType: 'slot', description: 'El número de la bestia potencia miles de formas de ganar. Cada giro cambia la configuración, ofreciendo un caos de pagos impredecible.' },
  { id: 'table1', name: 'Devil\'s Roulette', category: GameCategory.TABLE, image: 'https://picsum.photos/seed/table1/400/600', is666: false, gameType: 'roulette', description: 'Una ruleta clásica con un giro. ¿Apostarás al rojo, al negro o al número de la bestia?', musicUrl: 'https://cdn.pixabay.com/audio/2022/11/22/audio_198c697a76.mp3' },
  { id: 'table2', name: 'Roulette of Ruin', category: GameCategory.TABLE, image: 'https://picsum.photos/seed/table2/400/600', is666: true, gameType: 'roulette', description: 'Esta ruleta está maldita. Los premios son más altos, pero cada pérdida te acerca un poco más a la perdición.' },
  { id: 'live1', name: 'Live Baccarat Hellfire', category: GameCategory.LIVE, image: 'https://picsum.photos/seed/live1/400/600', is666: false, gameType: 'static', description: 'Juega baccarat con un crupier en vivo directamente desde las fosas de fuego. Siente el calor de la competencia en tiempo real.' },
  { id: 'live2', name: 'Reaper\'s Roulette', category: GameCategory.LIVE, image: 'https://picsum.photos/seed/live2/400/600', is666: true, gameType: 'roulette', description: 'La Parca misma hace girar la rueda. Una experiencia de ruleta en vivo donde cada apuesta se siente como la última.' },
  { id: 'jackpot1', name: 'Hades\' Hoard', category: GameCategory.JACKPOTS, image: 'https://picsum.photos/seed/jackpot1/400/600', is666: true, gameType: 'iframe', iframeUrl: 'https://html5games.com/Game/Stack-Colors/e50937a0-a43b-4860-b67f-5603e14a2f81', description: 'Un juego de habilidad donde se apilan tesoros robados del inframundo. El tesoro de Hades espera a aquel con el pulso más firme.' },
  { id: 'jackpot2', name: 'Pandora\'s Box Jackpot', category: GameCategory.JACKPOTS, image: 'https://picsum.photos/seed/jackpot2/400/600', is666: false, gameType: 'static', description: 'Abre la caja para liberar ya sea una inmensa fortuna o todos los males del mundo. Un jackpot progresivo que crece con la desesperación de cada jugador.' },
];

export const CURRENCY_RATES: Record<Currency, { rate: number; symbol: string; name: string; }> = {
    'USD': { rate: 1, symbol: '$', name: 'US Dollar' },
    'EUR': { rate: 1.08, symbol: '€', name: 'Euro' },
    'MXN': { rate: 0.059, symbol: '$', name: 'Peso Mexicano' },
    'JPY': { rate: 0.0064, symbol: '¥', name: 'Yen Japonés' }
};

export interface VipTierInfo {
    level: VipTier;
    pointsRequired: number;
    benefits: string[];
}

export const VIP_TIERS: VipTierInfo[] = [
    {
        level: VipTier.NEOPHYTE,
        pointsRequired: 0,
        benefits: ["Acceso al Club", "Soporte Estándar"],
    },
    {
        level: VipTier.ACOLYTE,
        pointsRequired: 5000,
        benefits: ["Bono de Nivel de $50", "5% Cashback Semanal"],
    },
    {
        level: VipTier.DEMON,
        pointsRequired: 25000,
        benefits: ["Bono de Nivel de $250", "10% Cashback Semanal", "Retiros Prioritarios"],
    },
    {
        level: VipTier.ARCHDEMON,
        pointsRequired: 100000,
        benefits: ["Bono de Nivel de $1000", "15% Cashback Semanal", "Gestor de Cuenta VIP Personal", "Regalos Exclusivos"],
    },
];

export const TUTORIAL_STEPS: TutorialStep[] = [
    {
        id: 'welcome',
        title: '¡Bienvenido a Vector\'s 666 Casino!',
        content: 'Soy Vector, tu anfitrión demoníaco. Permíteme mostrarte cómo funcionan las cosas en mi dominio. Sigue mis instrucciones para aprender a jugar y ganar... si te atreves.',
        placement: 'center',
    },
    {
        id: 'balance',
        title: 'Tu Riqueza (o tu Deuda)',
        content: 'Aquí verás tu saldo total. Comienzas con un generoso "préstamo". No lo desperdicies.',
        targetSelector: '#user-balance-display',
        placement: 'bottom',
    },
    {
        id: 'cashier',
        title: 'El Cajero',
        content: 'Si tus fondos se agotan y quieres seguir tentando al destino, aquí es donde puedes depositar más. El primer depósito tiene una bonificación infernal.',
        targetSelector: '#cashier-button',
        placement: 'bottom',
    },
    {
        id: 'lobby',
        title: 'El Lobby de Juegos',
        content: 'Este es tu campo de batalla. Hay diferentes juegos esperándote. Empecemos con algo simple pero volátil.',
        targetSelector: '#game-card-slot1',
        placement: 'bottom',
    },
    {
        id: 'open-game',
        title: 'Entra al Infierno',
        content: 'Este es "Gates of Inferno". Un clásico. Haz clic en "Siguiente" y te abriré las puertas.',
        targetSelector: '#game-card-slot1',
        placement: 'bottom',
        action: { type: 'OPEN_GAME', gameId: 'slot1' },
    },
    {
        id: 'select-bet',
        title: 'Elige tu Sacrificio',
        content: 'Toda recompensa requiere un riesgo. Selecciona tu apuesta aquí. A mayor apuesta, mayor puede ser la gloria... o la ruina.',
        targetSelector: '#bet-level-selector',
        placement: 'top',
    },
    {
        id: 'spin',
        title: 'Gira la Rueda del Destino',
        content: 'Cuando estés listo para probar tu suerte, presiona este botón. No hay vuelta atrás.',
        targetSelector: '#spin-button',
        placement: 'top',
    },
    {
        id: 'close-game',
        title: 'Escapa... por ahora',
        content: 'Puedes cerrar el juego desde la barra de herramientas inferior cuando hayas terminado (o te hayas quedado sin dinero).',
        targetSelector: '#game-toolbar-close',
        placement: 'bottom',
    },
    {
        id: 'end',
        title: 'El Tutorial ha Terminado',
        content: 'Ahora conoces lo básico. El resto depende de ti y de la suerte. Recuerda, la casa siempre tiene un as bajo la manga. Buena suerte, la necesitarás.',
        placement: 'center',
    },
];