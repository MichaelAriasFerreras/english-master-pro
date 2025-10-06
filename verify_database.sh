#!/bin/bash

# Script de Verificación Rápida de la Base de Datos Neon
# English Master Pro

echo "🔍 Verificando Base de Datos de Neon..."
echo ""

export DATABASE_URL="postgresql://neondb_owner:npg_Xuf4k9YDxOts@ep-muddy-mode-adh58rf1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

cd /home/ubuntu/github_repos/english_master_pro_improved

npx tsx check_neon_db.ts

echo ""
echo "✅ Verificación completada!"
echo ""
echo "Si ves datos (palabras > 1000, verbos > 900), todo está correcto."
echo "La aplicación en Vercel debería mostrar todo el contenido."
