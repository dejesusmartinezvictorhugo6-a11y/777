import React, { useState, useLayoutEffect } from 'react';
import { useTutorial } from '../../hooks/useTutorial';
import Button from '../cashier/ui/Button';

const TutorialGuide: React.FC = () => {
  const { isTutorialActive, currentStep, nextStep, endTutorial } = useTutorial();
  const [position, setPosition] = useState<{ top: number; left: number; width: number; height: number }>({ top: 0, left: 0, width: 0, height: 0 });
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    let element: HTMLElement | null = null;
    if (currentStep?.targetSelector) {
      element = document.querySelector(currentStep.targetSelector) as HTMLElement;
      setTargetElement(element);
      if (element) {
        const rect = element.getBoundingClientRect();
        setPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
        element.style.setProperty('z-index', '10001', 'important');
        element.style.setProperty('position', 'relative', 'important');
      }
    } else {
      setTargetElement(null);
    }

    return () => {
      if (element) {
        element.style.zIndex = '';
        element.style.position = '';
      }
    };
  }, [currentStep]);

  if (!isTutorialActive || !currentStep) {
    return null;
  }

  const getTooltipPosition = () => {
    if (!targetElement || currentStep.placement === 'center') {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'fixed' as const };
    }
    const tooltipWidth = 320; // approx width of tooltip
    const tooltipHeight = 180; // approx height
    const gap = 15;

    let top, left;

    switch (currentStep.placement) {
      case 'bottom':
        top = position.top + position.height + gap;
        left = position.left + position.width / 2 - tooltipWidth / 2;
        break;
      case 'top':
        top = position.top - tooltipHeight - gap;
        left = position.left + position.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = position.top + position.height / 2 - tooltipHeight / 2;
        left = position.left - tooltipWidth - gap;
        break;
      case 'right':
        top = position.top + position.height / 2 - tooltipHeight / 2;
        left = position.left + position.width + gap;
        break;
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'fixed' as const };
    }
    
    // Clamp values to be within viewport
    left = Math.max(8, Math.min(left, window.innerWidth - tooltipWidth - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - tooltipHeight - 8));


    return { top: `${top}px`, left: `${left}px`, position: 'fixed' as const };
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-[10000]"></div>
      {targetElement && (
        <div
          className="fixed border-4 border-dashed border-cyan-400 rounded-lg shadow-[0_0_25px_rgba(34,211,238,0.8)] transition-all duration-300 pointer-events-none"
          style={{ ...position, zIndex: 10001 }}
        ></div>
      )}
      <div
        className="bg-gray-900 border-2 border-cyan-500 rounded-lg shadow-lg p-6 w-80 z-[10002] animate-fade-in-up"
        style={getTooltipPosition()}
      >
        <h3 className="text-xl font-black text-cyan-400 mb-2">{currentStep.title}</h3>
        <p className="text-gray-300 mb-4 text-sm">{currentStep.content}</p>
        <div className="flex justify-between items-center">
          <Button onClick={endTutorial} variant="danger" className="!px-4 !py-1 !text-xs">Saltar</Button>
          <Button onClick={nextStep} variant="secondary" className="!px-4 !py-1 !text-xs">Siguiente</Button>
        </div>
      </div>
    </>
  );
};

export default TutorialGuide;
