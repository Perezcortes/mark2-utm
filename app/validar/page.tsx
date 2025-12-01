import { supabase } from '@/app/lib/supabase';
// 1. IMPORTAMOS EL ICONO PROFESIONAL
import { CheckCircle2, ShieldCheck } from 'lucide-react';

// En Next.js 15/16, searchParams es una Promesa
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ValidarPage({ searchParams }: Props) {
  // AWAIT OBLIGATORIO
  const params = await searchParams;
  const token = params.token;

  if (!token || typeof token !== 'string') {
    // Usamos un icono de escudo para errores también, se ve mejor
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
         <ShieldCheck className="w-16 h-16 text-red-500 mb-4" />
         <p>Token no proporcionado o inválido.</p>
      </div>
    );
  }

  // Buscar token en DB
  const { data: magicToken, error } = await supabase
    .from('magic_tokens')
    .select('*, students(*)') 
    .eq('token', token)
    .single();

  // Validaciones de Seguridad (Errores con estilo)
  const ErrorPantalla = ({ mensaje }: { mensaje: string }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
       <ShieldCheck className="w-16 h-16 text-red-500 mb-4 opacity-50" />
       <p className="text-xl font-semibold text-red-500">{mensaje}</p>
    </div>
  );

  if (error || !magicToken) return <ErrorPantalla mensaje="Token inválido o no encontrado." />;
  if (magicToken.used) return <ErrorPantalla mensaje="ESTE ENLACE YA FUE UTILIZADO." />;
  if (new Date() > new Date(magicToken.expires_at)) return <ErrorPantalla mensaje="EL ENLACE HA CADUCADO." />;

  // QUEMAR EL TOKEN Y ACTIVAR
  await supabase.from('magic_tokens').update({ used: true }).eq('id', magicToken.id);
  await supabase.from('students').update({ credencial_activa: true }).eq('id', magicToken.student_id);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white p-4">
      
      {/* Tarjeta de Éxito */}
      <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8 w-full max-w-md text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* 2. ICONO PROFESIONAL CON ANILLO */}
        <div className="flex justify-center">
          <div className="p-4 bg-green-500/10 rounded-full ring-1 ring-green-500/30">
            {/* Usamos CheckCircle2, strokeWidth lo hace más fino y elegante */}
            <CheckCircle2 className="w-20 h-20 text-green-500" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Identidad Verificada
          </h1>
          <p className="text-gray-400 text-lg">
            Bienvenido/a, <span className="text-white font-medium">{magicToken.students.nombre}</span>
          </p>
        </div>

        <div className="py-6 border-t border-b border-gray-800 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500 uppercase text-xs font-semibold tracking-wider">Matrícula</span>
            <span className="font-mono">{magicToken.students.matricula}</span>
          </div>
          <div className="flex justify-between">
             <span className="text-gray-500 uppercase text-xs font-semibold tracking-wider">CURP</span>
            <span className="font-mono text-sm">{magicToken.students.curp}</span>
          </div>
        </div>

        <div className="pt-2">
           <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-900/30 text-blue-400 text-sm font-medium ring-1 ring-blue-500/30">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Credencial Digital Lista
           </div>
        </div>

        <p className="text-xs text-gray-600 pt-4">
          Ya puedes cerrar esta ventana de forma segura.
        </p>

      </div>
    </div>
  );
}