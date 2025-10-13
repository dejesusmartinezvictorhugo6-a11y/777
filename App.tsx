
import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import GameLobby from './components/lobby/GameLobby';
import AccountView from './components/account/AccountView';
import AuthModal from './components/auth/AuthModal';
import CashierModal from './components/cashier/CashierModal';
import { useUser } from './hooks/useUser';
import VipView from './components/vip/VipView';
import { Game } from './types';
import MiniGameModal from './components/minigames/MiniGameModal';
import SplashScreen from './components/layout/SplashScreen';
import AIGameAnalysisModal from './components/ai/AIGameAnalysisModal';
import { useTutorial } from './hooks/useTutorial';
import TutorialGuide from './components/tutorial/TutorialGuide';
import { TUTORIAL_STEPS, GAMES } from './constants';

export enum View {
  LOBBY,
  ACCOUNT,
  VIP
}

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<View>(View.LOBBY);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isCashierModalOpen, setCashierModalOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const { user } = useUser();
  const { isTutorialActive, currentStepIndex } = useTutorial();

  const [isAnalysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [gameForAnalysis, setGameForAnalysis] = useState<Game | null>(null);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  // Handle tutorial side-effects
  useEffect(() => {
    if (!isTutorialActive) return;
    
    const step = TUTORIAL_STEPS[currentStepIndex];
    if (step.action?.type === 'OPEN_GAME' && step.action.gameId) {
        const gameToOpen = GAMES.find(g => g.id === step.action.gameId);
        if (gameToOpen) setActiveGame(gameToOpen);
    } else if (step.action?.type === 'CLOSE_GAME') {
        setActiveGame(null);
    }
  }, [currentStepIndex, isTutorialActive]);

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
  };
  
  const handleAnalysisSelect = (game: Game) => {
    setGameForAnalysis(game);
    setAnalysisModalOpen(true);
  };

  const renderView = () => {
    switch (activeView) {
      case View.ACCOUNT:
        return <AccountView />;
      case View.VIP:
        return <VipView />;
      case View.LOBBY:
      default:
        return <GameLobby onGameSelect={setActiveGame} onAnalysisSelect={handleAnalysisSelect} />;
    }
  };
  
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col font-orbitron animate-fade-in">
      <Header
        onNavigate={setActiveView}
        onAuthClick={() => setAuthModalOpen(true)}
        onCashierClick={() => setCashierModalOpen(true)}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {user ? renderView() : <GameLobby onGameSelect={setActiveGame} onAnalysisSelect={handleAnalysisSelect} />}
      </main>
      
      <Footer />

      {isAuthModalOpen && !user && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {isCashierModalOpen && user && (
        <CashierModal onClose={() => setCashierModalOpen(false)} />
      )}

      {activeGame && user && (
        <MiniGameModal 
          game={activeGame} 
          onClose={() => setActiveGame(null)} 
          onNavigate={setActiveView} 
        />
      )}
      
      {isAnalysisModalOpen && gameForAnalysis && (
        <AIGameAnalysisModal 
            game={gameForAnalysis} 
            onClose={() => {
                setAnalysisModalOpen(false);
                setGameForAnalysis(null);
            }} 
        />
      )}
      {isTutorialActive && <TutorialGuide />}
    </div>
  );
};

export default App;