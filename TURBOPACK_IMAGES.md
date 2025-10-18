# 🚀 Turbopack y Configuración de Imágenes

## ¿Qué es Turbopack?

**Turbopack** es el nuevo bundler (empaquetador) incremental de Next.js, desarrollado por el equipo de Vercel. Es el sucesor de Webpack y está escrito en Rust para máximo rendimiento.

### 📊 Ventajas de Turbopack

| Característica      | Webpack    | Turbopack           |
| ------------------- | ---------- | ------------------- |
| Compilación inicial | ~5s        | ~500ms              |
| Hot Module Reload   | ~2s        | ~10ms               |
| Actualizaciones     | Normal     | **700x más rápido** |
| Lenguaje            | JavaScript | Rust                |

### ⚡ Características Principales

- **Ultra rápido**: Compilación incremental optimizada
- **Lazy compilation**: Solo compila lo que necesitas
- **Better caching**: Sistema de caché inteligente
- **HMR instantáneo**: Cambios en milisegundos
- **Out of the box**: Viene configurado en Next.js 15

### 🎯 ¿Cuándo se usa?

```bash
# Desarrollo con Turbopack (por defecto en Next.js 15)
npm run dev

# Si quieres usar Webpack (legacy)
npm run dev -- --no-turbopack
```

### 🔧 Estado Actual

- ✅ **Estable** para desarrollo
- ⚠️ **Beta** para producción
- 📅 **Lanzamiento completo**: Q1 2026

---

## 🖼️ Configuración de Imágenes en Next.js

### El Problema

Next.js bloquea imágenes de dominios externos por seguridad. Debes configurar explícitamente qué dominios permitir.

### ❌ Error Sin Configurar

```
Error: Invalid src prop (https://example.com/image.jpg) on `next/image`,
hostname "example.com" is not configured under images in your `next.config.js`
```

### ✅ Solución

En `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co", // Permite todos los subdominios
        pathname: "/**",
      },
    ],
  },
};
```

### 🌍 Dominios Configurados en Este Proyecto

| Dominio               | Uso                                 |
| --------------------- | ----------------------------------- |
| `example.com`         | URLs de ejemplo en la BD            |
| `**.supabase.co`      | Supabase Storage (imágenes subidas) |
| `**.amazonaws.com`    | AWS S3 (si usas S3)                 |
| `images.unsplash.com` | Imágenes de Unsplash                |
| `via.placeholder.com` | Placeholders de prueba              |

### 📝 Sintaxis de Patrones

```typescript
{
  protocol: 'https',           // http o https
  hostname: 'example.com',     // Dominio exacto
  hostname: '**.example.com',  // Todos los subdominios
  pathname: '/images/**',      // Solo esta ruta
  port: '',                    // Puerto específico (opcional)
}
```

### 🎨 Componente ProductImage

Hemos creado un componente personalizado que:

1. ✅ Maneja errores de carga automáticamente
2. ✅ Muestra un placeholder si falla
3. ✅ Optimiza imágenes automáticamente
4. ✅ Lazy loading por defecto
5. ✅ Soporte para imágenes prioritarias

**Uso:**

```tsx
import ProductImage from "@/components/ProductImage";

<ProductImage
  src={product.image_url || ""}
  alt={product.name}
  width={300}
  height={300}
  className="object-cover"
  priority={false} // true para imágenes above-the-fold
/>;
```

### 🔒 Seguridad

**¿Por qué Next.js bloquea dominios externos?**

1. **Prevenir SSRF**: Server-Side Request Forgery
2. **Control de recursos**: Evitar que usen tu servidor para optimizar cualquier imagen
3. **Performance**: Solo optimizar imágenes de fuentes confiables
4. **Privacidad**: No filtrar datos a dominios no autorizados

### 💡 Tips

#### Para Desarrollo

```typescript
// Permitir TODAS las imágenes (solo desarrollo, no recomendado en producción)
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**',
    },
  ],
}
```

#### Para Producción

```typescript
// Ser específico con dominios
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'tu-cdn.example.com',
      pathname: '/products/**',
    },
  ],
}
```

### 🎯 Optimización de Imágenes

Next.js optimiza automáticamente:

- ✅ Convierte a WebP/AVIF
- ✅ Redimensiona según device
- ✅ Lazy loading
- ✅ Blur placeholder
- ✅ Caché inteligente

### 📊 Formatos Soportados

| Formato | Entrada | Salida Optimizada            |
| ------- | ------- | ---------------------------- |
| JPEG    | ✅      | WebP, AVIF                   |
| PNG     | ✅      | WebP, AVIF                   |
| WebP    | ✅      | WebP                         |
| AVIF    | ✅      | AVIF                         |
| SVG     | ⚠️      | Sin optimización             |
| GIF     | ⚠️      | Sin optimización (usa video) |

### 🚀 Mejores Prácticas

1. **Usa next/image siempre** (no `<img>`)
2. **Define width y height** (evita layout shift)
3. **Usa priority para above-the-fold** (primera vista)
4. **Lazy load para el resto** (por defecto)
5. **Comprime antes de subir** (Supabase Storage)

### 📦 Supabase Storage

Para imágenes en Supabase:

```typescript
// Subir imagen a Supabase Storage
const { data, error } = await supabase.storage
  .from("products")
  .upload(`${productId}.jpg`, file);

// La URL será algo como:
// https://proyecto.supabase.co/storage/v1/object/public/products/123.jpg
```

Ya está configurado en `next.config.ts` con:

```typescript
{
  protocol: 'https',
  hostname: '**.supabase.co',
  pathname: '/**',
}
```

---

## 🔧 Troubleshooting

### Error: Image optimization using the default loader

**Solución**: Asegúrate de configurar `remotePatterns` en `next.config.ts`

### Error: The requested resource isn't a valid image

**Solución**: Verifica que la URL sea válida y devuelva una imagen real

### Imágenes lentas

**Solución**:

1. Optimiza tamaño antes de subir
2. Usa formatos modernos (WebP, AVIF)
3. Considera usar un CDN

### Imágenes no cargan

**Solución**:

1. Revisa la consola del navegador
2. Verifica CORS en tu servidor de imágenes
3. Confirma que el dominio está en `remotePatterns`

---

## 📚 Recursos

- [Turbopack Docs](https://turbo.build/pack/docs)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Next.js Config](https://nextjs.org/docs/app/api-reference/next-config-js/images)

---

**¡Tu aplicación ahora está optimizada con Turbopack y configuración correcta de imágenes!** 🎉
