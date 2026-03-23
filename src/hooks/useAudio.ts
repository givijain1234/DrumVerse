import { useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import { DrumPartType } from '../types';

const SAMPLE_URLS: Record<DrumPartType, string> = {
  kick: 'https://tonejs.github.io/audio/drum-samples/CR78/kick.mp3',
  snare: 'https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3',
  hihat: 'https://tonejs.github.io/audio/drum-samples/CR78/hihat.mp3',
  tom: 'https://tonejs.github.io/audio/drum-samples/CR78/tom1.mp3',
  crash: 'https://tonejs.github.io/audio/drum-samples/CR78/crash.mp3',
};

export function useAudio() {
  const playersRef = useRef<Tone.Players | null>(null);

  useEffect(() => {
    playersRef.current = new Tone.Players({
      urls: SAMPLE_URLS,
      onload: () => {
        console.log('Drum samples loaded');
      },
    }).toDestination();

    return () => {
      playersRef.current?.dispose();
    };
  }, []);

  const playDrum = useCallback(async (part: DrumPartType) => {
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
    const player = playersRef.current?.player(part);
    if (player) {
      player.start();
    }
  }, []);

  const songPlayerRef = useRef<Tone.Player | null>(null);

  const playSong = useCallback(async (url: string) => {
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
    
    if (songPlayerRef.current) {
      songPlayerRef.current.stop();
      songPlayerRef.current.dispose();
    }

    songPlayerRef.current = new Tone.Player(url).toDestination();
    songPlayerRef.current.autostart = true;
    songPlayerRef.current.loop = true;
  }, []);

  const stopSong = useCallback(() => {
    songPlayerRef.current?.stop();
  }, []);

  return { playDrum, playSong, stopSong };
}
