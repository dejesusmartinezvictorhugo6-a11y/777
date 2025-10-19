import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { TutorialStep } from '../types';
import { TUTORIAL_STEPS } from '../constants';

interface TutorialContextType {
  isTutorialActive: boolean;
  currentStepIndex: number;
  currentStep: TutorialStep | null;
  startTutorial: () => void;
  endTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
}

export const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

interface TutorialProviderProps {
  children: ReactNode;
}

export const TutorialProvider: React.FC<TutorialProviderProps> = ({ children }) => {
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const startTutorial = useCallback(() => {
    setCurrentStepIndex(0);
    setIsTutorialActive(true);
  }, []);
  
  const endTutorial = useCallback(() => {
    setIsTutorialActive(false);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < TUTORIAL_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      endTutorial();
    }
  }, [currentStepIndex, endTutorial]);
  
  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < TUTORIAL_STEPS.length) {
      setCurrentStepIndex(index);
    }
  }, []);

  const currentStep = isTutorialActive ? TUTORIAL_STEPS[currentStepIndex] : null;

  const value = {
    isTutorialActive,
    currentStepIndex,
    currentStep,
    startTutorial,
    endTutorial,
    nextStep,
    prevStep,
    goToStep,
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    {/* FIX: Corrected typo in closing tag from TutorialTutorialContext to TutorialContext */}
    </TutorialContext.Provider>
  );
};