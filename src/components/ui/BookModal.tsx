import React from 'react';
import { X, Calendar, User } from 'lucide-react';
import { BookData } from '../../App';

interface BookModalProps {
    book: BookData;
    onClose: () => void;
}

export function BookModal({ book, onClose }: BookModalProps) {
    // Simulated reading history
    const history = [
        { date: '12 OCT 2023', user: 'Maria G.' },
        { date: '05 NOV 2023', user: 'Juan P.' },
        { date: '20 ENE 2024', user: 'Ana R.' },
    ];

    return (
        <div 
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="relative bg-[#fdfbf7] max-w-2xl w-full rounded shadow-2xl overflow-hidden flex flex-col md:flex-row border-2 border-[#e6e2d3]">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 p-2 text-stone-400 hover:text-stone-800 z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left: Book Info */}
                <div className="md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-[#e6e2d3] bg-[url('https://www.transparenttextures.com/patterns/paper.png')]">
                    <div className="w-32 h-48 bg-stone-800 mb-6 shadow-lg mx-auto rotate-1 transition-transform hover:rotate-0">
                         {/* Book Cover Placeholder */}
                         <div className="w-full h-full flex items-center justify-center text-stone-500 bg-gradient-to-br from-stone-700 to-stone-800">
                            <span className="text-center p-2 text-xs text-white/50">Sin Portada</span>
                         </div>
                    </div>
                    
                    <h2 className="text-2xl font-serif font-bold text-stone-800 mb-1 text-center">{book.title}</h2>
                    <p className="text-stone-500 text-center font-mono text-sm mb-4">{book.author}</p>
                    
                    <p className="text-stone-700 font-serif leading-relaxed text-sm">
                        {book.description}
                    </p>
                </div>

                {/* Right: Library Card History */}
                <div className="md:w-1/2 p-0 bg-white">
                    <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-center">
                        <span className="text-red-800 font-mono text-xs uppercase tracking-wider font-bold">Ficha de Préstamo</span>
                        <span className="text-red-800/50 font-mono text-xs">NO. {book.id.toUpperCase().slice(0,8)}</span>
                    </div>

                    <div className="p-6 space-y-4 bg-[repeating-linear-gradient(#fdfbf7,#fdfbf7_24px,#e6e2d3_25px)] min-h-[300px]">
                         <div className="grid grid-cols-2 gap-4 mb-2 text-xs font-bold text-stone-400 uppercase tracking-widest border-b-2 border-stone-800 pb-1">
                            <div>Fecha</div>
                            <div>Lector</div>
                         </div>
                         
                         {history.map((entry, i) => (
                             <div key={i} className="grid grid-cols-2 gap-4 font-mono text-sm text-stone-800 py-1 items-center group cursor-default">
                                 <div className="flex items-center gap-2">
                                     <Calendar className="w-3 h-3 text-stone-400" />
                                     <span className={`relative ${i === history.length - 1 ? 'text-blue-600 font-bold' : ''}`}>
                                        {entry.date}
                                        {/* Stamp effect */}
                                        {i === history.length - 1 && (
                                            <span className="absolute -top-2 -left-2 w-full h-full border-2 border-blue-600/30 rounded-sm rotate-[-10deg] scale-125 pointer-events-none" />
                                        )}
                                     </span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <User className="w-3 h-3 text-stone-400" />
                                     {entry.user}
                                 </div>
                             </div>
                         ))}

                         <div className="grid grid-cols-2 gap-4 font-mono text-sm text-stone-400/50 py-1 items-center mt-8">
                             <div>__ ___ ____</div>
                             <div>_____________</div>
                         </div>
                         <div className="grid grid-cols-2 gap-4 font-mono text-sm text-stone-400/50 py-1 items-center">
                             <div>__ ___ ____</div>
                             <div>_____________</div>
                         </div>
                    </div>
                    
                    <div className="p-4 bg-stone-50 border-t border-stone-200 text-center">
                        <button className="w-full py-2 bg-stone-800 text-white font-serif hover:bg-stone-700 transition-colors rounded-sm shadow-md">
                            Solicitar Préstamo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
