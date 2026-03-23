import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars, Float } from '@react-three/drei';
import { DrumPart } from './DrumPart';
import { Drumsticks } from './Drumsticks';
import { FootPedal } from './FootPedal';
import { Leg } from './Leg';
import { DrumPartType } from '../types';

interface DrumKitProps {
  activeDrum: DrumPartType | null;
}

export const DrumKit: React.FC<DrumKitProps> = ({ activeDrum }) => {
  return (
    <div className="w-full h-full bg-black">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 5, 8]} fov={50} />
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 6} 
          maxPolarAngle={Math.PI / 2} 
          minDistance={5}
          maxDistance={15}
        />
        
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} color="purple" intensity={1} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="night" />

        <group position={[0, -1, 0]}>
          <Drumsticks activeDrum={activeDrum} />
          
          {/* Kick Drum */}
          <DrumPart 
            type="kick" 
            position={[0, 0.5, 0]} 
            rotation={[Math.PI / 2, 0, 0]} 
            isHit={activeDrum === 'kick'} 
          />

          {/* Foot Pedal & Leg Visualization */}
          <FootPedal 
            isHit={activeDrum === 'kick'} 
            position={[0.2, 0, 1.2]} 
          />
          
          <Leg 
            isHit={activeDrum === 'kick'} 
            position={[0.2, 1.5, 2.5]} 
          />
          
          {/* Snare */}
          <DrumPart 
            type="snare" 
            position={[-1.5, 1.2, 1]} 
            rotation={[0.1, 0, 0]} 
            isHit={activeDrum === 'snare'} 
          />
          
          {/* Hi-Hat */}
          <DrumPart 
            type="hihat" 
            position={[-2.5, 1.8, 0.5]} 
            isHit={activeDrum === 'hihat'} 
          />
          
          {/* Tom */}
          <DrumPart 
            type="tom" 
            position={[1.5, 1.8, -0.5]} 
            isHit={activeDrum === 'tom'} 
          />
          
          {/* Crash Cymbal */}
          <DrumPart 
            type="crash" 
            position={[2.5, 2.5, -1]} 
            rotation={[-0.2, 0, 0.2]} 
            isHit={activeDrum === 'crash'} 
          />

          {/* Floor / Stage */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#111" roughness={0.5} metalness={0.2} />
          </mesh>
          
          {/* Grid lines for aesthetic */}
          <gridHelper args={[20, 20, '#333', '#222']} position={[0, -0.49, 0]} />
        </group>
      </Canvas>
    </div>
  );
};
