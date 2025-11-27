import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

import { BookModal } from './components/ui/BookModal';
import { AdminPanel } from './components/ui/AdminPanel';
import { HUD } from './components/ui/HUD';
import { BookSearch } from './components/ui/BookSearch';
import { LibraryRoom } from './components/3d/LibraryRoom';
import { Bookshelf } from './components/3d/Bookshelf';
import { Nightstand } from './components/3d/Nightstand';
import { Player } from './components/3d/Player';
import { Avatar } from './components/3d/Avatar';
import { Login } from './components/auth/Login';
import * as kv from './utils/supabase/kv_store';
import { supabase } from './utils/supabase/client';

// Types
export type BookData = {
  id: string;
  title: string;
  author: string;
  description: string;
  color: string;
  height: number;
  thickness: number;
  coverImage?: string;
  format: 'pocket' | 'standard';
};

export type ClubConfig = {
  nextMeetingDate: string;
  currentBookTitle: string;
  currentBookImage: string;
};

interface UserState {
    pos: [number, number, number];
    rot: [number, number, number];
    color: string;
    name: string;
}

const DEFAULT_CONFIG: ClubConfig = {
  nextMeetingDate: '2023-12-15T18:00',
  currentBookTitle: 'Cien Años de Soledad',
  currentBookImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
};

// -- Component to Broadcast Player Position --
function PlayerTrackerWithId({ channel, session }: { channel: any, session: any }) {
    const { camera } = useThree();
    const lastBroadcast = useRef(0);
    const myColor = useRef('#' + Math.floor(Math.random()*16777215).toString(16));

    useFrame(() => {
        if (!channel) return;
        const now = Date.now();
        if (now - lastBroadcast.current > 100) { 
            channel.send({
                type: 'broadcast',
                event: 'pos',
                payload: {
                    id: session.user.id,
                    pos: [camera.position.x, camera.position.y - 1.7, camera.position.z],
                    rot: [camera.rotation.x, camera.rotation.y, camera.rotation.z],
                    color: myColor.current,
                    name: session.user.email.split('@')[0]
                }
            });
            lastBroadcast.current = now;
        }
    });
    return null;
}

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);
  const [highlightedBookId, setHighlightedBookId] = useState<string | null>(null); // State for jumping book
  const [isNavigating, setIsNavigating] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showSearch, setShowSearch] = useState(false); // State for search modal
  const [clubConfig, setClubConfig] = useState<ClubConfig>(DEFAULT_CONFIG);
  
  const [otherUsers, setOtherUsers] = useState<Record<string, UserState>>({});
  const channelRef = useRef<any>(null);

  useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
      });

      return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const data = await kv.get('club-config');
        if (data) setClubConfig(data as ClubConfig);
      } catch (e) {
        console.error("Error loading config:", e);
      }
    };
    loadConfig();
  }, []);

  useEffect(() => {
      if (!session) return;
      const channel = supabase.channel('room-1');
      channel
        .on('broadcast', { event: 'pos' }, ({ payload }: { payload: UserState & { id: string } }) => {
            setOtherUsers(prev => ({ ...prev, [payload.id]: payload }));
        })
        .subscribe((status) => {
            if (status === 'SUBSCRIBED') channelRef.current = channel;
        });
      return () => { supabase.removeChannel(channel); };
  }, [session]);

  const handleSaveConfig = async (newConfig: ClubConfig) => {
    setClubConfig(newConfig);
    await kv.set('club-config', newConfig);
    setShowAdmin(false);
  };

  const handleBookSelect = (book: BookData) => {
      // Stop highlighting if we click the book we were searching for
      if (highlightedBookId === book.id) {
          setHighlightedBookId(null);
      }
      setSelectedBook(book);
      // Unlock cursor interaction by disabling navigation
      setIsNavigating(false);
  };

  const handleSearchSelect = (bookId: string) => {
      setHighlightedBookId(bookId);
      setShowSearch(false);
      setIsNavigating(true);
  };

  const bookshelfRadius = 9.5;
  
  if (!session) return <Login onLogin={setSession} />;

  return (
    <div className="w-full h-screen bg-black overflow-hidden font-sans">
      <Canvas shadows camera={{ fov: 60, position: [0, 1.7, 5] }}>
        <fog attach="fog" args={['#15100b', 2, 25]} />
        
        <LibraryRoom clubConfig={clubConfig} />
        
        {/* Nightstand with Search Paper */}
        <Nightstand 
            position={[0, 0, 0]} // Center of the room
            onPaperClick={() => {
                setIsNavigating(false);
                setShowSearch(true);
            }}
        />
        
        {/* Bookshelves with highlighting support */}
        <Bookshelf 
            position={[0, 0, -bookshelfRadius]} 
            rotation={[0, 0, 0]} 
            onBookClick={handleBookSelect} 
            highlightedBookId={highlightedBookId}
        />
        <Bookshelf 
            position={[-Math.sin(Math.PI/8)*bookshelfRadius, 0, -Math.cos(Math.PI/8)*bookshelfRadius]} 
            rotation={[0, Math.PI/8, 0]} 
            onBookClick={handleBookSelect}
            highlightedBookId={highlightedBookId}
        />
        <Bookshelf 
            position={[Math.sin(Math.PI/8)*bookshelfRadius, 0, -Math.cos(Math.PI/8)*bookshelfRadius]} 
            rotation={[0, -Math.PI/8, 0]} 
            onBookClick={handleBookSelect}
            highlightedBookId={highlightedBookId}
        />
        <Bookshelf 
            position={[-Math.sin(Math.PI/4)*bookshelfRadius, 0, -Math.cos(Math.PI/4)*bookshelfRadius]} 
            rotation={[0, Math.PI/4, 0]} 
            onBookClick={handleBookSelect}
            highlightedBookId={highlightedBookId}
        />
        <Bookshelf 
            position={[Math.sin(Math.PI/4)*bookshelfRadius, 0, -Math.cos(Math.PI/4)*bookshelfRadius]} 
            rotation={[0, -Math.PI/4, 0]} 
            onBookClick={handleBookSelect}
            highlightedBookId={highlightedBookId}
        />

        <Player isNavigating={isNavigating} onToggleNav={setIsNavigating} />
        
        {Object.entries(otherUsers).map(([id, user]) => {
            if (id === session.user.id) return null;
            return <Avatar key={id} position={user.pos} rotation={user.rot} color={user.color} name={user.name} />;
        })}

        <PlayerTrackerWithId channel={channelRef.current} session={session} />
        <Environment preset="city" blur={0.8} background={false} />
      </Canvas>

      <HUD 
        isNavigating={isNavigating} 
        onStart={() => setIsNavigating(true)}
        onOpenAdmin={() => { setIsNavigating(false); setShowAdmin(true); }}
        hasOpenModal={!!selectedBook || showAdmin || showSearch}
      />

      {selectedBook && (
        <BookModal 
          book={selectedBook} 
          onClose={() => { setSelectedBook(null); setIsNavigating(true); }} 
        />
      )}

      {showSearch && (
          <BookSearch 
            onClose={() => { setShowSearch(false); setIsNavigating(true); }}
            onSelect={handleSearchSelect}
          />
      )}
      
      {showAdmin && (
        <AdminPanel 
          config={clubConfig} 
          onSave={handleSaveConfig} 
          onCancel={() => { setShowAdmin(false); setIsNavigating(true); }} 
        />
      )}
      
      <div className="absolute top-4 right-4 z-50 pointer-events-none">
          <div className="bg-black/50 p-2 rounded text-stone-400 text-xs backdrop-blur-md">
              Conectado como: <span className="text-amber-500 font-bold">{session.user.email}</span>
              <br/>
              Usuarios en sala: {Object.keys(otherUsers).filter(id => id !== session.user.id).length}
          </div>
      </div>
    </div>
  );
}
