#!/bin/bash

# 🚀 Script de Solución Rápida para English Master Pro
# Este script te ayudará a resolver el problema del repositorio 404

echo "=================================================="
echo "🔍 DIAGNÓSTICO Y SOLUCIÓN - English Master Pro"
echo "=================================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar que estamos en el directorio correcto
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Error: Este script debe ejecutarse desde el directorio del repositorio${NC}"
    exit 1
fi

echo -e "${BLUE}📍 Directorio actual:${NC} $(pwd)"
echo ""

# Paso 1: Verificar estado local
echo -e "${YELLOW}📊 PASO 1: Verificando estado del código local...${NC}"
echo ""
git status
echo ""
echo -e "${GREEN}✅ Últimos commits:${NC}"
git log --oneline -5
echo ""

# Paso 2: Verificar archivos críticos
echo -e "${YELLOW}📋 PASO 2: Verificando archivos críticos...${NC}"
echo ""

files_to_check=(
    "app/api/health/route.ts"
    "app/api/auth/signup/route.ts"
    "lib/db.ts"
    "package.json"
    "prisma/schema.prisma"
)

all_files_exist=true
for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file"
    else
        echo -e "${RED}❌${NC} $file ${RED}(FALTA)${NC}"
        all_files_exist=false
    fi
done
echo ""

if [ "$all_files_exist" = true ]; then
    echo -e "${GREEN}✅ Todos los archivos críticos están presentes${NC}"
else
    echo -e "${RED}⚠️  Algunos archivos críticos faltan${NC}"
fi
echo ""

# Paso 3: Opciones de solución
echo -e "${YELLOW}🎯 PASO 3: Opciones de Solución${NC}"
echo ""
echo "Selecciona una opción:"
echo ""
echo "1) 🔄 Intentar push al repositorio existente (necesitas token válido)"
echo "2) 🆕 Preparar para push a repositorio nuevo"
echo "3) 🚀 Deploy directo con Vercel CLI"
echo "4) 🌐 Deploy directo con Netlify CLI"
echo "5) ℹ️  Ver información del repositorio remoto"
echo "6) ❌ Salir"
echo ""
read -p "Ingresa tu opción (1-6): " option

case $option in
    1)
        echo ""
        echo -e "${BLUE}🔄 Opción 1: Push al repositorio existente${NC}"
        echo ""
        echo "Para hacer push, necesitas:"
        echo "1. Un token de GitHub con permisos 'repo'"
        echo "2. Ejecutar: git push -u origin main"
        echo ""
        read -p "¿Tienes un token válido? (s/n): " has_token
        if [ "$has_token" = "s" ] || [ "$has_token" = "S" ]; then
            echo ""
            echo "Ejecuta este comando (reemplaza TOKEN con tu token):"
            echo ""
            echo -e "${GREEN}git remote set-url origin https://TOKEN@github.com/MichaelAriasFerreras/english-master-pro.git${NC}"
            echo -e "${GREEN}git push -u origin main${NC}"
        else
            echo ""
            echo "Crea un token en: https://github.com/settings/tokens"
            echo "Permisos necesarios: repo, workflow"
        fi
        ;;
    2)
        echo ""
        echo -e "${BLUE}🆕 Opción 2: Preparar para repositorio nuevo${NC}"
        echo ""
        echo "Pasos a seguir:"
        echo ""
        echo "1. Ve a: https://github.com/new"
        echo "2. Nombre: english-master-pro"
        echo "3. Visibilidad: Público"
        echo "4. NO inicialices con README"
        echo "5. Después de crear, ejecuta:"
        echo ""
        echo -e "${GREEN}git remote set-url origin https://github.com/MichaelAriasFerreras/english-master-pro.git${NC}"
        echo -e "${GREEN}git push -u origin main${NC}"
        ;;
    3)
        echo ""
        echo -e "${BLUE}🚀 Opción 3: Deploy con Vercel CLI${NC}"
        echo ""
        echo "Instalando Vercel CLI..."
        npm install -g vercel
        echo ""
        echo "Ahora ejecuta:"
        echo -e "${GREEN}vercel login${NC}"
        echo "Luego:"
        echo -e "${GREEN}vercel --prod${NC}"
        ;;
    4)
        echo ""
        echo -e "${BLUE}🌐 Opción 4: Deploy con Netlify CLI${NC}"
        echo ""
        echo "Instalando Netlify CLI..."
        npm install -g netlify-cli
        echo ""
        echo "Ahora ejecuta:"
        echo -e "${GREEN}netlify login${NC}"
        echo "Luego:"
        echo -e "${GREEN}netlify deploy --prod${NC}"
        ;;
    5)
        echo ""
        echo -e "${BLUE}ℹ️  Información del repositorio remoto:${NC}"
        echo ""
        git remote -v
        echo ""
        echo "Configuración actual:"
        cat .git/config | grep -A 2 "\[remote"
        ;;
    6)
        echo ""
        echo "👋 Saliendo..."
        exit 0
        ;;
    *)
        echo ""
        echo -e "${RED}❌ Opción inválida${NC}"
        exit 1
        ;;
esac

echo ""
echo "=================================================="
echo "✅ Script completado"
echo "=================================================="
echo ""
echo "📚 Para más información, consulta:"
echo "   - DIAGNOSTICO_REPOSITORIO_404.md"
echo "   - PUSH_TO_GITHUB_INSTRUCTIONS.md"
echo ""
