'use client';
import Link from 'next/link';
import { ArrowLeft, CreditCard, PlayCircle } from 'lucide-react';

export default function CredencialDigitalPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white font-sans overflow-hidden">

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
      <main className="flex-1 relative w-full h-full flex flex-col">

        {/* Glow Effect Central */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[500px] bg-[#6A1B31] rounded-full blur-[180px] opacity-10 pointer-events-none"></div>

        <div className="flex-1 w-full h-full relative bg-[#0a0a0a]">
          {/* Iframe del Diseño Estático */}
          <iframe
            style={{ border: 'none' }}
            className="w-full h-full absolute inset-0"
            src="https://embed.figma.com/proto/SYC8LB5srMNqlBTvcvRxPh/MarkII?node-id=163-258&p=f&scaling=min-zoom&content-scaling=fixed&page-id=163%3A240&embed-host=share"
            allowFullScreen
            loading="eager"
          />
        </div>
      </main>

      {/* Footer minimalista */}
      <footer className="py-2 text-center border-t border-white/5 bg-[#050505] z-20">
        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
            <PlayCircle className="w-3 h-3" />
            <span>Simulación de App en Tiempo Real</span>
        </div>
      </footer>
    </div>
  );
}