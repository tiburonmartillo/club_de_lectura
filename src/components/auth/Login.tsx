import React, { useState } from 'react';
import { supabase } from '../../utils/supabase/client';
import { getAuthRedirectUrl } from '../../utils/config';

interface LoginProps {
  onLogin: (session: any) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: getAuthRedirectUrl(),
          },
        });
        if (error) throw error;
        if (data.session) onLogin(data.session);
        else alert('Revisa tu email para confirmar tu cuenta.');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.session) onLogin(data.session);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-stone-950 text-stone-200 font-serif">
      <div className="w-full max-w-md p-8 bg-stone-900 rounded-lg shadow-2xl border border-stone-800">
        <h1 className="text-3xl font-bold mb-6 text-center text-amber-500">Biblioteca Infinita</h1>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-stone-800 border border-stone-700 focus:border-amber-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-stone-800 border border-stone-700 focus:border-amber-500 outline-none"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-amber-600 hover:bg-amber-700 rounded text-white font-bold transition-colors disabled:opacity-50"
          >
            {loading ? 'Procesando...' : mode === 'signin' ? 'Entrar' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-stone-400">
          {mode === 'signin' ? (
            <p>
              ¿No tienes cuenta?{' '}
              <button onClick={() => setMode('signup')} className="text-amber-500 hover:underline">
                Regístrate
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta?{' '}
              <button onClick={() => setMode('signin')} className="text-amber-500 hover:underline">
                Inicia sesión
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
