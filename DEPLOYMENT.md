# Deployment Options for Stock Management System

This guide covers the best deployment options for your full-stack application with Node.js/Express backend, React frontend, and PostgreSQL database.

## 🏆 Recommended Deployment Options

### Option 1: Vercel + Railway (Easiest & Fast) ⭐ RECOMMENDED

**Best for:** Quick deployment, minimal configuration, free tier available

#### Frontend on Vercel (Free)
- **Pros:** 
  - Free for personal projects
  - Automatic deployments from GitHub
  - Global CDN
  - HTTPS by default
  - Zero configuration for React/Vite

- **Setup:**
  1. Go to [vercel.com](https://vercel.com)
  2. Sign in with GitHub
  3. Import your repository
  4. Set root directory to `frontend`
  5. Build command: `npm run build`
  6. Output directory: `dist`
  7. Deploy!

#### Backend + Database on Railway (Free $5/month credit)
- **Pros:**
  - PostgreSQL included
  - Free $5 monthly credit (enough for small projects)
  - Easy environment variables
  - Automatic deployments from GitHub

- **Setup:**
  1. Go to [railway.app](https://railway.app)
  2. Sign in with GitHub
  3. Create new project → Deploy from GitHub repo
  4. Add PostgreSQL service (one click)
  5. Add your backend service:
     - Root directory: `backend`
     - Build command: `npm install && npm run build`
     - Start command: `npm start`
  6. Set environment variables:
     ```
     DATABASE_URL=${{Postgres.DATABASE_URL}}
     JWT_SECRET=your-production-secret-key
     PORT=5000
     NODE_ENV=production
     ```
  7. Copy the Railway backend URL
  8. Update Vercel environment variable:
     - `VITE_API_URL=https://your-backend.railway.app/api`

**Cost:** Free (with Railway's $5/month credit)

---

### Option 2: Render (All-in-One) 🚀

**Best for:** Single platform deployment, simple management

#### Deploy Everything on Render (Free tier available)
- **Pros:**
  - All services in one place
  - Free tier for static sites
  - PostgreSQL included (free tier available)
  - Easy to manage

- **Setup:**
  1. Go to [render.com](https://render.com)
  2. Sign in with GitHub
  3. Create PostgreSQL database (Free tier)
  4. Create Web Service for backend:
     - Root directory: `backend`
     - Build command: `npm install && npx prisma generate && npm run build`
     - Start command: `npm start`
     - Add environment variables
  5. Create Static Site for frontend:
     - Root directory: `frontend`
     - Build command: `npm install && npm run build`
     - Publish directory: `dist`
     - Add environment variable: `VITE_API_URL`

**Cost:** Free tier available (backend suspends after 15 min inactivity)

---

### Option 3: Netlify + Supabase 💎

**Best for:** Generous free tier, excellent performance

#### Frontend on Netlify (Free)
- **Pros:**
  - Generous free tier
  - Great DX and build tools
  - Form handling and functions

- **Setup:**
  1. Go to [netlify.com](https://netlify.com)
  2. Import from GitHub
  3. Base directory: `frontend`
  4. Build command: `npm run build`
  5. Publish directory: `dist`

#### Backend on Render/Railway + Database on Supabase (Free)
- **Supabase** provides:
  - PostgreSQL database (500MB free)
  - Built-in auth (optional replacement for JWT)
  - Real-time subscriptions

**Cost:** Free for small projects

---

### Option 4: AWS (Production Grade) 🏢

**Best for:** Enterprise, scalability, full control

#### Architecture:
- **Frontend:** S3 + CloudFront
- **Backend:** Elastic Beanstalk or ECS
- **Database:** RDS PostgreSQL
- **Load Balancer:** Application Load Balancer

**Cost:** Pay as you go (~$20-50/month for small apps)

**Setup Complexity:** High (requires AWS knowledge)

---

### Option 5: DigitalOcean App Platform 🌊

**Best for:** Simple deployment with good pricing

- **Pros:**
  - Simple interface
  - Good documentation
  - Managed PostgreSQL
  - Static site hosting

- **Setup:**
  1. Go to [digitalocean.com](https://digitalocean.com)
  2. Create App Platform project
  3. Connect GitHub repository
  4. Configure components:
     - Static Site (frontend)
     - Web Service (backend)
     - Managed Database (PostgreSQL)

**Cost:** ~$5/month for basic tier

---

### Option 6: Fly.io (Modern Platform) ✈️

**Best for:** Global deployment, edge computing

- **Pros:**
  - Deploy close to users worldwide
  - PostgreSQL included
  - Free allowance

- **Setup:**
  ```bash
  # Install flyctl
  curl -L https://fly.io/install.sh | sh
  
  # Deploy backend
  cd backend
  fly launch
  fly postgres create
  fly postgres attach
  
  # Deploy frontend
  cd ../frontend
  fly launch --internal-port 3000
  ```

**Cost:** Free tier available

---

## 📊 Quick Comparison

| Platform | Frontend | Backend | Database | Free Tier | Best For |
|----------|----------|---------|----------|-----------|----------|
| **Vercel + Railway** | ✅ Free | $5 credit | $5 credit | Yes | Quick start |
| **Render** | ✅ Free | Sleeps | 90 days | Yes | Simple projects |
| **Netlify + Supabase** | ✅ Free | Need separate | 500MB | Yes | JAMstack apps |
| **AWS** | Pay | Pay | Pay | 12mo free | Enterprise |
| **DigitalOcean** | $5 | $5 | $15 | No | Stable pricing |
| **Fly.io** | Free | Free tier | Free tier | Yes | Global apps |

---

## 🎯 My Recommendation: Vercel + Railway

**Why this combo?**

1. **Free to start** - Perfect for portfolio/demo projects
2. **Professional URLs** - Both provide custom domains
3. **Auto-deploy** - Push to GitHub = automatic deployment
4. **Easy setup** - No DevOps knowledge required
5. **Scalable** - Can upgrade as you grow

---

## Step-by-Step: Vercel + Railway Deployment

### Part 1: Deploy Backend on Railway

1. **Create Railway Account:**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL:**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will provision the database

4. **Configure Backend Service:**
   - Click "New" → "GitHub Repo"
   - Select your repository
   - Add these settings:
     ```
     Root Directory: backend
     Build Command: npm install && npx prisma generate && npm run build
     Start Command: npm start
     ```

5. **Set Environment Variables:**
   - Click on your backend service
   - Go to "Variables" tab
   - Add:
     ```
     DATABASE_URL=${{Postgres.DATABASE_URL}}
     JWT_SECRET=your-super-secret-jwt-key-change-this
     PORT=5000
     NODE_ENV=production
     ```

6. **Run Migrations:**
   - After first deploy, go to backend service
   - Click on "..." → "Run command"
   - Run: `npx prisma migrate deploy`
   - Run: `npx prisma db seed` (if seed script exists)

7. **Get Backend URL:**
   - In backend service settings
   - Go to "Settings" → "Networking"
   - Generate domain
   - Copy the URL (e.g., `https://your-app.up.railway.app`)

### Part 2: Deploy Frontend on Vercel

1. **Create Vercel Account:**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project:**
   - Click "Add New" → "Project"
   - Import your repository

3. **Configure Build Settings:**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```

4. **Add Environment Variable:**
   - Before deploying, add:
     ```
     Name: VITE_API_URL
     Value: https://your-backend.up.railway.app/api
     ```

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

6. **Get Frontend URL:**
   - Copy your Vercel URL (e.g., `https://your-app.vercel.app`)

### Part 3: Update Backend CORS

Update your backend to allow Vercel domain:

```typescript
// backend/src/server.ts
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app'
  ],
  credentials: true
}));
```

Commit and push - Railway will auto-deploy!

---

## 🔒 Production Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Update CORS settings with your domain
- [ ] Set `NODE_ENV=production`
- [ ] Use production database (not development)
- [ ] Enable SSL/HTTPS (most platforms do this automatically)
- [ ] Add error monitoring (e.g., Sentry)
- [ ] Set up database backups
- [ ] Configure environment variables properly
- [ ] Test all features in production environment
- [ ] Set up custom domain (optional)

---

## 🌐 Custom Domain Setup

### Vercel (Frontend)
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Railway (Backend)
1. Go to Service Settings → Networking
2. Add custom domain
3. Update DNS with CNAME record

---

## 📈 Monitoring & Maintenance

**Recommended Tools:**
- **Uptime Monitoring:** UptimeRobot (free)
- **Error Tracking:** Sentry (free tier)
- **Analytics:** Vercel Analytics (free)
- **Database Monitoring:** Railway dashboard

---

## 💰 Cost Estimates

### Free Tier (Hobby/Portfolio):
- **Vercel:** Free
- **Railway:** $5/month credit (free with credit)
- **Total:** $0 with credits

### Growing App:
- **Vercel Pro:** $20/month
- **Railway:** $10-20/month
- **Total:** $30-40/month

### Production App:
- **Vercel Pro:** $20/month
- **Railway/Render:** $20-50/month
- **Database backup:** $5-10/month
- **Total:** $45-80/month

---

## 🆘 Troubleshooting

### Build fails on Vercel
- Check build logs
- Ensure `package.json` has correct scripts
- Verify `VITE_API_URL` environment variable

### Backend can't connect to database
- Verify `DATABASE_URL` in Railway variables
- Check if using `${{Postgres.DATABASE_URL}}` reference
- Run migrations: `npx prisma migrate deploy`

### CORS errors
- Add Vercel URL to backend CORS configuration
- Redeploy backend after changes

### 502 Bad Gateway
- Check backend logs
- Verify backend is running (Railway dashboard)
- Check DATABASE_URL is correct

---

## 🚀 Quick Deploy Commands

For platforms supporting CLI:

```bash
# Railway
npm install -g @railway/cli
railway login
railway init
railway up

# Fly.io
fly launch
fly deploy

# Render
# Use dashboard (no CLI needed)
```

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Prisma Production Guide](https://www.prisma.io/docs/guides/deployment)

---

## Need Help?

Choose based on your needs:
- **Free & Simple:** Vercel + Railway ⭐
- **All-in-One:** Render
- **Enterprise:** AWS
- **Global Performance:** Fly.io

**My recommendation: Start with Vercel + Railway. It's free, fast, and you can always migrate later if needed!**
