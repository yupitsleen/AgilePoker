# Deployment Guide - Agile Poker

## Quick Start

The application is built and ready to deploy! The production build is in `client/dist/`

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd client
   vercel
   ```

3. Follow the prompts - that's it!

**Configuration:** Vercel auto-detects Vite projects.

---

### Option 2: Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   cd client
   netlify deploy --prod
   ```

3. Or use drag-and-drop:
   - Go to https://app.netlify.com/drop
   - Drag the `client/dist` folder

**Build settings:**
- Build command: `npm run build`
- Publish directory: `dist`

---

### Option 3: GitHub Pages

1. Install gh-pages:
   ```bash
   cd client
   npm install -D gh-pages
   ```

2. Add to `package.json`:
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Update `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/AgilePoker/', // Replace with your repo name
     plugins: [react()],
   })
   ```

4. Build and deploy:
   ```bash
   npm run build
   npm run deploy
   ```

---

### Option 4: AWS S3 + CloudFront

1. Build the project:
   ```bash
   cd client
   npm run build
   ```

2. Create S3 bucket (via AWS Console or CLI):
   ```bash
   aws s3 mb s3://agile-poker-app
   ```

3. Upload files:
   ```bash
   aws s3 sync dist/ s3://agile-poker-app --delete
   ```

4. Configure bucket for static hosting:
   - Enable "Static website hosting"
   - Set index document: `index.html`
   - Set error document: `index.html` (for SPA routing)

5. (Optional) Add CloudFront CDN for HTTPS and caching

---

### Option 5: Any Static Host

The `dist` folder contains everything needed. Just upload it to:
- Firebase Hosting
- Cloudflare Pages
- Render
- Railway
- Surge.sh
- Your own server (Apache/Nginx)

## Environment Configuration

Currently, no environment variables are needed. The app runs entirely client-side.

If you add a backend later, create `.env` files:

```env
VITE_API_URL=https://api.yourbackend.com
VITE_WS_URL=wss://api.yourbackend.com
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Build Configuration

The production build is optimized with:
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification
- ✅ Gzip compression
- ✅ Asset optimization

No additional configuration needed!

## Performance Tips

1. **Enable Gzip/Brotli** on your hosting server
2. **Set cache headers** for static assets:
   ```
   Cache-Control: public, max-age=31536000, immutable
   ```
3. **Use CDN** for global distribution
4. **Enable HTTP/2** for faster loading

## Testing Production Build Locally

```bash
cd client

# Build
npm run build

# Preview
npm run preview

# Open http://localhost:4173
```

## Continuous Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: cd client && npm install

      - name: Build
        run: cd client && npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./client
```

## Post-Deployment Checklist

- [ ] Test room creation
- [ ] Test voting functionality
- [ ] Test triangle export
- [ ] Test on mobile devices
- [ ] Test sidebar responsiveness
- [ ] Verify localStorage persistence
- [ ] Check browser console for errors
- [ ] Test on different browsers (Chrome, Firefox, Safari)

## Troubleshooting

### Blank page after deployment

**Solution:** Check that `base` in `vite.config.ts` matches your deployment path.

### Assets not loading

**Solution:** Ensure assets are referenced with relative paths, not absolute.

### Routing issues (404 on refresh)

**Solution:** Configure your hosting to redirect all routes to `index.html`:

**Netlify:** Create `_redirects` file:
```
/* /index.html 200
```

**Vercel:** Automatic (handled by `vercel.json`)

**Apache:** Use `.htaccess`:
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## Monitoring

After deployment, consider adding:
- Google Analytics
- Sentry for error tracking
- LogRocket for session replay
- Plausible for privacy-friendly analytics

## Scaling to Multi-User

When ready to add real-time collaboration:

1. **Backend Server:**
   - Node.js + Express + Socket.io
   - Deploy to: Heroku, Railway, Render, AWS ECS

2. **Database:**
   - Redis for room state
   - PostgreSQL for history
   - Or use Firebase Realtime Database

3. **Update Environment:**
   ```env
   VITE_WS_URL=wss://your-backend.com
   ```

See [NEW_APP.md](NEW_APP.md) for Phase 2 features.

## Support

For issues during deployment, check:
- Build logs
- Browser console
- Network tab
- [README.md](README.md) for setup instructions
