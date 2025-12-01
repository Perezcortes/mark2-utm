'use client';
import { useState } from 'react';
// 1. IMPORTAMOS LA FUNCIÓN TOAST
import { toast } from 'sonner';
import { Loader2, Shield, ArrowRight } from 'lucide-react'; // Iconos opcionales si instalaste lucide

export default function Home() {
  const [matricula, setMatricula] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [linkPrueba, setLinkPrueba] = useState('');

  const solicitarCredencial = async () => {
    // Validación básica: que no esté vacío
    if (!matricula.trim()) {
      toast.warning('Campo vacío', { description: 'Por favor escribe tu matrícula.' });
      return;
    }

    setIsLoading(true);
    setLinkPrueba(''); // Limpiamos link anterior

    try {
      const res = await fetch('/api/generar-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricula }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        // ÉXITO: TOAST VERDE
        toast.success('¡Enlace enviado!', {
          description: `Hemos enviado un correo seguro a ${data.message.split(' ').pop()}`, // Intenta extraer el correo del mensaje
          duration: 5000,
        });
        setLinkPrueba(data.debug_link); 
      } else {
        // ERROR DE NEGOCIO (Ej. No encontrado): TOAST ROJO
        // Aquí personalizamos el mensaje para que sea amigable
        if (data.error === 'Alumno no encontrado') {
            toast.error('Matrícula no encontrada', {
                description: 'Verifica que hayas escrito bien tus números. Si el problema persiste, contacta a Servicios Escolares.',
            });
        } else {
            toast.error('Ocurrió un error', { description: data.error });
        }
      }
    } catch (err) {
      toast.error('Error de conexión', { description: 'Inténtalo de nuevo más tarde.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      
      <div className="flex flex-col items-center mb-8 space-y-4">
        <div className="p-4 bg-gray-900 rounded-full ring-1 ring-gray-700">
            <Shield className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
            Digital ID UTM
        </h1>
        <p className="text-gray-500 text-sm tracking-widest uppercase">Protocolo Mark II</p>
      </div>
      
      <div className="w-full max-w-md bg-[#111111] p-8 rounded-2xl border border-gray-800 shadow-2xl">
        <label className="block mb-3 text-sm font-medium text-gray-400">
            Matrícula Universitaria
        </label>
        
        <div className="relative group">
            <input 
            type="text" 
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            placeholder="Ej: 2025123456"
            disabled={isLoading}
            className="w-full p-4 rounded-xl bg-gray-900 text-white border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono text-lg placeholder:text-gray-700"
            />
        </div>
        
        <button 
          onClick={solicitarCredencial}
          disabled={isLoading}
          className="w-full mt-6 bg-white hover:bg-gray-200 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Procesando...</span>
              </>
          ) : (
              <>
                <span>Solicitar Acceso</span>
                <ArrowRight className="w-5 h-5" />
              </>
          )}
        </button>

        {/* Solo mostramos esto en modo desarrollo/prototipo */}
        {linkPrueba && (
          <div className="mt-8 p-4 bg-blue-950/30 border border-blue-900 rounded-lg animate-in fade-in slide-in-from-top-2">
            <p className="text-xs font-bold text-blue-400 mb-2 uppercase tracking-wide">
                Modo Desarrollo (Simulación de Correo)
            </p>
            <p className="text-xs text-gray-400 mb-2">
                Haz clic abajo como si fueras al correo:
            </p>
            <a href={linkPrueba} className="text-sm text-blue-300 underline break-all hover:text-blue-200 transition">
                {linkPrueba}
            </a>
          </div>
        )}
      </div>
      
      <p className="mt-8 text-xs text-gray-600">
        Sistema Seguro & Privado • UTM
      </p>
    </div>
  );
}