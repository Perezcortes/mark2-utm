'use client';
import Link from 'next/link';
import { ArrowLeft, CreditCard } from 'lucide-react';

export default function CredencialDigitalPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white font-sans">
      
      {/* Barra de Navegación */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md z-20">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </Link>
        <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#6A1B31]" />
            <span className="text-sm font-bold tracking-widest uppercase">Tu Credencial</span>
        </div>
      </header>

      {/* Contenedor Principal */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative">
        
        {/* Glow Effect Central */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Marco del Diseño */}
        <div className="w-full h-[75vh] max-w-6xl bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative z-10">
            <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center">
                 {/* Iframe del Diseño Estático */}
                 <iframe 
                    style={{ border: 'none' }}
                    className="w-full h-full"
                    src="https://embed.figma.com/proto/SYC8LB5srMNqlBTvcvRxPh/MarkII?node-id=163-258&p=f&scaling=min-zoom&content-scaling=fixed&page-id=163%3A240&embed-host=share" 
                    allowFullScreen
                    loading="lazy"
                />
            </div>
        </div>

        <p className="mt-6 text-gray-500 text-sm font-mono flex items-center gap-2">
            Diseño de Alta Fidelidad • Vista Previa
        </p>

      </main>
    </div>
  );
}