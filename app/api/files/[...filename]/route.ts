
import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import mime from 'mime-types';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const filename = resolvedParams.filename.join('/');
    const filepath = path.join(process.cwd(), 'uploads', filename);

    // Verificar que el archivo esté dentro del directorio uploads
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const normalizedFilepath = path.normalize(filepath);
    
    if (!normalizedFilepath.startsWith(uploadsDir)) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const fileBuffer = await readFile(filepath);
    const mimeType = mime.lookup(filename) || 'application/octet-stream';

    return new NextResponse(fileBuffer as BodyInit, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
  }
}
