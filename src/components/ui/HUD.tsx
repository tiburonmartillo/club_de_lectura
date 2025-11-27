import React from 'react';
import { Book, Settings, MousePointer2 } from 'lucide-react';
import { Button } from '../ui/button';

interface HUDProps {
    isNavigating: boolean;
    onStart: () => void;
    onOpenAdmin: () => void;
    hasOpenModal?: boolean;
}

export function HUD({ isNavigating, onStart, onOpenAdmin, hasOpenModal }: HUDProps) {
    // If a modal is open (like a book or admin panel), hide the HUD overlay completely
    // so the user can interact with the modal.
    if (hasOpenModal) return null;

    if (isNavigating) {
        return (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Crosshair */}
                <div className="w-2 h-2 bg-white/80 rounded-full shadow-[0_0_4px_rgba(0,0,0,0.5)] mix-blend-difference" />
                
                <div className="absolute bottom-8 left-8 text-white/70 text-sm font-mono bg-black/20 p-4 rounded">
                    <p>WASD para moverte</p>
                    <p>Click para interactuar</p>
                    <p>ESC para salir</p>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-40">
            <div className="max-w-md w-full bg-stone-900 border border-stone-700 p-8 rounded-lg shadow-2xl text-center space-y-6">
                <div className="flex justify-center mb-4">
                    <Book className="w-16 h-16 text-amber-500" />
                </div>
                
                <h1 className="text-4xl font-serif text-stone-100 mb-2">Club de lectura</h1>
                <p className="text-stone-400">
                    Un espacio tranquilo para explorar nuestra colección y gestionar el club de lectura.
                </p>

                <div className="grid gap-4 pt-4">
                    <Button 
                        onClick={onStart}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12 text-lg font-serif"
                    >
                        <MousePointer2 className="mr-2 w-5 h-5" />
                        Entrar a la Sala
                    </Button>

                    <Button 
                        variant="outline"
                        onClick={onOpenAdmin}
                        className="w-full border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-amber-500"
                    >
                        <Settings className="mr-2 w-4 h-4" />
                        Gestionar Club
                    </Button>
                </div>
            </div>
        </div>
    );
}
