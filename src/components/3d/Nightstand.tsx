import React, { useState } from 'react';
import { useCursor } from '@react-three/drei';

interface NightstandProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  onPaperClick: () => void;
}

export function Nightstand({ position, rotation = [0, 0, 0], onPaperClick }: NightstandProps) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, 'pointer', 'auto');

  return (
    <group position={position} rotation={rotation}>
      {/* Table Top */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>

      {/* Leg */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.1, 0.6, 8]} />
        <meshStandardMaterial color="#2a1b0e" />
      </mesh>

      {/* Base */}
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.05, 16]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>

      {/* The Magic Paper */}
      <group 
        position={[0, 0.63, 0]} 
        rotation={[-Math.PI / 2, 0, Math.PI / 4]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        onClick={(e) => { e.stopPropagation(); onPaperClick(); }}
      >
        <mesh receiveShadow>
            <planeGeometry args={[0.3, 0.4]} />
            <meshStandardMaterial color={hovered ? "#ffffee" : "#ddddcc"} />
        </mesh>
        {/* Text lines simulation */}
        <mesh position={[0, 0, 0.001]}>
            <planeGeometry args={[0.2, 0.02]} />
            <meshBasicMaterial color="#000" />
        </mesh>
        <mesh position={[0, 0.05, 0.001]}>
            <planeGeometry args={[0.2, 0.02]} />
            <meshBasicMaterial color="#000" />
        </mesh>
         <mesh position={[0, -0.05, 0.001]}>
            <planeGeometry args={[0.2, 0.02]} />
            <meshBasicMaterial color="#000" />
        </mesh>
      </group>
    </group>
  );
}
