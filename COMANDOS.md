# 🚀 Comandos Rápidos - InGlobalStore Panel Admin

## 📦 Instalación y Desarrollo

### Instalar dependencias

```bash
npm install
```

### Iniciar servidor de desarrollo

```bash
npm run dev
```

Abre: **http://localhost:3000**

### Compilar para producción

```bash
npm run build
```

### Iniciar en producción

```bash
npm start
```

### Verificar errores de TypeScript

```bash
npx tsc --noEmit
```

### Lint del código

```bash
npm run lint
```

## 🗄️ Comandos de Base de Datos (Supabase)

### Ver todos los productos

```sql
SELECT * FROM products ORDER BY created_at DESC;
```

### Insertar producto de ejemplo

```sql
INSERT INTO products (name, description, price, stock, category, image_url)
VALUES (
  'iPhone 15 Pro',
  'Smartphone de última generación con chip A17 Pro',
  1299.99,
  50,
  'Electrónica',
  'https://example.com/iphone15.jpg'
);
```

### Actualizar stock

```sql
UPDATE products
SET stock = 100
WHERE name = 'iPhone 15 Pro';
```

### Eliminar producto por ID

```sql
DELETE FROM products WHERE id = 'tu-id-aqui';
```

### Contar productos por categoría

```sql
SELECT category, COUNT(*) as total
FROM products
GROUP BY category;
```

## 🔧 Git (Control de Versiones)

### Inicializar repositorio (si no está)

```bash
git init
```

### Ver estado

```bash
git status
```

### Agregar todos los archivos

```bash
git add .
```

### Commit

```bash
git commit -m "feat: Sistema CRUD completo de productos"
```

### Ver historial

```bash
git log --oneline
```

### Push a GitHub

```bash
git branch -M main
git remote add origin https://github.com/JairoVera01/inglobalstore-panel-admin.git
git push -u origin main
```

## 🧹 Limpieza

### Limpiar caché de Next.js

```bash
rm -rf .next
```

### Reinstalar node_modules

```bash
rm -rf node_modules
npm install
```

### Limpiar todo y empezar de nuevo

```bash
rm -rf node_modules .next
npm install
npm run dev
```

## 🔍 Debugging

### Ver logs del servidor

```bash
# Ya se muestran automáticamente en la terminal donde corre npm run dev
```

### Ver errores de compilación

```bash
npm run build
```

### Verificar variables de entorno

```bash
cat .env.local
```

## 📊 Estadísticas del Proyecto

### Contar líneas de código

```bash
find src -name "*.tsx" -o -name "*.ts" | xargs wc -l
```

### Listar todos los archivos TypeScript

```bash
find src -type f \( -name "*.ts" -o -name "*.tsx" \) | sort
```

### Ver tamaño del proyecto

```bash
du -sh .
du -sh node_modules/
```

## 🎨 Tailwind CSS

### Regenerar clases de Tailwind

```bash
# Se hace automáticamente con npm run dev
```

### Ver configuración de Tailwind

```bash
cat tailwind.config.ts
```

## 📝 Notas Importantes

### Variables de Entorno

Las variables en `.env.local` NO deben subirse a GitHub.
Ya está en `.gitignore`.

### Puerto en Uso

Si el puerto 3000 está ocupado:

```bash
# Matar proceso en puerto 3000
kill -9 $(lsof -ti:3000)

# O usar otro puerto
PORT=3001 npm run dev
```

### Caché de Next.js

Si ves datos antiguos:

```bash
# Borra la caché
rm -rf .next
# Reinicia el servidor
npm run dev
```

## 🚀 Deploy

### Vercel (Recomendado para Next.js)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy a producción
vercel --prod
```

### Variables de Entorno en Vercel

Agregar en Vercel Dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📞 Ayuda

### Documentación Oficial

- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind: https://tailwindcss.com/docs

### Comandos de Ayuda

```bash
npm run --help
npx next --help
```

## ⚡ Atajos de Desarrollo

### Abrir VS Code

```bash
code .
```

### Abrir en navegador

```bash
open http://localhost:3000
```

### Ver logs en tiempo real

```bash
# Los logs ya se muestran en la terminal
```

---

**Tip**: Guarda este archivo como referencia rápida! 🎯
