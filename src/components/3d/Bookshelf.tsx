import React, { useMemo, useState, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { BookData } from '../../App';

// Famous books dataset exported for use in Search
export const CLASSICS = [
    { title: "Don Quijote", author: "Cervantes", color: "#8B4513", format: 'standard' },
    { title: "1984", author: "Orwell", color: "#333333", format: 'pocket' },
    { title: "La Odisea", author: "Homero", color: "#CD853F", format: 'standard' },
    { title: "Hamlet", author: "Shakespeare", color: "#2F4F4F", format: 'pocket' },
    { title: "El Principito", author: "Saint-Exupéry", color: "#4682B4", format: 'pocket' },
    { title: "Drácula", author: "Stoker", color: "#800000", format: 'standard' },
    { title: "Dune", author: "Herbert", color: "#DAA520", format: 'standard' },
    { title: "Rayuela", author: "Cortázar", color: "#556B2F", format: 'pocket' },
    { title: "Ficciones", author: "Borges", color: "#191970", format: 'pocket' }
];

interface BookshelfProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  onBookClick: (book: BookData) => void;
  highlightedBookId?: string | null;
}

function InteractiveBook({ 
    data, 
    position, 
    onClick,
    isHighlighted
}: { 
    data: BookData, 
    position: [number, number, number], 
    onClick: (b: BookData) => void,
    isHighlighted: boolean
}) {
    const meshRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);
    
    // Animation loop
    useFrame((state, delta) => {
        if (!meshRef.current) return;
        
        // Base Z position (pushed out slightly so they sit ON the shelf, not inside)
        // The shelf is at Z=0 locally. Let's assume shelf depth is 0.3.
        // We need to push them forward.
        const baseZ = position[2];
        const baseY = position[1];

        // Hover Effect
        const hoverOffsetZ = hovered ? 0.15 : 0;
        const hoverOffsetY = hovered ? 0.05 : 0;

        // Jump Effect (Sine wave)
        let jumpOffsetY = 0;
        if (isHighlighted && !hovered) {
            // Jump fast to attract attention
            jumpOffsetY = Math.abs(Math.sin(state.clock.elapsedTime * 8)) * 0.15;
        }
        
        const targetZ = baseZ + hoverOffsetZ;
        const targetY = baseY + hoverOffsetY + jumpOffsetY;
        
        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, delta * 10);
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * 10);
    });

    return (
        <group 
            ref={meshRef}
            position={position}
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
            onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
            onClick={(e) => { 
                e.stopPropagation(); 
                onClick(data); 
            }}
        >
            <mesh castShadow receiveShadow>
                <boxGeometry args={[data.thickness, data.height, 0.24]} />
                <meshStandardMaterial color={isHighlighted ? "#ffaa00" : data.color} emissive={isHighlighted ? "#553300" : "#000000"} />
            </mesh>
            {/* Spine Detail */}
            {data.thickness > 0.04 && (
                <group position={[0.001 + data.thickness/2, 0, 0.121]}>
                     <mesh position={[-data.thickness/2 - 0.001, 0, 0]}>
                        <planeGeometry args={[data.thickness * 0.8, data.height * 0.8]} />
                        <meshStandardMaterial color="#ffffff" opacity={0.2} transparent />
                     </mesh>
                </group>
            )}
        </group>
    );
}

export function Bookshelf({ position, rotation = [0, 0, 0], onBookClick, highlightedBookId }: BookshelfProps) {
  const books = useMemo(() => {
    const shelfBooks: { data: BookData; position: [number, number, number] }[] = [];
    const shelves = 5; 
    const shelfWidth = 2.8;
    const startY = 0.2; 
    const shelfGap = 0.7; 

    let globalBookId = 0;

    for (let s = 0; s < shelves; s++) {
      let currentX = -shelfWidth / 2 + 0.1;
      const yPos = startY + s * shelfGap;

      while (currentX < shelfWidth / 2 - 0.1) {
        const isClassic = Math.random() > 0.8; // 20% chance of classic
        const classicData = isClassic ? CLASSICS[Math.floor(Math.random() * CLASSICS.length)] : null;

        // Determine format
        const format = classicData ? (classicData.format as 'pocket' | 'standard') : (Math.random() > 0.5 ? 'standard' : 'pocket');

        // Dimensions based on format
        let height, thickness;
        if (format === 'pocket') {
            // Pocket: ~19cm height
            height = 0.18 + Math.random() * 0.03; 
            thickness = 0.02 + Math.random() * 0.025;
        } else {
            // Standard: ~28cm height
            height = 0.25 + Math.random() * 0.05;
            thickness = 0.035 + Math.random() * 0.04;
        }
        
        // If classic, use a predictable ID for searching
        const id = classicData 
            ? `classic-${classicData.title}` 
            : `shelf-${position[0]}-${s}-${globalBookId++}`;

        const book: BookData = {
          id: id,
          title: classicData ? classicData.title : `Volumen ${globalBookId}`,
          author: classicData ? classicData.author : "Desconocido",
          description: "Una obra fascinante que espera ser leída.",
          color: classicData ? classicData.color : `hsl(${Math.random() * 360}, 60%, 30%)`,
          height,
          thickness,
          coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300',
          format
        };

        // Z Position Fix: 
        // Shelf is box args=[3, 4, 0.3]. Center is 0. Depth is 0.3.
        // Front face is at +0.15.
        // Book depth is 0.24.
        // To sit flush, book center Z should be 0.15 - (0.24/2) = 0.03? 
        // No, we want them to protrude slightly or sit on edge.
        // Let's put them at Z = 0.05 relative to shelf center.
        shelfBooks.push({
            data: book,
            position: [currentX + thickness / 2, yPos + height / 2, 0.05]
        });

        currentX += thickness + 0.005; 
      }
    }
    return shelfBooks;
  }, [position[0], position[1], position[2]]); 

  return (
    <group position={position} rotation={rotation}>
      {/* Wooden Structure */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 4, 0.3]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>
      
      {/* Shelf Planks */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, 0.2 + i * 0.7 - 0.02, 0.1]} receiveShadow>
            <boxGeometry args={[2.9, 0.04, 0.28]} />
            <meshStandardMaterial color="#2a1b0e" />
        </mesh>
      ))}

      {/* Books */}
      {books.map((b, i) => (
          <InteractiveBook 
            key={i} 
            data={b.data} 
            position={b.position} 
            onClick={onBookClick}
            isHighlighted={highlightedBookId === b.data.id} 
          />
      ))}
    </group>
  );
}
