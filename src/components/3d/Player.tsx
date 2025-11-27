import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import type { PointerLockControls as PointerLockControlsImpl } from 'three-stdlib';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

interface PlayerProps {
    isNavigating: boolean;
    onToggleNav: (status: boolean) => void;
    onMoveStart?: (direction: 'forward' | 'backward' | 'left' | 'right') => void;
    onMoveEnd?: (direction: 'forward' | 'backward' | 'left' | 'right') => void;
}

export function Player({ isNavigating, onToggleNav, onMoveStart, onMoveEnd }: PlayerProps) {
    const { camera } = useThree();
    const controlsRef = useRef<PointerLockControlsImpl>(null);
    const moveForward = useRef(false);
    const moveBackward = useRef(false);
    const moveLeft = useRef(false);
    const moveRight = useRef(false);
    
    // Expose movement functions for mobile controls
    useEffect(() => {
        if (!onMoveStart || !onMoveEnd) return;
        
        const handleMoveStart = (direction: 'forward' | 'backward' | 'left' | 'right') => {
            switch (direction) {
                case 'forward':
                    moveForward.current = true;
                    break;
                case 'backward':
                    moveBackward.current = true;
                    break;
                case 'left':
                    moveLeft.current = true;
                    break;
                case 'right':
                    moveRight.current = true;
                    break;
            }
        };
        
        const handleMoveEnd = (direction: 'forward' | 'backward' | 'left' | 'right') => {
            switch (direction) {
                case 'forward':
                    moveForward.current = false;
                    break;
                case 'backward':
                    moveBackward.current = false;
                    break;
                case 'left':
                    moveLeft.current = false;
                    break;
                case 'right':
                    moveRight.current = false;
                    break;
            }
        };
        
        // Store callbacks in refs to avoid re-creating the effect
        (window as any).__playerMoveStart = handleMoveStart;
        (window as any).__playerMoveEnd = handleMoveEnd;
        
        return () => {
            delete (window as any).__playerMoveStart;
            delete (window as any).__playerMoveEnd;
        };
    }, [onMoveStart, onMoveEnd]);
    
    // Handle keyboard input
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    moveForward.current = true;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    moveLeft.current = true;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    moveBackward.current = true;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    moveRight.current = true;
                    break;
            }
        };

        const onKeyUp = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    moveForward.current = false;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    moveLeft.current = false;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    moveBackward.current = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    moveRight.current = false;
                    break;
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    // Handle movement loop
    useFrame((state, delta) => {
        // For mobile, allow movement even if not locked (since pointer lock doesn't work on mobile)
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (!isMobile && !controlsRef.current?.isLocked) return;

        const speed = 5.0; 
        const velocity = new THREE.Vector3();
        const direction = new THREE.Vector3();

        direction.z = Number(moveForward.current) - Number(moveBackward.current);
        direction.x = Number(moveRight.current) - Number(moveLeft.current);
        direction.normalize(); 

        if (moveForward.current || moveBackward.current) velocity.z -= direction.z * speed * delta;
        if (moveLeft.current || moveRight.current) velocity.x -= direction.x * speed * delta;

        // For mobile, move camera directly since pointer lock doesn't work
        if (isMobile && controlsRef.current) {
            // Calculate movement in camera's local space
            const moveVector = new THREE.Vector3();
            const forward = new THREE.Vector3(0, 0, -1);
            const right = new THREE.Vector3(1, 0, 0);
            
            forward.applyQuaternion(camera.quaternion);
            right.applyQuaternion(camera.quaternion);
            
            forward.multiplyScalar(direction.z * speed * delta);
            right.multiplyScalar(direction.x * speed * delta);
            
            moveVector.add(forward);
            moveVector.add(right);
            
            camera.position.add(moveVector);
        } else if (controlsRef.current) {
            controlsRef.current.moveRight(direction.x * speed * delta); 
            controlsRef.current.moveForward(direction.z * speed * delta);
        }
        
        // Height lock
        state.camera.position.y = 1.7;
        
        // Collision (Bounds)
        // Bookshelves at ~9.5 radius. Keep player inside 8.5.
        const maxRadius = 8.5;
        const currentPos = new THREE.Vector3(state.camera.position.x, 0, state.camera.position.z);
        if (currentPos.length() > maxRadius) {
            currentPos.normalize().multiplyScalar(maxRadius);
            state.camera.position.x = currentPos.x;
            state.camera.position.z = currentPos.z;
        }
    });

    // Robust Lock Handling
    useEffect(() => {
        const controls = controlsRef.current;
        if (!controls) return;

        if (isNavigating) {
            // Attempt to lock
            // We use a small delay to ensure this call happens after any previous unlock events settle
            const timeout = setTimeout(() => {
                // Only lock if not already locked to prevent errors
                if (!controls.isLocked) {
                    try {
                        controls.lock();
                    } catch (e) {
                        console.warn("Failed to acquire pointer lock:", e);
                        onToggleNav(false); // Fallback: reset state if lock fails
                    }
                }
            }, 100);
            return () => clearTimeout(timeout);
        } else {
            // Unlock request
            if (controls.isLocked) {
                controls.unlock();
            }
        }
    }, [isNavigating, onToggleNav]);

    return (
        <PointerLockControls 
            ref={controlsRef} 
            onUnlock={() => {
                // When browser escapes lock (via ESC), sync react state
                // Check isNavigating to prevent loops
                if (isNavigating) {
                    onToggleNav(false);
                }
            }}
        />
    );
}
