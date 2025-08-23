# 🚀 Production Deployment Guide - szabosutilaszlo.com/tools/

## 📋 Pre-Deployment Checklist

### 1. ✅ Environment Configuration

**1.1 Update Production Environment Variables**
Copy `.env.production` to your server and update the following:

```bash
# REQUIRED: Update these with your production values
STRIPE_SECRET_KEY="sk_live_YOUR_PRODUCTION_SECRET_KEY"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_YOUR_PRODUCTION_PUBLISHABLE_KEY"
RESEND_API_KEY="re_YOUR_RESEND_API_KEY"
OPENAI_API_KEY="sk-YOUR_OPENAI_API_KEY"
ADMIN_PASSWORD="YOUR_SECURE_PASSWORD"
JWT_SECRET="your-super-secure-jwt-secret-for-production"
```

**1.2 Email Domain Setup**
- Set up `tools@szabosutilaszlo.com` in your email provider
- Configure SPF/DKIM records for better deliverability
- Update email templates if needed

### 2. ✅ Build and Test Locally

```bash
# Test production build locally
npm run deploy:check

# Test the production build
npm run build:production
npm run start:production

# Test on http://localhost:3000/tools/
```

### 3. ✅ Database & Services Check

**3.1 Supabase Status**
- ✅ Database is already configured (using remote Supabase)
- ✅ RLS policies are in place
- ✅ All tables exist and are populated

**3.2 External Services**
- [ ] Stripe: Update webhook endpoints to production domain
- [ ] Resend: Verify domain and API key
- [ ] OpenAI: Confirm API key and usage limits

## 🌐 Deployment Steps

### Option A: Static Export (Recommended for shared hosting)

```bash
# 1. Build for production
npm run build:production

# 2. The .next/out folder contains static files ready for upload
# Upload contents to: /public_html/tools/ on your server
```

### Option B: Node.js Server (VPS/Dedicated hosting)

```bash
# 1. Upload project to server
scp -r . user@szabosutilaszlo.com:/var/www/tools/

# 2. On server, install dependencies
cd /var/www/tools/
npm install --production

# 3. Build for production
npm run build:production

# 4. Start with PM2 (recommended)
pm2 start npm --name "tools" -- run start:production
pm2 save
pm2 startup
```

### Option C: Vercel/Netlify (Alternative)

1. Connect GitHub repository
2. Set build command: `npm run build:production`
3. Set environment variables in platform settings
4. Deploy to custom domain: `szabosutilaszlo.com/tools`

## 🔧 Server Configuration

### Apache (.htaccess) - for /tools/ subdirectory

Create `/public_html/tools/.htaccess`:

```apache
RewriteEngine On

# Handle Next.js routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /tools/index.html [L]

# Security headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache static assets
<FilesMatch "\\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</FilesMatch>
```

### Nginx - for /tools/ subdirectory

Add to your nginx config:

```nginx
location /tools/ {
    alias /var/www/tools/;
    try_files $uri $uri/ /tools/index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Cache static assets
    location ~* \\.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 📊 Post-Deployment Verification

### 1. Test Critical Paths

```bash
# Test tools index page
curl -I https://szabosutilaszlo.com/tools/

# Test ADHD quiz landing
curl -I https://szabosutilaszlo.com/tools/hu/adhd-quick-check/

# Test admin access
curl -I https://szabosutilaszlo.com/tools/admin/
```

### 2. Check Analytics & Tracking

- [ ] Events are being tracked to database
- [ ] Admin panel accessible at `/tools/admin/`
- [ ] Quiz completion flow works end-to-end
- [ ] Email automation is functioning

### 3. Performance Check

- [ ] PageSpeed Insights score > 90
- [ ] All static assets loading correctly
- [ ] Database queries responding < 500ms

## 🔄 Ongoing Maintenance

### Weekly Tasks
- Monitor email delivery rates
- Check error logs
- Review user analytics

### Monthly Tasks
- Update dependencies: `npm audit fix`
- Backup database
- Review performance metrics

### Environment Updates
- Keep Supabase access keys secure
- Rotate JWT secrets periodically
- Monitor API usage (OpenAI, Stripe, Resend)

## 🚨 Troubleshooting

### Common Issues

**1. 404 on /tools/ routes**
- Check basePath configuration in next.config.js
- Verify .htaccess/nginx routing rules

**2. API calls failing**
- Confirm NEXT_PUBLIC_BASE_URL is set correctly
- Check CORS settings if applicable

**3. Email delivery issues**
- Verify Resend API key and domain
- Check spam folder for test emails

**4. Admin access denied**
- Confirm JWT_SECRET is set and consistent
- Check admin credentials in environment

## 📞 Support

If you encounter issues:
1. Check server error logs
2. Test locally with production env first
3. Verify all environment variables are set
4. Check database connectivity

---

**Ready for deployment!** ✅

The application is configured to run on `https://szabosutilaszlo.com/tools/` with all necessary URL handling, static asset management, and production optimizations in place.
