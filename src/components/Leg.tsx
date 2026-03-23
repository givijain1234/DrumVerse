import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LegProps {
  isHit: boolean;
  position: [number, number, number];
}

export const Leg: React.FC<LegProps> = ({ isHit, position }) => {
  const legRef = useRef<THREE.Mesh>(null);
  const targetRotation = isHit ? -0.6 : -0.5;
  const targetY = isHit ? 1.4 : 1.5;

  useFrame(() => {
    if (legRef.current) {
      legRef.current.rotation.x = THREE.MathUtils.lerp(
        legRef.current.rotation.x,
        targetRotation,
        0.2
      );
      legRef.current.position.y = THREE.MathUtils.lerp(
        legRef.current.position.y,
        targetY,
        0.2
      );
    }
  });

  return (
    <mesh ref={legRef} position={position} rotation={[-0.5, 0, 0]}>
      <cylinderGeometry args={[0.15, 0.12, 2.5]} />
      <meshStandardMaterial color="#222" roughness={0.8} />
    </mesh>
  );
};
