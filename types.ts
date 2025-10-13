
export enum GameCategory {
  SLOTS = "Tragamonedas del Infierno",
  TABLE = "Mesas del Diablo",
  LIVE = "Casino en Vivo",
  JACKPOTS = "Jackpots Progresivos",
}

export type GameType = 'slot' | 'roulette' | 'static' | 'iframe';

export interface Game {
  id: string;
  name: string;
  category: GameCategory;
  image: string;
  is666: boolean;
  gameType: GameType;
  description: string;
  iframeUrl?: string;
  musicUrl?: string;
}

export enum KycStatus {
  UNVERIFIED = "No Verificado",
  PENDING = "Pendiente",
  VERIFIED = "Verificado",
}

export enum VipTier {
  NEOPHYTE = "Neófito Infernal",
  ACOLYTE = "Acólito de la Llama",
  DEMON = "Demonio de Élite",
  ARCHDEMON = "Archidemonio Soberano",
}

export interface User {
  email: string;
  balance: number;
  bonusBalance: number;
  kycStatus: KycStatus;
  vipTier: VipTier;
  vipPoints: number;
}

export enum TransactionType {
    DEPOSIT = "Depósito",
    WITHDRAWAL = "Retiro"
}

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    date: Date;
    status: 'Completed' | 'Pending';
}

export type Currency = 'USD' | 'EUR' | 'MXN' | 'JPY';

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  targetSelector?: string; // CSS selector for the element to highlight
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: {
    type: 'OPEN_GAME' | 'CLOSE_GAME';
    gameId?: string;
  }
}