import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

// Eliminamos fs y path porque ya no leemos archivos locales

export async function POST(request: Request) {
  try {
    const { matricula } = await request.json();

    // 1. Buscar alumno
    const { data: student, error } = await supabase
      .from('students')
      .select('*')
      .eq('matricula', matricula)
      .single();

    if (error || !student) {
      return NextResponse.json({ error: 'Alumno no encontrado' }, { status: 404 });
    }

    // 2. Generar Token
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // 3. Guardar en BD
    const { error: insertError } = await supabase
      .from('magic_tokens')
      .insert({
        token: token,
        student_id: student.id,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) throw insertError;

    // 4. Construir el Link
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://mark-ii-utm.vercel.app' 
      : 'http://localhost:3000';
      
    const magicLink = `${baseUrl}/validar?token=${token}`;

    // 5. CONFIGURAR TRANSPORTE SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Colores y URL del Logo
    const utmGuinda = '#6A1B31'; 
    const utmGris = '#4a4a4a';
    const logoUrl = 'https://dgesui.ses.sep.gob.mx/sep.subsidioentransparencia.mx/images/universidades/escudos/UTM.png';

    // 6. DISEÑO HTML CORREGIDO (Sin emojis y con logo web)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        .boton-utm { background-color: ${utmGuinda} !important; }
        .boton-utm:hover { background-color: #8c2441 !important; }
      </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); max-width: 90%;">
                
                <tr>
                  <td bgcolor="${utmGuinda}" style="padding: 30px; text-align: center;">
                    <img src="${logoUrl}" alt="Logo UTM" width="120" style="display: block; margin: 0 auto 15px; width: 120px; height: auto; border: 0;"/>
                    
                    <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 500; letter-spacing: 0.5px;">Universidad Tecnológica de la Mixteca</h1>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="color: ${utmGris}; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                      Hola, <strong>${student.nombre}</strong>.
                    </p>
                    <p style="color: ${utmGris}; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                      Se ha solicitado la activación de tu credencial digital. Para verificar tu identidad de forma segura, utiliza el siguiente botón.
                    </p>
                    
                    <div style="text-align: center; margin-bottom: 30px;">
                      <a href="${magicLink}" class="boton-utm" style="background-color: ${utmGuinda}; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block;">
                        Verificar Identidad
                      </a>
                    </div>
                    
                    <p style="color: #888888; font-size: 13px; text-align: center; line-height: 1.5;">
                      Enlace válido por 15 minutos.<br>
                      Si no realizaste esta solicitud, ignora este mensaje.
                    </p>
                  </td>
                </tr>
                
                <tr>
                  <td bgcolor="#f9f9f9" style="padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                    <p style="color: #999999; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} Universidad Tecnológica de la Mixteca
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Identidad UTM" <${process.env.SMTP_USER}>`,
      to: student.email,
      subject: 'Verificación de Identidad Digital UTM', // Sin emojis
      html: htmlContent,
    });

    return NextResponse.json({ 
      success: true, 
      message: `Correo enviado a ${student.email}`
    });

  } catch (error) {
    console.error('Error enviando correo:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}