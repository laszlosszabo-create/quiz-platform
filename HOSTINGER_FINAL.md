# 🎯 HOSTINGER DEPLOYMENT - szabosutilaszlo.com/tools/

## ✅ HOSTINGER FELTÖLTÉS - PONTOS LÉPÉSEK

### 1. **Mappák létrehozása Hostingeren**

**cPanel File Manager → public_html → Új mappa: `tools`**

Hozd létre ezt a mappastruktúrát:
```
/public_html/tools/
├── index.html
├── .htaccess
├── favicon.ico (opcionális)
└── hu/
    └── adhd-quick-check/
        └── index.html
```

### 2. **Fájlok feltöltése**

**Mit tölts fel a `/public_html/tools/` mappába:**

#### ✅ **Kötelező fájlok (ebből a mappából):**
```
static-pages/index.html                    → /tools/index.html
static-pages/.htaccess                     → /tools/.htaccess  
static-pages/hu/adhd-quick-check/index.html → /tools/hu/adhd-quick-check/index.html
```

#### 💡 **Opcionális:**
- `favicon.ico` - Saját ikon (16x16 px PNG → ICO konvertálva)

### 3. **Fájlok feltöltése Hostinger cPanel-ben**

1. **Bejelentkezés** → cPanel → File Manager
2. **Navigálás** → `public_html/tools/`
3. **Upload** → Válaszd ki a fájlokat
4. **Engedélyek** → 644 (olvasható)

### 4. **Tesztelés**

**Ezek az URL-ek működni fognak:**

- ✅ **Főoldal**: https://szabosutilaszlo.com/tools/
- ✅ **ADHD Teszt**: https://szabosutilaszlo.com/tools/hu/adhd-quick-check/

### 5. **Mi fog működni** ✅

- **Tools index oldal** - Teljes mértékben
- **ADHD Quiz** - Teljes funkcionalitás
- **Responsive design** - Minden eszközön
- **Gyors betöltés** - CDN-ről töltődnek a CSS-ek

### 6. **Mi NEM fog működni** ❌

- Admin panel (nincs Node.js)
- API végpontok (nincs backend)
- Adatbázis mentés (nincs szerver oldali script)
- Stripe fizetés (nincs API)
- Email küldés (nincs szerver)

---

## 📁 HOSTINGER FELTÖLTENDŐ FÁJLOK

Ebben a mappában találod az összes szükséges fájlt:
```
/Users/suti/Appok/quiz/static-pages/
├── index.html              # Tools főoldal
├── .htaccess               # Apache konfiguráció
├── favicon-placeholder.txt # Favicon útmutató
└── hu/
    └── adhd-quick-check/
        └── index.html      # ADHD teszt
```

## 🚀 GYORS FELTÖLTÉS

1. **Tömörítsd** a `static-pages` mappa tartalmát ZIP-be
2. **Töltsd fel** Hostinger cPanel → File Manager → Upload
3. **Csomagold ki** a `/public_html/tools/` mappában
4. **Teszteld** az URL-eket

---

## ✅ ELLENŐRZŐLISTA

- [ ] `/public_html/tools/` mappa létrehozva
- [ ] `index.html` feltöltve
- [ ] `.htaccess` feltöltve  
- [ ] `hu/adhd-quick-check/index.html` feltöltve
- [ ] Tesztelés: https://szabosutilaszlo.com/tools/
- [ ] ADHD quiz tesztelés: https://szabosutilaszlo.com/tools/hu/adhd-quick-check/

**🎉 KÉSZ! A tools oldal elérhető lesz a Hostingeren!**
