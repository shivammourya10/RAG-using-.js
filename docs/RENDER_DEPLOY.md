# Render Deployment Configuration

## 🎯 Quick Deploy to Render

Render is perfect for your RAG application! Here's the fastest way to deploy:

### ⚡ One-Click Deploy

1. **Fork this repository** to your GitHub account
2. **Connect to Render**: Go to [render.com](https://render.com) and sign up
3. **Create Backend Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Settings:
     ```
     Name: ragchat-backend
     Root Directory: backend
     Build Command: npm install
     Start Command: node server.js
     Environment: Node
     Plan: Free (or Starter for production)
     ```

4. **Environment Variables** (Backend):
   ```
   GOOGLE_API_KEY=your_google_ai_api_key
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_INDEX_NAME=your_index_name
   PINECONE_ENVIRONMENT=us-east-1
   NODE_ENV=production
   PORT=3001
   ```

5. **Create Frontend Service**:
   - Click "New +" → "Static Site"
   - Connect same GitHub repository
   - Settings:
     ```
     Name: ragchat-frontend
     Root Directory: frontend
     Build Command: npm install && npm run build
     Publish Directory: dist
     ```

6. **Update Frontend Config**:
   - After backend deploys, copy its URL
   - Update `frontend/src/config.js` with your backend URL

### 🔧 Backend Configuration for Render

Your `backend/server.js` is already configured for Render with:
- Port binding: `process.env.PORT || 3001`
- CORS setup for cross-origin requests
- Health check endpoint: `/api/health`
- Graceful shutdown handling

### 🎨 Frontend Configuration for Render

Update your frontend API configuration:

**Create `frontend/src/config.js`:**
```javascript
const config = {
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-name.onrender.com/api'
    : 'http://localhost:3001/api'
};

export default config;
```

**Update `frontend/src/components/GeminiChat.jsx`:**
```javascript
import config from '../config.js';

// Replace hardcoded URLs with:
const response = await fetch(`${config.API_BASE_URL}/upload`, {
  // ... rest of the code
});
```

### 🚀 Deployment Steps

1. **Prepare Environment**:
   ```bash
   # Create Pinecone index first
   # Get your API keys ready
   ```

2. **Deploy Backend**:
   - Render will auto-deploy from GitHub
   - Add environment variables in Render dashboard
   - Wait for build to complete (~2-3 minutes)

3. **Deploy Frontend**:
   - Update API URL in frontend config
   - Render will auto-build and deploy
   - Frontend will be available immediately

4. **Test Deployment**:
   - Visit your frontend URL
   - Upload a PDF file
   - Ask questions about the content

### 🔍 Monitoring & Logs

**View Logs**:
- Go to your service dashboard
- Click "Logs" tab
- Real-time log streaming available

**Health Checks**:
- Backend: `https://your-backend.onrender.com/api/health`
- Frontend: Automatic health checks

**Performance**:
- Free tier: Services sleep after 15min inactivity
- Starter plan: Always-on services ($7/month)

### 💡 Render Advantages

✅ **Free Tier Available**: Perfect for testing
✅ **Auto-Deploy**: Connects to GitHub for continuous deployment
✅ **SSL Included**: HTTPS certificates automatically
✅ **Zero Config**: Works with your existing setup
✅ **Fast Builds**: Optimized for Node.js applications
✅ **Easy Scaling**: Upgrade plans as needed

### 📱 Custom Domain (Optional)

1. Add custom domain in Render dashboard
2. Update DNS records
3. SSL certificate auto-generated

### 🔧 Environment Variables Reference

**Backend Service Environment Variables:**
```
GOOGLE_API_KEY=your_google_ai_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here  
PINECONE_INDEX_NAME=ragchat-index
PINECONE_ENVIRONMENT=us-east-1
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-frontend.onrender.com
```

### 🚨 Troubleshooting

**Build Failures**:
- Check Node.js version compatibility
- Verify package.json scripts
- Check logs for specific errors

**CORS Issues**:
- Set `CORS_ORIGIN` to your frontend URL
- Ensure frontend uses correct backend URL

**API Key Issues**:
- Verify environment variables are set
- Check API key permissions
- Test keys locally first

### 💰 Pricing

- **Free Tier**: 
  - 750 hours/month per service
  - Services sleep after 15min inactivity
  - Perfect for development/testing

- **Starter Plan**: $7/month per service
  - Always-on services
  - Recommended for production

---

**🎉 Your RAG app will be live in minutes!**

Deploy URL: [render.com](https://render.com)
