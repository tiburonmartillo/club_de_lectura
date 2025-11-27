import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarProps {
  position: [number, number, number];
  rotation: [number, number, number]; // We mostly care about Y rotation
  color: string;
  name?: string;
}

export function Avatar({ position, rotation, color, name }: AvatarProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Smooth interpolation for network updates
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.lerp(new THREE.Vector3(...position), 0.1);
      // Interpolate rotation strictly on Y axis for the body
      // We construct a quaternion or just lerp the scalar
      // Simple lerp for Y rotation:
      // (Note: this is simple and might have wrapping issues at 360/0 deg, but works for basic cases)
       groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotation[1], 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.3, 1, 4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#ecc" />
      </mesh>
      
      {/* Eyes (to see direction) */}
      <group position={[0, 1.5, 0.2]}>
        <mesh position={[-0.1, 0, 0]}>
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color="black" />
        </mesh>
        <mesh position={[0.1, 0, 0]}>
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color="black" />
        </mesh>
      </group>

      {/* Name Tag */}
      <Html position={[0, 2, 0]} center>
        <div className="px-2 py-1 bg-black/50 text-white text-xs rounded backdrop-blur-sm whitespace-nowrap">
          {name || 'Lector'}
        </div>
      </Html>
    </group>
  );
}
