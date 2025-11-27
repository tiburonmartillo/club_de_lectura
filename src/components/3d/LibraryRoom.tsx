import React from 'react';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ClubConfig } from '../../App';

interface LibraryRoomProps {
  clubConfig: ClubConfig;
}

export function LibraryRoom({ clubConfig }: LibraryRoomProps) {
  const woodTexture = useTexture('https://images.unsplash.com/photo-1617262869522-6740e6450f27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwd29vZCUyMGZsb29yJTIwdGV4dHVyZSUyMHNlYW1sZXNzfGVufDF8fHx8MTc2NDEwNTE2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral');
  const rugTexture = useTexture('https://images.unsplash.com/photo-1761849450843-4ce9e6560b94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzaWFuJTIwcnVnJTIwdGV4dHVyZSUyMHBhdHRlcm58ZW58MXx8fHwxNzY0MTA1NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral');
  const starsTexture = useTexture('https://images.unsplash.com/photo-1611169638716-72168bc5424b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodCUyMHNreSUyMHN0YXJzJTIwdGV4dHVyZSUyMHNlYW1sZXNzfGVufDF8fHx8MTc2NDEwNTY0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral');

  woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set(6, 6);

  starsTexture.wrapS = starsTexture.wrapT = THREE.RepeatWrapping;
  starsTexture.repeat.set(2, 2);

  const roomRadius = 12;
  const wallHeight = 7;

  return (
    <group>
      {/* Ambient Light for overall illumination */}
      <ambientLight intensity={0.6} color="#ffffff" />
      
      {/* Circular Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[roomRadius, 64]} />
        <meshStandardMaterial map={woodTexture} roughness={0.8} />
      </mesh>

      {/* Circular Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <circleGeometry args={[5, 64]} />
        <meshStandardMaterial map={rugTexture} roughness={1} />
      </mesh>

      {/* Circular Walls */}
      <mesh position={[0, wallHeight / 2, 0]} receiveShadow>
        <cylinderGeometry args={[roomRadius, roomRadius, wallHeight, 64, 1, true]} />
        <meshStandardMaterial color="#87CEEB" side={THREE.BackSide} />
      </mesh>

      {/* Starry Sky Dome */}
      <mesh position={[0, wallHeight - 0.1, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[roomRadius - 0.2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial map={starsTexture} side={THREE.BackSide} color="#aaa" />
      </mesh>

      {/* Info Poster / Board - Positioned on the right curve */}
      {/* Polar coordinates: Radius ~11.8, Angle ~ -45 degrees (Right-ish) */}
      <group position={[roomRadius - 0.5, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[3, 4, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        
        {/* Poster Image Area */}
        <mesh position={[0, 0.5, 0.06]}>
            <planeGeometry args={[2.5, 3.5]} />
            <meshBasicMaterial color="#e6e6e6" />
        </mesh>
        
        <Html transform position={[0, 0, 0.07]} scale={0.3} style={{ pointerEvents: 'none' }} zIndexRange={[0, 0]}>
            <div className="w-[300px] h-[400px] bg-stone-900 p-4 flex flex-col items-center text-center shadow-xl rounded-sm">
                <h2 className="text-stone-200 text-xl font-bold mb-2 font-serif">Club de Lectura</h2>
                <div className="w-32 h-48 mb-2 overflow-hidden rounded shadow-lg relative">
                    <img src={clubConfig.currentBookImage} alt="Cover" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-amber-500 font-bold text-lg leading-tight">{clubConfig.currentBookTitle}</h3>
                <div className="mt-4 text-stone-400 text-sm">
                    <p>Próxima reunión:</p>
                    <p className="text-white font-mono text-lg">
                        {new Date(clubConfig.nextMeetingDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </p>
                </div>
            </div>
        </Html>
      </group>

      {/* Hanging Lamp */}
      <group position={[0, 6, 0]}>
          {/* Chain/Cord - Longer since roof is higher effectively */}
          <mesh position={[0, 2, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 4]} />
              <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          {/* Lamp Shade */}
          <mesh position={[0, -0.2, 0]}>
              <coneGeometry args={[1.5, 1, 32, 1, true]} />
              <meshStandardMaterial color="#222" side={THREE.DoubleSide} />
          </mesh>
          {/* Bulb/Light */}
          <mesh position={[0, -0.5, 0]}>
              <sphereGeometry args={[0.3]} />
              <meshBasicMaterial color="#ffaa44" />
          </mesh>
          <pointLight position={[0, -1, 0]} intensity={3.0} color="#ffaa44" distance={20} castShadow shadow-bias={-0.0001} />
      </group>
    </group>
  );
}
