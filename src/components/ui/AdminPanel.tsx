import React, { useState } from 'react';
import { ClubConfig } from '../../App';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar as CalendarIcon, BookOpen, Image as ImageIcon, Save, X, Settings } from 'lucide-react';

interface AdminPanelProps {
    config: ClubConfig;
    onSave: (config: ClubConfig) => void;
    onCancel: () => void;
}

export function AdminPanel({ config, onSave, onCancel }: AdminPanelProps) {
    const [formData, setFormData] = useState<ClubConfig>(config);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate network delay or wait for parent
        await new Promise(resolve => setTimeout(resolve, 500));
        onSave(formData);
        setIsLoading(false);
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-stone-900 border border-stone-700 rounded-lg shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-stone-800 flex justify-between items-center">
                    <h2 className="text-xl font-serif font-bold text-stone-100 flex items-center gap-2">
                        <SettingsIcon className="w-5 h-5 text-amber-500" />
                        Gestión del Club
                    </h2>
                    <button onClick={onCancel} className="text-stone-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    {/* Next Meeting */}
                    <div className="space-y-2">
                        <Label className="text-stone-300 flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-amber-500" />
                            Próxima Reunión
                        </Label>
                        <Input 
                            type="datetime-local" 
                            value={formData.nextMeetingDate}
                            onChange={(e) => setFormData({...formData, nextMeetingDate: e.target.value})}
                            className="bg-stone-800 border-stone-700 text-white"
                        />
                    </div>

                    {/* Current Book Title */}
                    <div className="space-y-2">
                        <Label className="text-stone-300 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-amber-500" />
                            Libro en Discusión
                        </Label>
                        <Input 
                            type="text" 
                            value={formData.currentBookTitle}
                            onChange={(e) => setFormData({...formData, currentBookTitle: e.target.value})}
                            className="bg-stone-800 border-stone-700 text-white"
                            placeholder="Ej: Cien Años de Soledad"
                        />
                    </div>

                    {/* Cover Image URL */}
                    <div className="space-y-2">
                        <Label className="text-stone-300 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-amber-500" />
                            URL de la Portada
                        </Label>
                        <div className="flex gap-2">
                            <Input 
                                type="url" 
                                value={formData.currentBookImage}
                                onChange={(e) => setFormData({...formData, currentBookImage: e.target.value})}
                                className="bg-stone-800 border-stone-700 text-white flex-1"
                                placeholder="https://..."
                            />
                        </div>
                        <p className="text-xs text-stone-500">
                            Usa una URL directa a la imagen (jpg/png).
                        </p>
                    </div>

                    {/* Preview */}
                    <div className="bg-stone-800/50 p-4 rounded border border-stone-700/50 flex gap-4 items-start">
                        <div className="w-16 h-24 bg-stone-700 rounded overflow-hidden shrink-0">
                            {formData.currentBookImage && (
                                <img src={formData.currentBookImage} alt="Preview" className="w-full h-full object-cover" />
                            )}
                        </div>
                        <div>
                            <p className="text-xs text-stone-500 uppercase font-bold mb-1">Vista Previa</p>
                            <p className="text-white font-serif font-bold line-clamp-1">{formData.currentBookTitle || "Título..."}</p>
                            <p className="text-stone-400 text-sm font-mono mt-1">
                                {formData.nextMeetingDate ? new Date(formData.nextMeetingDate).toLocaleDateString('es-ES', { dateStyle: 'medium' }) : "Fecha..."}
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button 
                            type="submit" 
                            disabled={isLoading}
                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onCancel}
                            className="border-stone-700 text-stone-300 hover:bg-stone-800"
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function SettingsIcon({ className }: { className?: string }) {
    return <Settings className={className} />;
}
