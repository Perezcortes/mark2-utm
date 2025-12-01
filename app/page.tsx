'use client';
import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react'; 

export default function Home() {
  const [matricula, setMatricula] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [linkPrueba, setLinkPrueba] = useState('');

  // Color Institucional UTM (Guinda Oficial)
  const utmColor = '#6A1B31'; 

  const solicitarCredencial = async () => {
    if (!matricula.trim()) {
      toast.warning('Campo vacío', { description: 'Por favor escribe tu matrícula.' });
      return;
    }

    setIsLoading(true);
    setLinkPrueba('');

    try {
      const res = await fetch('/api/generar-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricula }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        toast.success('¡Enlace enviado!', {
          description: `Revisa tu correo institucional (${data.message.split(' ').pop()})`,
          duration: 5000,
          // Icono de éxito verde para feedback positivo
          icon: <CheckCircle2 className="text-green-500 w-5 h-5" />,
        });
        setLinkPrueba(data.debug_link); 
      } else {
        if (data.error === 'Alumno no encontrado') {
            toast.error('Matrícula no encontrada', {
                description: 'Verifica tus datos o contacta a Servicios Escolares.',
            });
        } else {
            toast.error('Error del sistema', { description: data.error });
        }
      }
    } catch (err) {
      toast.error('Error de conexión', { description: 'Inténtalo de nuevo más tarde.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white p-4 relative overflow-hidden font-sans">
      
      {/* 1. Fondo ambiental (Glow Effect) */}
      {/* Mantenemos este brillo sutil con el color oficial para dar profundidad */}
      <div className="absolute top-[-20%] left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-[#6A1B31] rounded-full blur-[140px] opacity-15 pointer-events-none"></div>

      <div className="flex flex-col items-center mb-10 space-y-6 z-10">
        {/* 2. LOGO TIPO "APP ICON" */}
        {/* Usamos fondo blanco sólido (bg-white) para que el escudo de la UTM sea perfectamente legible, 
            tal como se ve en las cabeceras oficiales y apps de calidad. */}
        <div className="p-3 bg-white rounded-2xl shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)] ring-1 ring-white/20">
            <Image 
              src="/logo-utm.png" 
              alt="Escudo UTM" 
              width={160} 
              height={160} 
              className="object-contain"
              priority
            />
        </div>
        
        <div className="text-center space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-sm">
                Credencial Digital
            </h1>
            <p className="text-[#a1a1a1] text-xs md:text-sm tracking-[0.2em] uppercase font-medium pt-2">
                Universidad Tecnológica de la Mixteca
            </p>
        </div>
      </div>
      
      {/* Tarjeta del Formulario */}
      <div className="w-full max-w-md bg-[#111111]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl z-10 ring-1 ring-white/5">
        <label className="block mb-3 text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wide">
            Matrícula Universitaria
        </label>
        
        <div className="relative group">
            <input 
            type="text" 
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            placeholder="Ej: 2020020051"
            disabled={isLoading}
            // Input estilizado con borde que reacciona al color Guinda
            className="w-full p-4 rounded-xl bg-[#0a0a0a] text-white border border-gray-800 focus:border-[#6A1B31] focus:ring-1 focus:ring-[#6A1B31] placeholder:text-gray-600 outline-none transition-all font-mono text-lg"
            />
        </div>
        
        <button 
          onClick={solicitarCredencial}
          disabled={isLoading}
          // Botón principal con el color oficial y efectos de hover
          className="w-full mt-6 bg-[#6A1B31] hover:bg-[#7d203a] active:scale-[0.98] text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_-4px_rgba(106,27,49,0.5)]"
        >
          {isLoading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Procesando...</span>
              </>
          ) : (
              <>
                <span>Continuar</span>
                <ArrowRight className="w-5 h-5" />
              </>
          )}
        </button>

        {/* Link de prueba (Solo aparece en desarrollo si el backend lo devuelve) */}
        {linkPrueba && (
          <div className="mt-6 p-4 bg-blue-950/20 border border-blue-900/30 rounded-xl animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wide">
                    Modo Debug
                </p>
            </div>
            <a href={linkPrueba} target="_blank" rel="noreferrer" className="text-xs text-blue-300/80 underline break-all hover:text-blue-200 transition font-mono">
                {linkPrueba}
            </a>
          </div>
        )}
      </div>
      
      {/* Footer con el lema oficial */}
      <p className="mt-12 text-[14px] text-gray-600 font-medium tracking-wide text-center">
        Sistema Seguro Mark II • <span className="italic">Labor et Sapientia Libertas</span>
      </p>
    </div>
  );
}