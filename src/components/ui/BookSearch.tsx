import React, { useState } from 'react';
import { CLASSICS } from '../3d/Bookshelf';

interface BookSearchProps {
  onClose: () => void;
  onSelect: (bookId: string) => void;
}

export function BookSearch({ onClose, onSelect }: BookSearchProps) {
  const [query, setQuery] = useState('');

  const filteredBooks = CLASSICS.filter(book => 
    book.title.toLowerCase().includes(query.toLowerCase()) ||
    book.author.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-[#f4ecd8] text-[#2a1b0e] p-6 rounded-sm shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col font-serif border-8 border-[#3d2817]">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Catálogo de la Biblioteca</h2>
          <button onClick={onClose} className="text-xl hover:text-red-600">&times;</button>
        </div>

        <input
          type="text"
          placeholder="Buscar por título o autor..."
          className="w-full p-3 bg-white border-2 border-[#d4c5a8] rounded mb-4 text-lg outline-none focus:border-[#8B4513]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />

        <div className="overflow-y-auto flex-1 pr-2 space-y-2 custom-scrollbar">
          {filteredBooks.length === 0 ? (
            <p className="text-center text-gray-500 italic py-8">No se encontraron libros en los registros.</p>
          ) : (
            filteredBooks.map((book) => (
              <div 
                key={book.title}
                className="p-3 border-b border-[#d4c5a8] hover:bg-[#e6dec5] cursor-pointer transition-colors flex items-center gap-3 group"
                onClick={() => onSelect(`classic-${book.title}`)}
              >
                <div className="w-8 h-10 bg-stone-800 shadow" style={{ backgroundColor: book.color }}></div>
                <div>
                    <h3 className="font-bold group-hover:text-[#8B4513]">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 text-center text-xs text-gray-500 border-t border-[#d4c5a8] pt-2">
          Selecciona un libro para localizar su ubicación en los estantes.
        </div>
      </div>
    </div>
  );
}
