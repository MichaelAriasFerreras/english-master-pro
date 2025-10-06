# 🎨 Guía Visual Paso a Paso - Configuración de Variables de Entorno

## 📱 Capturas de Pantalla Descriptivas

Esta guía te muestra exactamente qué verás en cada paso de la configuración.

---

## 🖥️ PASO 1: Acceder a Vercel

### Lo que verás:

```
┌─────────────────────────────────────────────────────────┐
│  VERCEL                                    [Tu Avatar]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📁 english-master-pro                                   │
│     maicol-23's projects                                 │
│                                                          │
│     🟢 Production: Ready                                 │
│     https://english-master-pro-4hyh-5cpkkw03...         │
│                                                          │
│     [Visit] [Settings] [Deployments]                    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Acción:** Haz clic en el botón **"Settings"** (o en el ícono de engranaje ⚙️)

---

## ⚙️ PASO 2: Menú de Settings

### Lo que verás en la barra lateral:

```
┌──────────────────────┐
│ ⚙️ Settings          │
├──────────────────────┤
│ General              │
│ Domains              │
│ Environment Variables│ ← HAZ CLIC AQUÍ
│ Git                  │
│ Functions            │
│ Security             │
│ Advanced             │
└──────────────────────┘
```

**Acción:** Haz clic en **"Environment Variables"**

---

## 🔐 PASO 3: Página de Environment Variables

### Lo que verás:

```
┌─────────────────────────────────────────────────────────────────┐
│  Environment Variables                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Environment variables are encrypted and stored securely.       │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Key                    Value              Environment   │    │
│  ├────────────────────────────────────────────────────────┤    │
│  │ DATABASE_URL          postgresql://...    Production   │    │
│  │                                           Preview       │    │
│  │                                           Development   │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Add New                                                  │   │
│  │                                                          │   │
│  │ Key:    [                                    ]          │   │
│  │                                                          │   │
│  │ Value:  [                                    ]          │   │
│  │                                                          │   │
│  │ Environment:  ☐ Production                              │   │
│  │               ☐ Preview                                 │   │
│  │               ☐ Development                             │   │
│  │                                                          │   │
│  │                                    [Add]                │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ➕ PASO 4: Agregar NEXTAUTH_URL

### Formulario completado:

```
┌─────────────────────────────────────────────────────────┐
│ Add New Environment Variable                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Key:    [NEXTAUTH_URL                          ]        │
│                                                          │
│ Value:  [https://english-master-pro-4hyh-5cpkkw03-maico│
│         l-23s-projects.vercel.app              ]        │
│                                                          │
│ Environment:  ☑ Production                              │
│               ☑ Preview                                 │
│               ☑ Development                             │
│                                                          │
│                                    [Add] ← CLIC AQUÍ    │
└─────────────────────────────────────────────────────────┘
```

**Valores exactos a copiar:**
- **Key:** `NEXTAUTH_URL`
- **Value:** `https://english-master-pro-4hyh-5cpkkw03-maicol-23s-projects.vercel.app`
- **Environments:** Marca las 3 casillas ✅

---

## 🔑 PASO 5: Agregar NEXTAUTH_SECRET

### Formulario completado:

```
┌─────────────────────────────────────────────────────────┐
│ Add New Environment Variable                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Key:    [NEXTAUTH_SECRET                       ]        │
│                                                          │
│ Value:  [v2rgKENjMY7g44VhO1bm_9By-CR08EsD65WB7b6ftVPSx5│
│         kzs7VJdVL5L_AEij0y                     ]        │
│                                                          │
│ Environment:  ☑ Production                              │
│               ☑ Preview                                 │
│               ☑ Development                             │
│                                                          │
│                                    [Add] ← CLIC AQUÍ    │
└─────────────────────────────────────────────────────────┘
```

**Valores exactos a copiar:**
- **Key:** `NEXTAUTH_SECRET`
- **Value:** `v2rgKENjMY7g44VhO1bm_9By-CR08EsD65WB7b6ftVPSx5kzs7VJdVL5L_AEij0y`
- **Environments:** Marca las 3 casillas ✅

---

## 🔍 PASO 6: Verificar ABACUSAI_API_KEY

### Busca esta variable en tu lista:

```
┌────────────────────────────────────────────────────────┐
│ Key                    Value              Environment   │
├────────────────────────────────────────────────────────┤
│ DATABASE_URL          postgresql://...    Production   │
│ NEXTAUTH_URL          https://english...  Production   │
│ NEXTAUTH_SECRET       v2rgKENjMY7g...     Production   │
│ ABACUSAI_API_KEY      b96f9ba8bf10...     Production   │ ← ¿Existe?
└────────────────────────────────────────────────────────┘
```

**Si NO existe ABACUSAI_API_KEY, agrégala:**
- **Key:** `ABACUSAI_API_KEY`
- **Value:** `b96f9ba8bf1043f0a9f2d48c87dc3d8b`
- **Environments:** Marca las 3 casillas ✅

---

## ✅ PASO 7: Lista Final de Variables

### Deberías ver algo así:

```
┌────────────────────────────────────────────────────────────┐
│  Your Environment Variables                                │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ✅ DATABASE_URL                                            │
│     Value: postgresql://role_e5bb98f2a:***                 │
│     Environments: Production, Preview, Development         │
│                                                             │
│  ✅ NEXTAUTH_URL                                            │
│     Value: https://english-master-pro-4hyh-5cpkkw03-***    │
│     Environments: Production, Preview, Development         │
│                                                             │
│  ✅ NEXTAUTH_SECRET                                         │
│     Value: v2rgKENjMY7g44VhO1bm_9By-***                    │
│     Environments: Production, Preview, Development         │
│                                                             │
│  ✅ ABACUSAI_API_KEY                                        │
│     Value: b96f9ba8bf1043f0a9f2d48c87dc3d8b               │
│     Environments: Production, Preview, Development         │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**Total: 4 variables configuradas** ✅

---

## 🔄 PASO 8: Redesplegar

### Opción A: Desde Deployments

```
┌─────────────────────────────────────────────────────────┐
│  Deployments                                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  🟢 Production                                           │
│     Oct 5, 2025 at 9:41 PM                              │
│     main@abc1234                                        │
│     https://english-master-pro-4hyh...                  │
│                                                          │
│     [Visit] [⋮] ← CLIC EN LOS 3 PUNTOS                  │
│                                                          │
└─────────────────────────────────────────────────────────┘

Menú desplegable:
┌──────────────────┐
│ View Deployment  │
│ Redeploy        │ ← CLIC AQUÍ
│ Promote to Prod  │
│ Instant Rollback │
└──────────────────┘
```

### Confirmación:

```
┌─────────────────────────────────────────────────────────┐
│  Redeploy to Production?                                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  This will create a new deployment with the same        │
│  source code and updated environment variables.         │
│                                                          │
│  ⚠️ Your site will be briefly unavailable during        │
│     the deployment process.                             │
│                                                          │
│                    [Cancel]  [Redeploy] ← CLIC AQUÍ     │
└─────────────────────────────────────────────────────────┘
```

---

## ⏱️ PASO 9: Esperar el Despliegue

### Lo que verás:

```
┌─────────────────────────────────────────────────────────┐
│  🔄 Building...                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ⏳ Queued                                    ✅         │
│  ⏳ Building                                  🔄         │
│  ⏳ Deploying                                 ⏸️         │
│                                                          │
│  Estimated time: 1-3 minutes                            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Espera hasta ver:**

```
┌─────────────────────────────────────────────────────────┐
│  ✅ Deployment Complete                                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Your deployment is now live!                           │
│                                                          │
│  🌐 https://english-master-pro-4hyh-5cpkkw03-maicol-23s-│
│     projects.vercel.app                                 │
│                                                          │
│                                    [Visit] ← CLIC AQUÍ  │
└─────────────────────────────────────────────────────────┘
```

---

## 🎉 PASO 10: Verificar la Aplicación

### Lo que deberías ver al visitar tu sitio:

```
┌─────────────────────────────────────────────────────────┐
│  🎓 English Master Pro                    [Login] [Sign Up]│
├─────────────────────────────────────────────────────────┤
│                                                          │
│         Master English with AI-Powered Learning         │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Grammar  │  │ Speaking │  │ Writing  │             │
│  │ Lessons  │  │ Practice │  │ Skills   │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                          │
│  [Start Learning] [View Courses]                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**✅ Si ves esto = ¡TODO FUNCIONA!**

**❌ Si ves un error:**
- Revisa los logs en Vercel
- Verifica que todas las variables estén correctas
- Espera 2-3 minutos más
- Limpia la caché del navegador (Ctrl+Shift+R)

---

## 📋 Checklist Visual

Marca cada paso cuando lo completes:

```
┌─────────────────────────────────────────────────────────┐
│  Configuración de Variables de Entorno                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [ ] 1. Acceder a Vercel                                │
│  [ ] 2. Ir a Settings → Environment Variables           │
│  [ ] 3. Agregar NEXTAUTH_URL                            │
│  [ ] 4. Agregar NEXTAUTH_SECRET                         │
│  [ ] 5. Verificar ABACUSAI_API_KEY                      │
│  [ ] 6. Verificar DATABASE_URL                          │
│  [ ] 7. Ir a Deployments                                │
│  [ ] 8. Hacer clic en ⋮ → Redeploy                      │
│  [ ] 9. Confirmar Redeploy                              │
│  [ ] 10. Esperar 1-3 minutos                            │
│  [ ] 11. Visitar la aplicación                          │
│  [ ] 12. ✅ ¡Verificar que funciona!                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🆘 Problemas Comunes y Soluciones

### ❌ Error: "Application error: a server-side exception has occurred"

**Causa:** Variables de entorno faltantes o incorrectas

**Solución:**
1. Verifica que TODAS las variables estén agregadas
2. Verifica que no haya espacios extra al copiar/pegar
3. Asegúrate de que estén en "Production"
4. Redesplega nuevamente

---

### ❌ Error: "Database connection failed"

**Causa:** DATABASE_URL incorrecta o base de datos inactiva

**Solución:**
1. Ve a tu dashboard de Neon PostgreSQL
2. Verifica que la base de datos esté activa
3. Copia nuevamente la connection string
4. Actualiza DATABASE_URL en Vercel
5. Redesplega

---

### ❌ Error: "Invalid NEXTAUTH_URL"

**Causa:** URL incorrecta o con espacios

**Solución:**
1. Copia exactamente: `https://english-master-pro-4hyh-5cpkkw03-maicol-23s-projects.vercel.app`
2. NO agregues espacios al inicio o final
3. NO agregues "/" al final
4. Redesplega

---

### ❌ La página carga pero no puedo iniciar sesión

**Causa:** NEXTAUTH_SECRET faltante o incorrecto

**Solución:**
1. Verifica que NEXTAUTH_SECRET esté agregado
2. Copia exactamente: `v2rgKENjMY7g44VhO1bm_9By-CR08EsD65WB7b6ftVPSx5kzs7VJdVL5L_AEij0y`
3. Redesplega
4. Limpia cookies del navegador

---

## 💡 Consejos Pro

### ✅ Buenas Prácticas:

1. **Siempre marca las 3 opciones de Environment:**
   - Production (para tu sitio en vivo)
   - Preview (para branches de prueba)
   - Development (para desarrollo local)

2. **Copia y pega, no escribas manualmente:**
   - Evita errores de tipeo
   - Asegura valores exactos

3. **Guarda tus secretos de forma segura:**
   - Usa un gestor de contraseñas
   - No los compartas en capturas de pantalla
   - No los subas a GitHub

4. **Verifica antes de redesplegar:**
   - Revisa que todas las variables estén correctas
   - Verifica que estén en "Production"
   - Asegúrate de que no haya duplicados

---

## 🎯 Resultado Final Esperado

Después de completar todos los pasos:

```
✅ Variables configuradas: 4/4
✅ Despliegue exitoso
✅ Aplicación funcionando
✅ Sin errores en consola
✅ Autenticación funcionando
✅ Base de datos conectada
✅ Todas las funcionalidades operativas

🎉 ¡Tu aplicación English Master Pro está lista para usar!
```

---

## 📞 ¿Necesitas Ayuda?

Si después de seguir todos estos pasos aún tienes problemas:

1. **Revisa los logs en Vercel:**
   - Deployments → [Tu despliegue] → View Function Logs

2. **Toma una captura de pantalla del error**

3. **Verifica que todas las variables estén exactamente como se muestran aquí**

4. **Intenta limpiar la caché del navegador:**
   - Chrome/Edge: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Safari: Cmd+Option+E

---

**Última actualización:** 6 de octubre de 2025  
**Versión:** 1.0  
**Aplicación:** English Master Pro  
**Plataforma:** Vercel

¡Buena suerte con tu despliegue! 🚀
