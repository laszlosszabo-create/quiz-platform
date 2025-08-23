# 🌐 Hostinger Deployment Guide - szabosutilaszlo.com/tools/

## ⚠️ Hostinger = Shared Hosting korlátozások

**Mit fog működni:**
- ✅ ADHD Quiz (statikus verzió)
- ✅ Alap landing page
- ✅ Frontend funkciók

**Mit NEM fog működni:**
- ❌ Admin panel (API routes kellenek)
- ❌ Stripe fizetés
- ❌ Email küldés  
- ❌ Database írás/módosítás
- ❌ AI eredmény generálás

---

## 📦 MIT TÖLTS FEL - Hostinger

### 1. **Előkészítés helyben:**
```bash
# Ezt futtatd le helyben:
npm run build:production
```

### 2. **Hostinger cPanel File Manager:**

**Navigálj a `/public_html/tools/` mappába és töltsd fel:**

#### ✅ **Statikus fájlok (kötelező):**
```
public/favicon.ico          # Ikon
public/manifest.json        # Web app manifest
public/images/             # Képek (ha vannak)
.next/static/              # TELJES static mappa
```

#### ✅ **HTML oldalak:**
```
# Ezeket kézzel kell létrehozni:
index.html                 # Tools landing page
hu/                       # Magyar nyelvű oldalak
  adhd-quick-check/
    index.html            # ADHD quiz
```

### 3. **Fájlstruktúra Hostingeren:**
```
/public_html/tools/
  ├── index.html           # Tools főoldal
  ├── _next/static/        # Next.js static fájlok
  ├── hu/
  │   └── adhd-quick-check/
  │       └── index.html   # ADHD quiz oldal  
  ├── favicon.ico
  └── .htaccess           # URL átírás
```

### 4. **Szükséges .htaccess fájl:**
Hozd létre `/public_html/tools/.htaccess`:
```apache
RewriteEngine On

# Handle clean URLs
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^hu/adhd-quick-check/?$ /tools/hu/adhd-quick-check/index.html [L]

# Redirect to tools index for root
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /tools/index.html [L]
```

---

## 🛠️ EGYSZERŰBB MEGOLDÁS

**Mivel Hostinger shared hosting, készítsünk statikus verziókat:**

1. **Használd a static export funkciót**
2. **Csak az ADHD quiz működjön**  
3. **Admin panel URL-eket tiltsd le**

Szeretnéd, hogy **készítsek neked statikus HTML fájlokat** amikkel ez könnyen feltölthető?
