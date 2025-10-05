
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se encontró archivo' }, { status: 400 });
    }

    // Validaciones
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Archivo muy grande (máximo 5MB)' }, { status: 400 });
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no válido' }, { status: 400 });
    }

    // Crear directorio si no existe
    const uploadsDir = path.join(process.cwd(), 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Generar nombre único
    const timestamp = Date.now();
    const extension = path.extname(file.name);
    const filename = `profile-${session.user.id}-${timestamp}${extension}`;
    const filepath = path.join(uploadsDir, filename);

    // Guardar archivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Actualizar usuario en base de datos
    const imageUrl = `/api/files/${filename}`;
    
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl }
    });

    return NextResponse.json({ 
      success: true,
      imageUrl,
      message: 'Imagen subida correctamente'
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}
