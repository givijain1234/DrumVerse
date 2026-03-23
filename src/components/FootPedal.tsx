import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FootPedalProps {
  isHit: boolean;
  position: [number, number, number];
}

export const FootPedal: React.FC<FootPedalProps> = ({ isHit, position }) => {
  const pedalRef = useRef<THREE.Group>(null);
  const targetRotation = isHit ? -0.3 : 0;

  useFrame((state) => {
    if (pedalRef.current) {
      pedalRef.current.rotation.x = THREE.MathUtils.lerp(
        pedalRef.current.rotation.x,
        targetRotation,
        0.2
      );
    }
  });

  return (
    <group position={position}>
      {/* Pedal Base */}
      <mesh position={[0, -0.4, 0.5]}>
        <boxGeometry args={[0.6, 0.1, 1.2]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Moving Pedal Part */}
      <group ref={pedalRef} position={[0, -0.35, 1]}>
        <mesh position={[0, 0, -0.5]}>
          <boxGeometry args={[0.5, 0.05, 1]} />
          <meshStandardMaterial color="#555" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Beater Rod */}
        <mesh position={[0, 0.4, -0.9]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8]} />
          <meshStandardMaterial color="#888" metalness={1} roughness={0} />
        </mesh>
        
        {/* Beater Head */}
        <mesh position={[0, 0.8, -1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.15]} />
          <meshStandardMaterial color="#eee" roughness={0.8} />
        </mesh>
      </group>

      {/* Support Pillars */}
      <mesh position={[0.25, -0.1, 0.9]}>
        <cylinderGeometry args={[0.03, 0.03, 0.6]} />
        <meshStandardMaterial color="#444" metalness={0.8} />
      </mesh>
      <mesh position={[-0.25, -0.1, 0.9]}>
        <cylinderGeometry args={[0.03, 0.03, 0.6]} />
        <meshStandardMaterial color="#444" metalness={0.8} />
      </mesh>
    </group>
  );
};
