import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  isMuted: boolean;
  isInitialized: boolean;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  
  // Control functions
  initAudio: () => void;
  toggleMute: () => void;
  playDiceRoll: () => void;
  playCardSelect: () => void;
  playCardPlay: () => void;
  playWin: () => void;
  playGameStart: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  isMuted: typeof window !== 'undefined' ? localStorage.getItem('audio-muted') === 'true' : true,
  isInitialized: false,
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  
  initAudio: () => {
    const { isInitialized } = get();
    if (isInitialized) return;
    
    try {
      const backgroundMusic = new Audio('/sounds/background.mp3');
      const hitSound = new Audio('/sounds/hit.mp3');
      const successSound = new Audio('/sounds/success.mp3');
      
      backgroundMusic.loop = true;
      backgroundMusic.volume = 0.3;
      hitSound.volume = 0.5;
      successSound.volume = 0.6;
      
      set({
        backgroundMusic,
        hitSound,
        successSound,
        isInitialized: true
      });
      
      console.log('Audio initialized');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  },
  
  toggleMute: () => {
    const { isMuted, backgroundMusic } = get();
    const newMutedState = !isMuted;
    
    set({ isMuted: newMutedState });
    
    // Persist mute state in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('audio-muted', String(newMutedState));
    }
    
    if (backgroundMusic) {
      if (newMutedState) {
        backgroundMusic.pause();
      } else {
        backgroundMusic.play().catch(console.log);
      }
    }
    
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  playDiceRoll: () => {
    const { hitSound, isMuted } = get();
    if (hitSound && !isMuted) {
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.4;
      soundClone.play().catch(error => {
        console.log("Dice roll sound prevented:", error);
      });
    }
  },
  
  playCardSelect: () => {
    const { hitSound, isMuted } = get();
    if (hitSound && !isMuted) {
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.2;
      soundClone.playbackRate = 1.5;
      soundClone.play().catch(error => {
        console.log("Card select sound prevented:", error);
      });
    }
  },
  
  playCardPlay: () => {
    const { hitSound, isMuted } = get();
    if (hitSound && !isMuted) {
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(error => {
        console.log("Card play sound prevented:", error);
      });
    }
  },
  
  playWin: () => {
    const { successSound, isMuted } = get();
    if (successSound && !isMuted) {
      successSound.currentTime = 0;
      successSound.play().catch(error => {
        console.log("Win sound prevented:", error);
      });
    }
  },
  
  playGameStart: () => {
    const { backgroundMusic, isMuted } = get();
    if (backgroundMusic && !isMuted) {
      backgroundMusic.currentTime = 0;
      backgroundMusic.play().catch(error => {
        console.log("Background music prevented:", error);
      });
    }
  }
}));
