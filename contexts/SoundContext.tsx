
import React, { createContext, useState, ReactNode, useRef, useEffect, useCallback } from 'react';

interface SoundContextType {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  setMasterVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  playMusic: (src: string) => void;
  stopMusic: () => void;
  playSoundEffect: (src: string) => void;
}

export const SoundContext = createContext<SoundContextType | undefined>(undefined);

interface SoundProviderProps {
  children: ReactNode;
}

export const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
  const [masterVolume, setMasterVolume] = useState(0.5);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [sfxVolume, setSfxVolume] = useState(0.8);
  
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);

  const playMusic = useCallback((src: string) => {
    if (musicAudioRef.current) {
        // If the same music is already assigned, don't restart it.
        if (musicAudioRef.current.src && musicAudioRef.current.src.endsWith(src)) {
            return;
        }
        musicAudioRef.current.pause();
    }
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = masterVolume * musicVolume;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(e => console.error("Error playing music:", e));
    }
    musicAudioRef.current = audio;
  }, [masterVolume, musicVolume]);

  const stopMusic = useCallback(() => {
    if (musicAudioRef.current) {
      musicAudioRef.current.pause();
      musicAudioRef.current = null;
    }
  }, []);
  
  const playSoundEffect = useCallback((src: string) => {
    const audio = new Audio(src);
    audio.volume = masterVolume * sfxVolume;
    audio.play().catch(e => console.error("Error playing SFX:", e));
  }, [masterVolume, sfxVolume]);
  
  useEffect(() => {
    if (musicAudioRef.current) {
      musicAudioRef.current.volume = masterVolume * musicVolume;
    }
  }, [masterVolume, musicVolume]);
  
  const value = {
    masterVolume,
    musicVolume,
    sfxVolume,
    setMasterVolume,
    setMusicVolume,
    setSfxVolume,
    playMusic,
    stopMusic,
    playSoundEffect,
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};
