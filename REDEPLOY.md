# Sistema de Redeploy en Cloudflare Pages

Este documento explica cómo funciona el sistema de redeploy automático integrado en el panel de administración.

## 🎯 ¿Qué es?

El sistema de redeploy permite disparar un nuevo despliegue de tu sitio en Cloudflare Pages directamente desde el panel de administración, sin necesidad de hacer commits o usar la terminal.

## 🔧 Componentes

### 1. Webhook de Cloudflare Pages

- **Variable de entorno**: `CF_PAGES_DEPLOY_HOOK`
- **Ubicación**: `.env.local`
- **Formato**: URL completa del webhook de deploy

### 2. API Endpoint

- **Ruta**: `/api/redeploy`
- **Archivo**: `src/app/api/redeploy/route.ts`
- **Método**: POST
- **Autenticación**: Requiere usuario autenticado

### 3. Componente de UI

- **Componente**: `RedeployButton`
- **Archivo**: `src/components/RedeployButton.tsx`
- **Ubicación**: Página `/admin`

### 4. Página de Administración

- **Ruta**: `/admin`
- **Archivo**: `src/app/admin/page.tsx`
- **Acceso**: Solo usuarios autenticados

## 📋 Flujo de Funcionamiento

```
Usuario → Botón "Redeploy" → Confirmación → POST /api/redeploy
    ↓
Validación de autenticación
    ↓
Disparar webhook de Cloudflare
    ↓
Cloudflare Pages inicia build
    ↓
Sitio actualizado (2-5 minutos)
```

## 🔐 Seguridad

### Autenticación

El endpoint `/api/redeploy` valida que el usuario esté autenticado:

```typescript
const {
  data: { user },
  error: authError,
} = await supabase.auth.getUser();
if (authError || !user) {
  return NextResponse.json(
    { ok: false, error: "No autenticado" },
    { status: 401 }
  );
}
```

### Variables de Entorno

- El webhook URL nunca se expone al cliente
- Solo está disponible en el servidor (server-side)
- Protegida con `.env.local` (no versionada en git)

## 🚀 Uso

1. **Acceder a la página de admin**:

   - Iniciar sesión en el panel
   - Navegar a `/admin` o hacer clic en "Admin" en el menú

2. **Disparar el deploy**:
   - Hacer clic en el botón "Redeploy en Cloudflare"
   - Confirmar la acción
   - Esperar la respuesta (2-5 minutos para completar)

## ⚙️ Configuración

### Obtener el Webhook URL

1. **En Cloudflare Pages**:

   - Ve a tu proyecto en Cloudflare Pages
   - Settings → Builds & deployments
   - Build hooks → Create deploy hook
   - Copia la URL generada

2. **En tu proyecto**:

   - Agrega la URL al archivo `.env.local`:

   ```bash
   CF_PAGES_DEPLOY_HOOK=https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/[TU-ID]
   ```

3. **Reiniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

## 📊 Casos de Uso

### ✅ Cuándo usar el redeploy

- Después de crear/actualizar productos que deben reflejarse en el sitio público
- Cuando cambies información importante del catálogo
- Para sincronizar datos entre Supabase y el sitio estático
- Actualizar caché de imágenes o assets

### ❌ Cuándo NO usarlo

- Para cambios en el código (usa Git push)
- Múltiples veces seguidas (tiene cooldown implícito)
- Para testing (usa preview deployments)

## 🎨 Características del UI

### Estados del Botón

- **Normal**: Botón morado con icono de refresh
- **Cargando**: Spinner animado + "Desplegando..."
- **Deshabilitado**: Opacidad reducida durante el proceso

### Mensajes de Respuesta

- **Éxito**: Banner verde con mensaje de confirmación
- **Error**: Banner rojo con detalles del error

## 🔄 Mejoras Futuras (Opcional)

### Cooldown

Agregar un sistema de cooldown para evitar múltiples deploys:

```typescript
// Guardar en DB la última vez que se hizo deploy
const lastDeploy = await getLastDeployTime(user.id);
const now = Date.now();
if (now - lastDeploy < 120000) {
  // 2 minutos
  return NextResponse.json({
    ok: false,
    error: "Espera 2 minutos antes de volver a deployar",
  });
}
```

### Historial de Deploys

Registrar cada deploy en la base de datos:

```typescript
await supabase.from("deploy_history").insert({
  user_id: user.id,
  timestamp: new Date().toISOString(),
  status: "success",
});
```

### Webhooks de Cloudflare

Recibir notificaciones cuando el deploy termine:

```typescript
// POST /api/deploy-webhook (desde Cloudflare)
export async function POST(request: Request) {
  const { status, deployment_id } = await request.json();
  // Actualizar estado del deploy en DB
}
```

## 🐛 Troubleshooting

### Error: "CF_PAGES_DEPLOY_HOOK no configurado"

- Verifica que la variable esté en `.env.local`
- Reinicia el servidor de desarrollo

### Error: "No autenticado"

- Asegúrate de estar logueado
- Verifica que la sesión sea válida

### Error 502: "Bad Gateway"

- El webhook URL puede ser incorrecto
- Verifica que el proyecto de Cloudflare exista
- Comprueba que el deploy hook no haya sido eliminado

### El deploy no se refleja

- Los deploys toman 2-5 minutos
- Verifica en Cloudflare Pages → Deployments
- Limpia la caché del navegador

## 📚 Referencias

- [Cloudflare Pages Deploy Hooks](https://developers.cloudflare.com/pages/platform/deploy-hooks/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

---

**Última actualización**: 18 de octubre de 2025
