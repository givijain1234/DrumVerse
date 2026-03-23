import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DrumKit } from './components/DrumKit';
import { TutorialNotebook } from './components/TutorialNotebook';
import { useAudio } from './hooks/useAudio';
import { DRUM_MAPPINGS, TUTORIAL_STEPS, CHALLENGES, FULL_TUTORIAL_STEPS, FAMOUS_SONGS, Song } from './constants';
import { DrumPartType, GameMode } from './types';
import { Play, Music, Settings, Trophy, HelpCircle, Volume2, Keyboard, Disc, Pause, SkipForward } from 'lucide-react';

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [activeDrum, setActiveDrum] = useState<DrumPartType | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userSequence, setUserSequence] = useState<DrumPartType[]>([]);
  const [mode, setMode] = useState<GameMode>('basic');
  const [showMenu, setShowMenu] = useState(true);
  const [showSongMenu, setShowSongMenu] = useState(true);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isSongPlaying, setIsSongPlaying] = useState(false);
  
  const [shake, setShake] = useState(false);
  const [wrongHit, setWrongHit] = useState(false);
  
  const { playDrum, playSong, stopSong } = useAudio();
  const steps = mode === 'advanced' ? CHALLENGES : FULL_TUTORIAL_STEPS;
  
  // Determine current step based on mode and selected song
  const currentStep = useMemo(() => {
    if (mode === 'free' && selectedSong) {
      return selectedSong.tutorials[currentStepIndex] || selectedSong.tutorials[0];
    }
    return steps[currentStepIndex] || steps[0];
  }, [mode, selectedSong, steps, currentStepIndex]);

  const isStepCompleted = userSequence.length >= currentStep.targetSequence.length;
  const progress = Math.min(userSequence.length / currentStep.targetSequence.length, 1);

  const handleDrumHit = useCallback((part: DrumPartType) => {
    playDrum(part);
    setActiveDrum(part);
    
    if (part === 'kick' || part === 'crash') {
      setShake(true);
      setTimeout(() => setShake(false), 100);
    }
    
    // Reset active drum after a short delay for animation
    setTimeout(() => setActiveDrum(null), 100);

    // Tutorial Logic
    if (isStarted && !showMenu && !isStepCompleted) {
      // In free mode, we only track tutorial if a song is selected
      if (mode === 'free' && !selectedSong) return;

      const expectedPart = currentStep.targetSequence[userSequence.length];
      if (part === expectedPart) {
        setUserSequence(prev => [...prev, part]);
        setWrongHit(false);
      } else {
        // Visual feedback for wrong hit
        setWrongHit(true);
        setTimeout(() => setWrongHit(false), 300);
        console.log('Wrong hit!');
      }
    }
  }, [playDrum, currentStep, userSequence, isStepCompleted, isStarted, showMenu, mode, selectedSong]);

  const nextStep = useCallback(() => {
    if (mode === 'free' && selectedSong) {
      // Loop through song tutorials
      if (currentStepIndex < selectedSong.tutorials.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        setCurrentStepIndex(0); // Loop back to first step of the song
      }
      setUserSequence([]);
      return;
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setUserSequence([]);
    } else {
      // All steps completed!
      alert(`Congratulations! You completed the ${mode} mode.`);
      setShowMenu(true);
      setCurrentStepIndex(0);
      setUserSequence([]);
    }
  }, [currentStepIndex, steps.length, mode, selectedSong]);

  // Reset tutorial when song changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setUserSequence([]);
    setWrongHit(false);
  }, [selectedSong]);

  // Auto-advance for song mode only (for flow)
  useEffect(() => {
    if (mode === 'free' && selectedSong && isStepCompleted) {
      const timer = setTimeout(() => {
        nextStep();
      }, 500); // Short delay for visual feedback
      return () => clearTimeout(timer);
    }
  }, [isStepCompleted, mode, selectedSong, nextStep]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isStarted || showMenu) return;
      
      const key = e.key.toLowerCase();
      
      // Handle Enter for next page - only in learning modes
      if (e.key === 'Enter' && isStepCompleted && mode !== 'free') {
        e.preventDefault();
        nextStep();
        return;
      }

      const part = DRUM_MAPPINGS[key];
      if (part) {
        e.preventDefault(); // Prevent space from scrolling or clicking focused buttons
        handleDrumHit(part);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStarted, showMenu, handleDrumHit, isStepCompleted, nextStep]);

  const startApp = (selectedMode: GameMode = 'basic') => {
    setMode(selectedMode);
    setIsStarted(true);
    setShowMenu(false);
    setShowSongMenu(true);
    setCurrentStepIndex(0);
    setUserSequence([]);
    if (selectedMode !== 'free') {
      stopSong();
      setIsSongPlaying(false);
      setSelectedSong(null);
    }
  };

  const toggleSong = (song: Song) => {
    if (selectedSong?.id === song.id && isSongPlaying) {
      stopSong();
      setIsSongPlaying(false);
      setSelectedSong(null);
      setUserSequence([]);
    } else {
      playSong(song.url);
      setSelectedSong(song);
      setIsSongPlaying(true);
      setUserSequence([]); // Reset tutorial for new song
      setShowSongMenu(false); // Close menu after selection
    }
  };

  return (
    <motion.div 
      animate={shake ? { x: [0, -5, 5, -5, 5, 0], y: [0, 5, -5, 5, -5, 0] } : {}}
      transition={{ duration: 0.1 }}
      className="relative w-full h-screen bg-black overflow-hidden font-sans text-white"
    >
      {/* 3D Scene */}
      <DrumKit activeDrum={activeDrum} />

      {/* Overlay UI */}
      <AnimatePresence>
        {showMenu && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <div className="max-w-md w-full p-8 text-center">
              <motion.h1 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="text-6xl font-black mb-2 tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
              >
                DRUMVERSE
              </motion.h1>
              <p className="text-gray-400 mb-12 uppercase tracking-widest text-sm font-bold">
                The Future of Rhythm Learning
              </p>

              <div className="space-y-4">
                <MenuButton 
                  icon={<Play size={20} />} 
                  label="Start Learning (100 Lessons)" 
                  onClick={() => startApp('basic')}
                  primary
                />
                <MenuButton 
                  icon={<Music size={20} />} 
                  label="Free Play & Songs" 
                  onClick={() => startApp('free')} 
                />
                <MenuButton 
                  icon={<Trophy size={20} />} 
                  label="Challenges" 
                  onClick={() => startApp('advanced')} 
                />
              </div>

              <div className="mt-12 flex justify-center gap-6 text-gray-500">
                <HelpCircle className="hover:text-white cursor-pointer transition-colors" />
                <Volume2 className="hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial Notebook */}
      {isStarted && !showMenu && (mode !== 'free' || selectedSong) && (
        <TutorialNotebook 
          step={currentStep} 
          progress={progress} 
          isCompleted={isStepCompleted}
          onNext={nextStep}
          song={mode === 'free' ? selectedSong : null}
          wrongHit={wrongHit}
        />
      )}

      {/* Free Play Song Menu */}
      {isStarted && !showMenu && mode === 'free' && showSongMenu && (
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          className="absolute top-8 left-8 w-64 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 max-h-[70vh] overflow-y-auto z-20"
        >
          <div className="flex items-center gap-2 mb-6">
            <Disc className={`text-cyan-400 ${isSongPlaying ? 'animate-spin-slow' : ''}`} />
            <h2 className="text-lg font-black uppercase tracking-tighter">Drum Along</h2>
          </div>
          
          <div className="space-y-3">
            {FAMOUS_SONGS.map(song => (
              <button
                key={song.id}
                onClick={() => toggleSong(song)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedSong?.id === song.id 
                    ? 'bg-cyan-500/20 border-cyan-500/50' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold truncate pr-2">{song.title}</span>
                  <span className={`text-[8px] uppercase px-1.5 py-0.5 rounded ${
                    song.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                    song.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {song.difficulty}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-400">{song.artist}</span>
                  {selectedSong?.id === song.id && isSongPlaying ? (
                    <Pause size={12} className="text-cyan-400" />
                  ) : (
                    <Play size={12} className="text-gray-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* HUD Controls */}
      {isStarted && !showMenu && (
        <div className="absolute bottom-8 left-8 flex gap-4">
          <button 
            onClick={() => { setShowMenu(true); stopSong(); setIsSongPlaying(false); }}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 transition-all uppercase text-xs font-bold tracking-widest"
          >
            Menu
          </button>
          {mode === 'free' && (
            <button 
              onClick={() => setShowSongMenu(!showSongMenu)}
              className={`px-6 py-2 backdrop-blur-md rounded-full border transition-all uppercase text-xs font-bold tracking-widest ${
                showSongMenu ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-white/10 hover:bg-white/20 border-white/20'
              }`}
            >
              {showSongMenu ? 'Close Songs' : 'Change Song'}
            </button>
          )}
          <div className="px-6 py-2 bg-cyan-500/20 backdrop-blur-md rounded-full border border-cyan-500/50 flex items-center gap-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-tighter">BPM</span>
            <span className="text-xl font-black">120</span>
          </div>
        </div>
      )}

      {/* Key Mapping Legend */}
      {isStarted && !showMenu && (
        <div className="absolute bottom-8 right-8 flex gap-2">
          {Object.entries(DRUM_MAPPINGS).map(([key, part]) => (
            <div key={key} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded border border-white/20 font-mono font-bold text-xs">
                {key === ' ' ? 'SPC' : key.toUpperCase()}
              </div>
              <span className="text-[10px] uppercase text-gray-500 font-bold tracking-tighter">{part}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function MenuButton({ icon, label, onClick, primary = false, disabled = false }: { 
  icon: React.ReactNode, 
  label: string, 
  onClick?: () => void,
  primary?: boolean,
  disabled?: boolean
}) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, x: 5 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
        disabled ? 'opacity-30 cursor-not-allowed border-white/10 text-gray-600' :
        primary ? 'bg-white text-black border-white font-bold' : 
        'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
      }`}
    >
      <span className={primary ? 'text-black' : 'text-cyan-400'}>{icon}</span>
      <span className="uppercase tracking-widest text-sm font-bold">{label}</span>
    </motion.button>
  );
}
