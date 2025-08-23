# 📦 Shared Hosting Deployment - szabosutilaszlo.com/tools/

## Csak ezeket a fájlokat töltsd fel:

### 1. **Production Build előkészítése**
```bash
# Helyben futtatd:
npm run build:production
```

### 2. **Fájlok feltöltése** 
Töltsd fel ezeket a `/public_html/tools/` mappába:

#### ✅ **Statikus fájlok (kötelező):**
- `public/` mappa teljes tartalma
- `.next/static/` mappa teljes tartalma  
- `.next/server/pages/` HTML fájlok
- `.next/server/app/` HTML fájlok

#### ✅ **Konfiguráció:**
- `next.config.js`
- `.htaccess` fájl (Apache konfigurációhoz)

#### ❌ **NE töltsd fel:**
- `node_modules/` 
- `src/` forráskód
- `.env.*` fájlok
- build fájlok és cache

### 3. **Apache .htaccess fájl**
Hozz létre `/public_html/tools/.htaccess`:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /tools/index.html [L]
```

### ⚠️ **Korlátozások shared hostingon:**
- Admin panel nem fog működni (API routes kellenek)
- Csak az ADHD quiz fog működni
- Stripe fizetés nem működik
- Email küldés nem működik
