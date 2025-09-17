# ZetaDuel Deployment Guide

## 🚀 Deploying to Vercel (Frontend) + Render (Backend)

### Prerequisites
- GitHub account
- Vercel account
- Render account

## 📋 Deployment Steps

### 1. Backend Deployment (Render)

1. **Push code to GitHub**
2. **Go to [Render Dashboard](https://render.com)**
3. **Create New Web Service**
   - Connect your GitHub repository
   - Select the `backend` folder as root directory
   - Use these settings:
     ```
     Name: zetaduel-backend
     Environment: Node
     Build Command: npm install && npm run build
     Start Command: npm start
     ```

4. **Set Environment Variables in Render:**
   ```
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

5. **Deploy and copy the Render URL** (e.g., `https://zetaduel-backend.onrender.com`)

### 2. Frontend Deployment (Vercel)

1. **Go to [Vercel Dashboard](https://vercel.com)**
2. **Import Project from GitHub**
   - Select your repository
   - Framework Preset: Next.js
   - Root Directory: `frontend`

3. **Set Environment Variables in Vercel:**
   ```
   NEXT_PUBLIC_SERVER_URL=https://your-render-backend.onrender.com
   ```

4. **Deploy**

### 3. Update CORS Configuration

After deployment, update the CORS settings in `backend/src/index.ts`:

```typescript
origin: [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "https://your-actual-vercel-domain.vercel.app", // Replace with your actual domain
  /^https:\/\/.*\.vercel\.app$/, // Allow all Vercel preview deployments
],
```

## 🔧 Environment Variables Summary

### Vercel (Frontend)
- `NEXT_PUBLIC_SERVER_URL`: Your Render backend URL

### Render (Backend)
- `NODE_ENV`: production
- `PORT`: 10000 (Render default)
- `FRONTEND_URL`: Your Vercel frontend URL

## 🌐 Custom Domain (Optional)

### Vercel Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update CORS configuration with your custom domain

### Render Custom Domain
1. Go to Service Settings → Custom Domains
2. Add your custom domain
3. Update frontend environment variable

## 🔍 Testing Deployment

1. **Backend Health Check**: `https://your-backend.onrender.com/health`
2. **Frontend**: Visit your Vercel URL
3. **Socket Connection**: Check browser console for connection errors
4. **Multiplayer**: Test with two browser windows

## 🐛 Troubleshooting

### Common Issues:
1. **CORS Errors**: Check backend CORS configuration
2. **Socket Connection Failed**: Verify backend URL in frontend env vars
3. **Build Failures**: Check Node.js version compatibility
4. **Render Cold Starts**: First request may be slow (normal for free tier)

### Logs:
- **Vercel**: Check deployment logs in dashboard
- **Render**: Check service logs in dashboard

## 📈 Performance Notes

- **Render Free Tier**: May sleep after 15 minutes of inactivity
- **Vercel**: Excellent performance for static assets and API routes
- **Socket.io**: Works well on Render with persistent connections

## 🔄 CI/CD

Both platforms support automatic deployments:
- **Vercel**: Auto-deploys on push to main branch
- **Render**: Auto-deploys on push to main branch

Connect your GitHub repository to enable automatic deployments.
