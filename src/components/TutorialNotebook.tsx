import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TutorialStep } from '../types';
import { Song } from '../constants';
import { CheckCircle2, ChevronRight, BookOpen, Music, Minus, Maximize2, ZoomIn, ZoomOut, GripHorizontal } from 'lucide-react';

interface TutorialNotebookProps {
  step: TutorialStep;
  progress: number; // 0 to 1
  isCompleted: boolean;
  onNext: () => void;
  song?: Song | null;
  wrongHit?: boolean;
}

export const TutorialNotebook: React.FC<TutorialNotebookProps> = ({ step, progress, isCompleted, onNext, song, wrongHit }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [scale, setScale] = useState(1);

  const toggleMinimize = () => setIsMinimized(!isMinimized);
  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 1.5));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.7));

  return (
    <motion.div 
      drag
      dragMomentum={false}
      initial={{ x: 0, y: 0, opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute top-8 left-8 z-50"
      style={{ scale }}
    >
      <motion.div 
        animate={{ 
          width: isMinimized ? '120px' : '320px',
          height: isMinimized ? '48px' : 'auto',
          opacity: 1,
          x: wrongHit ? [0, -10, 10, -10, 10, 0] : 0,
          borderColor: wrongHit ? '#e74c3c' : '#34495e'
        }}
        transition={{ 
          x: { duration: 0.3 },
          borderColor: { duration: 0.2 },
          width: { type: 'spring', stiffness: 300, damping: 30 },
          height: { type: 'spring', stiffness: 300, damping: 30 }
        }}
        key={song?.id || step.id}
        className="bg-[#f5f5f0] text-[#2c3e50] rounded-lg shadow-2xl border-l-8 border-[#34495e] relative overflow-hidden flex flex-col"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#34495e]/5 border-b border-[#34495e]/10 cursor-move">
          <div className="flex items-center gap-2 text-[#34495e]/60">
            <GripHorizontal size={14} />
            {isMinimized && <span className="text-[10px] font-bold uppercase truncate">{song ? song.title : 'Guide'}</span>}
          </div>
          <div className="flex items-center gap-1">
            {!isMinimized && (
              <>
                <button onClick={zoomOut} className="p-1 hover:bg-black/5 rounded transition-colors text-[#34495e]/60" title="Zoom Out">
                  <ZoomOut size={14} />
                </button>
                <button onClick={zoomIn} className="p-1 hover:bg-black/5 rounded transition-colors text-[#34495e]/60" title="Zoom In">
                  <ZoomIn size={14} />
                </button>
              </>
            )}
            <button onClick={toggleMinimize} className="p-1 hover:bg-black/5 rounded transition-colors text-[#34495e]/60">
              {isMinimized ? <Maximize2 size={14} /> : <Minus size={14} />}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-6 relative"
            >
              {/* Notebook Lines */}
              <div className="absolute inset-0 pointer-events-none opacity-10" 
                   style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 1.5rem' }} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4 text-[#7f8c8d] border-b border-[#bdc3c7] pb-2">
                  <div className="flex items-center gap-2">
                    {song ? <Music size={18} /> : <BookOpen size={18} />}
                    <span className="text-xs uppercase tracking-widest font-bold">
                      {song ? 'Song Tutorial' : `Lesson ${step.id}`}
                    </span>
                  </div>
                  {song && (
                    <span className="text-[10px] font-bold bg-[#34495e] text-white px-2 py-0.5 rounded">
                      {song.bpm} BPM
                    </span>
                  )}
                </div>

                {song && (
                  <div className="mb-2">
                    <h3 className="text-sm font-black uppercase tracking-tighter text-[#34495e]">
                      {song.title}
                    </h3>
                    <p className="text-[10px] italic text-[#7f8c8d] mb-2">{song.artist}</p>
                  </div>
                )}

                <h2 className="text-xl font-bold mb-2 leading-tight italic">
                  {step.instruction}
                </h2>

                {step.cue && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-2 bg-blue-50 rounded border-l-4 border-blue-400"
                  >
                    <span className="text-blue-700 font-medium text-sm">🎵 {step.cue}</span>
                  </motion.div>
                )}

                <div className="flex flex-wrap gap-2 mb-6">
                  {step.visualHints.map((hint, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ 
                        scale: i < Math.floor(progress * step.targetSequence.length) ? 1.1 : 1,
                        opacity: i < Math.floor(progress * step.targetSequence.length) ? 1 : 0.5,
                        backgroundColor: i < Math.floor(progress * step.targetSequence.length) ? '#2ecc71' : '#ecf0f1'
                      }}
                      className={`h-10 px-2 flex items-center justify-center rounded border border-[#bdc3c7] font-mono font-bold shadow-sm ${hint.length > 1 ? 'min-w-[4rem] text-[10px]' : 'w-10 text-sm'}`}
                    >
                      {hint}
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="h-1 flex-1 bg-[#ecf0f1] rounded-full mr-4 overflow-hidden">
                    <motion.div 
                      className="h-full bg-[#3498db]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress * 100}%` }}
                    />
                  </div>
                  
                  <AnimatePresence>
                    {isCompleted && !song && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="flex flex-col items-center"
                      >
                        <motion.button
                          onClick={onNext}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-[#2ecc71] text-white p-2 rounded-full shadow-lg hover:bg-[#27ae60] transition-colors mb-1"
                        >
                          <ChevronRight size={24} />
                        </motion.button>
                        <span className="text-[10px] font-bold uppercase text-gray-400">Press Enter</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {isCompleted && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-[#27ae60] flex items-center gap-2 font-bold italic"
                >
                  <CheckCircle2 size={16} />
                  Perfect!
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
