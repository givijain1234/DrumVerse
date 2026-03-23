import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DrumPartType } from '../types';
import { DRUM_COLORS } from '../constants';
import { ResonanceEffect } from './ResonanceEffect';

interface DrumPartProps {
  type: DrumPartType;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  isHit: boolean;
}

export const DrumPart: React.FC<DrumPartProps> = ({ type, position, rotation = [0, 0, 0], scale = [1, 1, 1], isHit }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const [vibration, setVibration] = useState(0);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smoothly return to original scale
      groupRef.current.scale.lerp(new THREE.Vector3(...scale), 0.15);
      
      // Animation when hit
      if (isHit) {
        groupRef.current.scale.set(scale[0] * 1.1, scale[1] * 0.9, scale[2] * 1.1);
        setVibration(0.1);
      } else {
        setVibration(prev => Math.max(0, prev - delta * 0.5));
      }

      // Vibration effect
      if (vibration > 0) {
        const time = state.clock.getElapsedTime();
        const offset = Math.sin(time * 60) * vibration;
        groupRef.current.position.y = position[1] + offset;
        
        // Subtle rotational vibration
        groupRef.current.rotation.x = rotation[0] + Math.cos(time * 50) * vibration * 0.2;
        groupRef.current.rotation.z = rotation[2] + Math.sin(time * 40) * vibration * 0.2;
      } else {
        groupRef.current.position.y = position[1];
        groupRef.current.rotation.x = rotation[0];
        groupRef.current.rotation.z = rotation[2];
      }
    }

    if (glowRef.current) {
      glowRef.current.intensity = THREE.MathUtils.lerp(glowRef.current.intensity, isHit ? 5 : 0, 0.2);
    }
  });

  const getGeometry = () => {
    switch (type) {
      case 'kick':
        return <cylinderGeometry args={[1.2, 1.2, 1.5, 32]} />;
      case 'snare':
        return <cylinderGeometry args={[0.8, 0.8, 0.4, 32]} />;
      case 'hihat':
        return <cylinderGeometry args={[0.6, 0.6, 0.05, 32]} />;
      case 'tom':
        return <cylinderGeometry args={[0.7, 0.7, 0.6, 32]} />;
      case 'crash':
        return <cylinderGeometry args={[1, 1, 0.05, 32]} />;
      default:
        return <boxGeometry />;
    }
  };

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <ResonanceEffect active={isHit} color={DRUM_COLORS[type]} position={[0, type === 'kick' ? 0.8 : 0.2, 0]} />
      <mesh ref={meshRef}>
        {getGeometry()}
        <meshStandardMaterial 
          color={isHit ? DRUM_COLORS[type] : '#333'} 
          emissive={DRUM_COLORS[type]}
          emissiveIntensity={isHit ? 2 : 0.2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Drum Head (Top Surface) */}
      {type !== 'crash' && type !== 'hihat' && (
        <mesh position={[0, type === 'kick' ? 0.76 : 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[type === 'kick' ? 1.18 : (type === 'snare' ? 0.78 : 0.68), 32]} />
          <meshStandardMaterial 
            color={isHit ? '#fff' : '#eee'} 
            roughness={0.4} 
            metalness={0.1} 
            emissive={DRUM_COLORS[type]}
            emissiveIntensity={isHit ? 0.5 : 0}
          />
        </mesh>
      )}
      <pointLight ref={glowRef} color={DRUM_COLORS[type]} distance={5} intensity={0} />
      
      {/* Drum Rim / Hardware */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[type === 'kick' ? 1.25 : (type === 'snare' ? 0.85 : 0.75), 0.05, 16, 32]} />
        <meshStandardMaterial color="#888" metalness={1} roughness={0.1} />
      </mesh>
    </group>
  );
};
