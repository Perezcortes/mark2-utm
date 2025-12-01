import { supabase } from '@/app/lib/supabase';
import { CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';
import Image from 'next/image';

// En Next.js 15/16, searchParams es una Promesa
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ValidarPage({ searchParams }: Props) {
  // AWAIT OBLIGATORIO
  const params = await searchParams;
  const token = params.token;

  
  // Fondo con brillo Guinda (UTM)
  const BackgroundGlow = () => (
    <div className="absolute top-[-20%] left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-[#6A1B31] rounded-full blur-[140px] opacity-15 pointer-events-none"></div>
  );

  // Layout base para errores
  const ErrorView = ({ mensaje }: { mensaje: string }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white p-4 relative overflow-hidden font-sans">
      <BackgroundGlow />
      <div className="w-full max-w-md bg-[#111111]/90 backdrop-blur-xl p-8 rounded-3xl border border-red-500/20 shadow-2xl z-10 ring-1 ring-red-500/10 text-center">
         <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-500/10 rounded-full ring-1 ring-red-500/30">
                <XCircle className="w-12 h-12 text-red-500" />
            </div>
         </div>
         <h2 className="text-xl font-bold text-white mb-2">Enlace no válido</h2>
         <p className="text-gray-400 text-sm leading-relaxed">{mensaje}</p>
         <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Sistema de Seguridad UTM</p>
         </div>
      </div>
    </div>
  );

  // --- LÓGICA DE VALIDACIÓN ---

  if (!token || typeof token !== 'string') {
    return <ErrorView mensaje="No se proporcionó un token de seguridad válido." />;
  }

  // Buscar token en DB
  const { data: magicToken, error } = await supabase
    .from('magic_tokens')
    .select('*, students(*)') 
    .eq('token', token)
    .single();

  if (error || !magicToken) return <ErrorView mensaje="Este enlace no existe o es incorrecto." />;
  if (magicToken.used) return <ErrorView mensaje="Este enlace de seguridad ya fue utilizado anteriormente." />;
  if (new Date() > new Date(magicToken.expires_at)) return <ErrorView mensaje="El tiempo de seguridad (15 min) ha expirado. Solicita uno nuevo." />;

  // --- ÉXITO: QUEMAR EL TOKEN Y ACTIVAR ---
  await supabase.from('magic_tokens').update({ used: true }).eq('id', magicToken.id);
  await supabase.from('students').update({ credencial_activa: true }).eq('id', magicToken.student_id);

  // --- VISTA DE ÉXITO ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white p-4 relative overflow-hidden font-sans">
      
      <BackgroundGlow />

      {/* Tarjeta de Éxito */}
      <div className="w-full max-w-md bg-[#111111]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl z-10 ring-1 ring-white/5 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Encabezado con Logo y Check */}
        <div className="flex flex-col items-center mb-8">
            {/* Logo UTM pequeño estilo App Icon */}
            <div className="mb-6 p-2 bg-white rounded-xl shadow-lg ring-1 ring-white/20">
                <Image 
                  src="/logo-utm.png" 
                  alt="Escudo UTM" 
                  width={50} 
                  height={50} 
                  className="object-contain"
                />
            </div>

            {/* Icono de Check Animado */}
            <div className="p-4 bg-green-500/10 rounded-full ring-1 ring-green-500/20 mb-4">
               <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={2} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white text-center">
              Identidad Verificada
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Acceso concedido correctamente
            </p>
        </div>

        {/* Datos del Alumno */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/5 space-y-4">
           <div className="text-center pb-4 border-b border-white/5">
              <p className="text-gray-500 text-[10px] uppercase tracking-widest font-semibold mb-1">Nombre del Alumno</p>
              <p className="text-lg font-medium text-white">{magicToken.students.nombre}</p>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-semibold mb-1">Matrícula</p>
                <p className="font-mono text-sm text-gray-300">{magicToken.students.matricula}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-semibold mb-1">CURP</p>
                <p className="font-mono text-sm text-gray-300 truncate">{magicToken.students.curp}</p>
              </div>
           </div>
        </div>

        {/* Badge de Estado */}
        <div className="pt-8 flex justify-center">
           <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#6A1B31]/20 text-[#ff8ba7] text-xs font-medium ring-1 ring-[#6A1B31]/40 shadow-lg shadow-[#6A1B31]/10">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Credencial Digital Activada
           </div>
        </div>

        <p className="text-[10px] text-gray-600 pt-6 text-center">
          Esta ventana se puede cerrar de forma segura.
        </p>

      </div>
    </div>
  );
}