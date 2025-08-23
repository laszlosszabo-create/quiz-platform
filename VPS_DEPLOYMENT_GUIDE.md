# 🚀 VPS/Dedicated Server Deployment - szabosutilaszlo.com/tools/

## Teljes projekt feltöltése

### 1. **Fájlok amit fel kell tölteni:**

#### ✅ **Kötelező mappák/fájlok:**
```
src/                    # Teljes forráskód
public/                 # Statikus fájlok  
supabase/              # Database config
scripts/               # Segédscriptek
package.json           # Dependencies
package-lock.json      # Lock file
next.config.js         # Next.js konfig
tailwind.config.ts     # Tailwind konfig
tsconfig.json          # TypeScript konfig
.env.production        # Production környezeti változók
postcss.config.js      # PostCSS konfig
components.json        # Shadcn konfig
```

#### ❌ **NE töltsd fel:**
```
node_modules/          # Ezt a szerveren telepíted
.next/                 # Ezt a szerveren építed fel
.git/                  # Verziókezelés nem kell
.cache/                # Cache fájlok
.DS_Store              # MacOS rendszerfájlok
*.log                  # Log fájlok
test-*.js              # Test fájlok (opcionális)
```

### 2. **Szerver parancsok:**
```bash
# 1. Projekt feltöltése után:
cd /var/www/tools/
npm install --production

# 2. Build a szerveren:
npm run build:production

# 3. Indítás PM2-vel:
pm2 start npm --name "tools" -- run start:production
pm2 save
pm2 startup

# 4. Nginx/Apache reverse proxy beállítása
```

### 3. **Teljes funkciók működni fognak:**
- ✅ Admin panel
- ✅ API routes  
- ✅ Stripe fizetés
- ✅ Email küldés
- ✅ Database műveletek
- ✅ AI eredmény generálás
