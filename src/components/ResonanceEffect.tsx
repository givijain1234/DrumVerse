import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RippleProps {
  color: string;
  onComplete: () => void;
}

const Ripple: React.FC<RippleProps> = ({ color, onComplete }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [opacity, setOpacity] = useState(0.4);
  const [scale, setScale] = useState(0.8);

  useFrame((state, delta) => {
    if (meshRef.current) {
      setScale(prev => prev + delta * 2.5);
      setOpacity(prev => Math.max(0, prev - delta * 1.2));
      
      meshRef.current.scale.set(scale, scale, 1);
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        meshRef.current.material.opacity = opacity;
      }
    }
  });

  useEffect(() => {
    const timer = setTimeout(onComplete, 600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.95, 1, 64]} />
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={opacity} 
        emissive={color}
        emissiveIntensity={1.5}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

interface ResonanceEffectProps {
  active: boolean;
  color: string;
  position?: [number, number, number];
}

export const ResonanceEffect: React.FC<ResonanceEffectProps> = ({ active, color, position = [0, 0, 0] }) => {
  const [ripples, setRipples] = useState<{ id: number }[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    if (active) {
      const id = nextId.current++;
      setRipples(prev => [...prev, { id }]);
    }
  }, [active]);

  const removeRipple = (id: number) => {
    setRipples(prev => prev.filter(r => r.id !== id));
  };

  return (
    <group position={position}>
      {ripples.map(ripple => (
        <Ripple 
          key={ripple.id} 
          color={color} 
          onComplete={() => removeRipple(ripple.id)} 
        />
      ))}
    </group>
  );
};
