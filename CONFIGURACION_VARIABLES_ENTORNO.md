# 🔧 Guía de Configuración de Variables de Entorno - English Master Pro

## 📋 Resumen del Problema

Tu aplicación está desplegada en Vercel pero muestra el error: **"Application error: a server-side exception has occurred"**

Este error ocurre porque faltan variables de entorno críticas que la aplicación necesita para funcionar correctamente.

---

## ✅ Variables de Entorno Requeridas

Tu aplicación necesita las siguientes variables de entorno:

### 1. **DATABASE_URL** ✓ (Ya configurada)
```
postgresql://role_e5bb98f2a:GciZG3cNwpc1FkYgzd9WGFcx7MxvJirs@db-e5bb98f2a.db002.hosteddb.reai.io:5432/e5bb98f2a?connect_timeout=15
```
**Estado:** Ya está configurada en Vercel cuando conectaste tu base de datos Neon PostgreSQL.

### 2. **NEXTAUTH_URL** ⚠️ (DEBE CONFIGURARSE)
```
https://english-master-pro-4hyh-5cpkkw03-maicol-23s-projects.vercel.app
```
**Descripción:** Esta es la URL completa de tu aplicación desplegada en Vercel. NextAuth la necesita para manejar la autenticación correctamente.

### 3. **NEXTAUTH_SECRET** ⚠️ (DEBE CONFIGURARSE)
```
v2rgKENjMY7g44VhO1bm_9By-CR08EsD65WB7b6ftVPSx5kzs7VJdVL5L_AEij0y
```
**Descripción:** Esta es una clave secreta generada aleatoriamente que NextAuth usa para encriptar tokens y sesiones. **NUNCA compartas esta clave públicamente.**

### 4. **ABACUSAI_API_KEY** ✓ (Ya incluida en el código)
```
b96f9ba8bf1043f0a9f2d48c87dc3d8b
```
**Descripción:** Clave API para los servicios de Abacus.AI que usa tu aplicación.

### 5. **OPENAI_API_KEY** ℹ️ (Opcional)
```
[Dejar vacío por ahora - no se usa actualmente en el código]
```
**Descripción:** No encontré uso activo de OpenAI en el código actual, así que esta variable es opcional por ahora.

---

## 🚀 Pasos para Configurar las Variables en Vercel

### **Paso 1: Acceder a tu Proyecto en Vercel**

1. Ve a [https://vercel.com](https://vercel.com)
2. Inicia sesión con tu cuenta
3. Haz clic en tu proyecto **"english-master-pro"**

### **Paso 2: Ir a la Configuración de Variables de Entorno**

1. En la página de tu proyecto, busca en la barra lateral izquierda
2. Haz clic en **"Settings"** (Configuración)
3. En el menú de configuración, haz clic en **"Environment Variables"** (Variables de Entorno)

### **Paso 3: Agregar las Variables de Entorno**

Ahora vas a agregar **DOS variables nuevas** (DATABASE_URL ya debería estar configurada):

#### **Variable 1: NEXTAUTH_URL**

1. En el campo **"Key"** (Clave), escribe exactamente:
   ```
   NEXTAUTH_URL
   ```

2. En el campo **"Value"** (Valor), copia y pega exactamente:
   ```
   https://english-master-pro-4hyh-5cpkkw03-maicol-23s-projects.vercel.app
   ```

3. En **"Environment"** (Entorno), selecciona:
   - ✅ **Production** (Producción)
   - ✅ **Preview** (Vista previa)
   - ✅ **Development** (Desarrollo)

4. Haz clic en **"Add"** (Agregar) o **"Save"** (Guardar)

#### **Variable 2: NEXTAUTH_SECRET**

1. En el campo **"Key"** (Clave), escribe exactamente:
   ```
   NEXTAUTH_SECRET
   ```

2. En el campo **"Value"** (Valor), copia y pega exactamente:
   ```
   v2rgKENjMY7g44VhO1bm_9By-CR08EsD65WB7b6ftVPSx5kzs7VJdVL5L_AEij0y
   ```

3. En **"Environment"** (Entorno), selecciona:
   - ✅ **Production** (Producción)
   - ✅ **Preview** (Vista previa)
   - ✅ **Development** (Desarrollo)

4. Haz clic en **"Add"** (Agregar) o **"Save"** (Guardar)

#### **Variable 3: ABACUSAI_API_KEY** (Verificar)

1. Verifica si esta variable ya existe en tu lista
2. Si NO existe, agrégala:
   - **Key:** `ABACUSAI_API_KEY`
   - **Value:** `b96f9ba8bf1043f0a9f2d48c87dc3d8b`
   - **Environment:** Production, Preview, Development

### **Paso 4: Verificar DATABASE_URL**

1. En la lista de variables de entorno, busca **DATABASE_URL**
2. Debería estar ahí con un valor que empieza con `postgresql://`
3. Si NO está, agrégala:
   - **Key:** `DATABASE_URL`
   - **Value:** `postgresql://role_e5bb98f2a:GciZG3cNwpc1FkYgzd9WGFcx7MxvJirs@db-e5bb98f2a.db002.hosteddb.reai.io:5432/e5bb98f2a?connect_timeout=15`
   - **Environment:** Production, Preview, Development

---

## 🔄 Paso 5: Redesplegar la Aplicación

Después de agregar todas las variables de entorno, necesitas redesplegar tu aplicación:

### **Opción A: Redeploy Automático (Recomendado)**

1. Ve a la pestaña **"Deployments"** (Despliegues) en tu proyecto
2. Busca el despliegue más reciente (el primero en la lista)
3. Haz clic en los tres puntos **"..."** al lado derecho
4. Selecciona **"Redeploy"** (Redesplegar)
5. Confirma haciendo clic en **"Redeploy"** nuevamente

### **Opción B: Nuevo Commit (Alternativa)**

1. Haz cualquier pequeño cambio en tu repositorio de GitHub
2. Por ejemplo, edita el archivo README.md
3. Haz commit y push
4. Vercel automáticamente detectará el cambio y redesplegará

---

## ✅ Verificación Final

Después del redespliegue (toma 1-3 minutos):

1. Ve a tu URL de producción:
   ```
   https://english-master-pro-4hyh-5cpkkw03-maicol-23s-projects.vercel.app
   ```

2. La aplicación debería cargar correctamente sin errores

3. Deberías poder:
   - Ver la página principal
   - Navegar por las diferentes secciones
   - Registrarte/iniciar sesión
   - Usar todas las funcionalidades

---

## 🔒 Seguridad - IMPORTANTE

### ⚠️ **NUNCA hagas lo siguiente:**

1. ❌ **NO** subas archivos `.env` a GitHub
2. ❌ **NO** compartas tu `NEXTAUTH_SECRET` públicamente
3. ❌ **NO** compartas tu `DATABASE_URL` públicamente
4. ❌ **NO** incluyas variables de entorno en capturas de pantalla públicas

### ✅ **Buenas prácticas:**

1. ✅ Las variables de entorno solo deben estar en Vercel
2. ✅ El archivo `.env.template` puede estar en GitHub (sin valores reales)
3. ✅ Para desarrollo local, crea un archivo `.env.local` (está en .gitignore)
4. ✅ Guarda tus secretos en un gestor de contraseñas seguro

---

## 📝 Resumen de Variables

| Variable | Estado | Valor |
|----------|--------|-------|
| DATABASE_URL | ✓ Ya configurada | `postgresql://role_e5bb98f2a:...` |
| NEXTAUTH_URL | ⚠️ Debe agregarse | `https://english-master-pro-4hyh-5cpkkw03-maicol-23s-projects.vercel.app` |
| NEXTAUTH_SECRET | ⚠️ Debe agregarse | `v2rgKENjMY7g44VhO1bm_9By-CR08EsD65WB7b6ftVPSx5kzs7VJdVL5L_AEij0y` |
| ABACUSAI_API_KEY | ℹ️ Verificar | `b96f9ba8bf1043f0a9f2d48c87dc3d8b` |
| OPENAI_API_KEY | ℹ️ Opcional | No requerida actualmente |

---

## 🆘 Solución de Problemas

### Si después del redespliegue aún ves errores:

1. **Verifica que todas las variables estén escritas exactamente como se muestra** (sin espacios extra)
2. **Asegúrate de que las variables estén en "Production"**
3. **Espera 2-3 minutos después del redespliegue**
4. **Limpia la caché del navegador** (Ctrl+Shift+R o Cmd+Shift+R)
5. **Revisa los logs en Vercel:**
   - Ve a tu proyecto en Vercel
   - Haz clic en "Deployments"
   - Haz clic en el despliegue más reciente
   - Revisa los logs para ver errores específicos

### Si ves errores de base de datos:

1. Verifica que DATABASE_URL esté correctamente configurada
2. Asegúrate de que la base de datos Neon esté activa
3. Verifica que las migraciones de Prisma se hayan ejecutado

---

## 📞 Siguiente Paso

Una vez que hayas configurado todas las variables y redesplegado:

1. Prueba tu aplicación en la URL de producción
2. Si todo funciona correctamente, ¡tu aplicación estará lista para usar! 🎉
3. Si encuentras algún problema, revisa los logs en Vercel o contáctame con los detalles del error

---

**Fecha de creación:** 6 de octubre de 2025  
**Aplicación:** English Master Pro  
**Plataforma:** Vercel  
**Estado:** Listo para configurar

---

## 🎯 Checklist Rápido

- [ ] Acceder a Vercel → Settings → Environment Variables
- [ ] Agregar NEXTAUTH_URL con la URL de producción
- [ ] Agregar NEXTAUTH_SECRET con el valor generado
- [ ] Verificar que DATABASE_URL existe
- [ ] Verificar que ABACUSAI_API_KEY existe
- [ ] Redesplegar la aplicación
- [ ] Esperar 2-3 minutos
- [ ] Probar la aplicación en el navegador
- [ ] ✅ ¡Aplicación funcionando!
