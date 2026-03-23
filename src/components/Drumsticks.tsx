import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DrumPartType } from '../types';

interface DrumsticksProps {
  activeDrum: DrumPartType | null;
}

const DRUM_POSITIONS: Record<DrumPartType, [number, number, number]> = {
  kick: [0, 0.5, 0], // Not hit by sticks
  snare: [-1.5, 1.2, 1],
  hihat: [-2.5, 1.8, 0.5],
  tom: [1.5, 1.8, -0.5],
  crash: [2.5, 2.5, -1],
};

export const Drumsticks: React.FC<DrumsticksProps> = ({ activeDrum }) => {
  const leftStickRef = useRef<THREE.Group>(null);
  const rightStickRef = useRef<THREE.Group>(null);
  
  // Track hit states for animation curves
  const leftHitTime = useRef(0);
  const rightHitTime = useRef(0);
  const lastActiveDrum = useRef<DrumPartType | null>(null);

  // Idle positions
  const leftIdle: [number, number, number] = [-1.2, 2.2, 2.5];
  const rightIdle: [number, number, number] = [1.2, 2.2, 2.5];

  useEffect(() => {
    if (activeDrum && activeDrum !== 'kick') {
      const drumPos = DRUM_POSITIONS[activeDrum];
      // Decide which hand hits based on position
      if (drumPos[0] < 0) {
        leftHitTime.current = performance.now();
      } else {
        rightHitTime.current = performance.now();
      }
      lastActiveDrum.current = activeDrum;
    }
  }, [activeDrum]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const now = performance.now();

    if (!leftStickRef.current || !rightStickRef.current) return;

    // Helper to animate a stick
    const animateStick = (
      ref: React.RefObject<THREE.Group>,
      idlePos: [number, number, number],
      hitTime: number,
      isLeft: boolean
    ) => {
      if (!ref.current) return;

      const targetPos = new THREE.Vector3(...idlePos);
      const targetRot = new THREE.Euler(Math.PI / 2.5, 0, isLeft ? 0.2 : -0.2);

      // Idle floating
      targetPos.y += Math.sin(time * 1.5 + (isLeft ? 0 : Math.PI)) * 0.05;
      targetPos.x += Math.cos(time * 1.0) * 0.02;

      const timeSinceHit = (now - hitTime) / 1000;
      const hitDuration = 0.25; // seconds

      if (timeSinceHit < hitDuration && lastActiveDrum.current && lastActiveDrum.current !== 'kick') {
        const drumPos = new THREE.Vector3(...DRUM_POSITIONS[lastActiveDrum.current]);
        
        // Animation curve: 0 -> 1 (hit) -> 0 (back)
        // We use a quick snap down and slower return
        let progress = 0;
        if (timeSinceHit < hitDuration * 0.3) {
          // Snap down
          progress = timeSinceHit / (hitDuration * 0.3);
          progress = Math.pow(progress, 2);
        } else {
          // Return
          progress = 1 - (timeSinceHit - hitDuration * 0.3) / (hitDuration * 0.7);
          progress = Math.pow(progress, 0.5);
        }

        // Interpolate position
        targetPos.lerp(drumPos, progress);
        // Offset slightly above drum surface
        targetPos.y += 0.1 * progress;

        // Point at drum
        const lookTarget = drumPos.clone();
        ref.current.lookAt(lookTarget);
        ref.current.rotateX(Math.PI / 2);
      } else {
        // Smoothly return to idle rotation
        const currentRot = ref.current.rotation.clone();
        ref.current.rotation.set(
          THREE.MathUtils.lerp(currentRot.x, targetRot.x, 0.1),
          THREE.MathUtils.lerp(currentRot.y, targetRot.y, 0.1),
          THREE.MathUtils.lerp(currentRot.z, targetRot.z, 0.1)
        );
      }

      // Smoothly move to target position
      ref.current.position.lerp(targetPos, 0.2);
    };

    animateStick(leftStickRef, leftIdle, leftHitTime.current, true);
    animateStick(rightStickRef, rightIdle, rightHitTime.current, false);
  });

  const StickGeometry = () => (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.015, 0.03, 1.4, 12]} />
        <meshStandardMaterial color="#e3c9a6" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Grip area */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.032, 0.032, 0.4, 12]} />
        <meshStandardMaterial color="#222" roughness={0.9} />
      </mesh>
      {/* Tip */}
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color="#e3c9a6" />
      </mesh>
    </group>
  );

  return (
    <group>
      <group ref={leftStickRef}>
        <StickGeometry />
      </group>
      <group ref={rightStickRef}>
        <StickGeometry />
      </group>
    </group>
  );
};
