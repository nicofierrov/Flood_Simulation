# 🚀 Quick Start Guide

**Get your Flood Simulation up and running in minutes!**

---

## 🎯 Choose Your Path

```
┌─────────────────────────────────────────────────────────────┐
│                    Deployment Options                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ⚡ FASTEST (1 minute)                                      │
│  ├─ Local Testing → python3 -m http.server 8000           │
│  └─ Access: http://localhost:8000                          │
│                                                              │
│  🆓 FREE & SIMPLE (5 minutes)                               │
│  ├─ GitHub Pages → Push to GitHub & enable Pages           │
│  └─ Access: https://yourusername.github.io/repo-name       │
│                                                              │
│  💼 PROFESSIONAL (5 minutes)                                │
│  ├─ Netlify → Drag & drop or connect Git                   │
│  └─ Access: https://your-app.netlify.app                   │
│                                                              │
│  🏢 ENTERPRISE (15-30 minutes)                              │
│  ├─ AWS S3 + CloudFront                                     │
│  ├─ Azure Static Web Apps                                   │
│  └─ Custom Apache/Nginx server                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

Before deploying, you need:

### 1. ArcGIS Resources (10 minutes to set up)

```
┌─────────────────────────────────────────────────┐
│ Get ArcGIS API Key                               │
├─────────────────────────────────────────────────┤
│ 1. Visit: https://developers.arcgis.com/        │
│ 2. Create FREE developer account (or sign in)   │
│ 3. Navigate to "API Keys"                       │
│ 4. Click "Create API Key"                       │
│ 5. Copy your API key                            │
└─────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────┐
│ Create Web Map                                   │
├─────────────────────────────────────────────────┤
│ 1. Sign in to ArcGIS Online                     │
│ 2. Create new Web Map                           │
│ 3. Add your flood layers:                       │
│    • Expected Flow (image service)              │
│    • Expected Depth (image service)             │
│    • Mitigation Flow (image service)            │
│    • Mitigation Depth (image service)           │
│ 4. Organize into groups: "Expected" & "Mitigation" │
│ 5. Save and copy Web Map ID from URL            │
└─────────────────────────────────────────────────┘
```

### 2. Configure Application (2 minutes)

Edit `config/application.json`:

```json
{
  "title": "My Flood Simulation",
  "snippet": "Flood scenario analysis",
  "description": "Compare expected vs mitigated flood scenarios",
  "portalUrl": "https://www.arcgis.com",
  "authMode": "anonymous",
  "apiKey": "PASTE_YOUR_API_KEY_HERE",
  "oauthappid": null,
  "webmap": "PASTE_YOUR_WEBMAP_ID_HERE",
  "depthVariableName": "B1",
  "timeDimensionName": "StdTime",
  "depthUnit": {
    "name": "meters",
    "label": "m"
  }
}
```

**✏️ Required Changes:**
- Replace `PASTE_YOUR_API_KEY_HERE` with your ArcGIS API key
- Replace `PASTE_YOUR_WEBMAP_ID_HERE` with your Web Map ID
- Update `title`, `snippet`, and `description` to match your project

---

## 🚀 Deployment Methods

### Method 1: Local Testing (Fastest - 1 minute)

**Perfect for:** Testing before deployment

**Steps:**
```bash
# Navigate to repository
cd Flood_Simulation

# Start local server (choose one):

# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if installed)
npx http-server -p 8000

# PHP (if installed)
php -S localhost:8000
```

**Access:** http://localhost:8000

---

### Method 2: GitHub Pages (Free - 5 minutes)

**Perfect for:** Public demos, portfolios, sharing with team

**Steps:**

```bash
# 1. Ensure you have a GitHub repository
# 2. Commit and push your changes
git add .
git commit -m "Configure flood simulation"
git push origin main

# 3. Enable GitHub Pages
#    • Go to repository Settings
#    • Navigate to "Pages" section
#    • Source: Deploy from branch "main"
#    • Folder: / (root)
#    • Click Save

# 4. Wait 1-2 minutes for deployment
```

**Access:** `https://YOUR-USERNAME.github.io/Flood_Simulation/`

**Advantages:**
- ✅ Completely free
- ✅ Automatic HTTPS
- ✅ Built-in CDN
- ✅ Auto-deploys on Git push
- ✅ Custom domain support

---

### Method 3: Netlify (Professional - 5 minutes)

**Perfect for:** Professional deployments, team projects

**Option A: Drag & Drop (Easiest)**

1. Go to https://netlify.com
2. Sign up (free account)
3. Drag the `Flood_Simulation` folder onto the upload area
4. Done! Get instant HTTPS URL

**Option B: Git Integration (Recommended)**

1. Sign in to Netlify
2. Click "New site from Git"
3. Connect your GitHub/GitLab/Bitbucket
4. Select repository
5. Deploy settings:
   - **Build command:** (leave empty)
   - **Publish directory:** `.` (or leave empty)
6. Click "Deploy site"

**Access:** `https://random-name.netlify.app` (customizable)

**Advantages:**
- ✅ Free tier with generous limits
- ✅ Instant HTTPS with custom domains
- ✅ Global CDN
- ✅ Automatic deployments from Git
- ✅ Easy rollback
- ✅ Form handling and serverless functions (if needed)
- ✅ Excellent performance

**Custom Domain:**
- Settings → Domain management → Add custom domain
- Follow DNS configuration instructions
- HTTPS auto-configured

---

### Method 4: Vercel (Modern - 5 minutes)

**Perfect for:** Modern JAMstack deployment

**Steps:**

1. Go to https://vercel.com
2. Sign up with GitHub
3. Import Git repository
4. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** `./`
5. Deploy

**Access:** `https://your-project.vercel.app`

**Advantages:**
- ✅ Free tier
- ✅ Lightning fast global CDN
- ✅ Automatic HTTPS
- ✅ Great developer experience

---

### Method 5: AWS S3 + CloudFront (Enterprise - 30 minutes)

**Perfect for:** Large-scale, enterprise deployments

**Prerequisites:**
- AWS account
- AWS CLI installed

**Steps:**

```bash
# 1. Create S3 bucket
aws s3 mb s3://my-flood-simulation

# 2. Upload files
cd Flood_Simulation
aws s3 sync . s3://my-flood-simulation --exclude ".git/*"

# 3. Enable static website hosting
aws s3 website s3://my-flood-simulation \
  --index-document index.html

# 4. Set bucket policy for public access
# (Use AWS Console or CLI to add public read policy)

# 5. Create CloudFront distribution (optional, for CDN)
# (Use AWS Console to create distribution pointing to S3 bucket)
```

**Advantages:**
- ✅ Highly scalable
- ✅ Pay-as-you-go pricing
- ✅ Enterprise-grade reliability
- ✅ Global CDN with CloudFront
- ✅ Integration with other AWS services

---

## ✅ Post-Deployment Checklist

After deploying, verify everything works:

```
┌────────────────────────────────────────────────┐
│ Test Your Deployment                            │
├────────────────────────────────────────────────┤
│ □ Page loads without errors                    │
│ □ Map displays with basemap                    │
│ □ Flood layers visible                         │
│ □ Time slider appears and works                │
│ □ Swipe tool functions (drag divider)          │
│ □ Auto-swipe button animates                   │
│ □ Set analysis location works                  │
│ □ Click map to see depth chart                 │
│ □ Chart shows data for both scenarios          │
│ □ Layers panel shows all layers                │
│ □ Legend displays correctly                    │
│ □ Mobile layout responsive                     │
│ □ No console errors (F12 → Console)            │
└────────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Problem: Blank page

```
Solution:
1. Open browser console (F12 → Console tab)
2. Look for errors
3. Common issues:
   • Invalid JSON in config/application.json
   • Wrong API key
   • Wrong Web Map ID
   • CDN resources blocked
```

### Problem: Map doesn't load

```
Solution:
1. Check API key is valid (not expired)
2. Verify Web Map ID is correct
3. Ensure Web Map is publicly accessible
4. Check browser console for authentication errors
```

### Problem: No flood data

```
Solution:
1. Verify layers in Web Map are:
   • Published as image services
   • Have multidimensional data
   • Named correctly (Expected/Mitigation)
2. Check depthVariableName and timeDimensionName match your data
```

### Problem: Time slider empty

```
Solution:
1. Ensure image services have time dimension
2. Verify multidimensional data is properly configured
3. Check serviceRasterInfo in browser console
```

---

## 📚 Additional Documentation

| Document | Purpose | When to Use |
|----------|---------|-------------|
| `VERIFICATION.md` | Repository integrity report | To verify code quality |
| `REQUIREMENTS.md` | Complete technical requirements | Before starting deployment |
| `DEPLOYMENT.md` | Detailed deployment guide | Step-by-step instructions |
| `DEPLOYMENT_SUMMARY.md` | Executive summary | Quick overview |
| `README.md` | Project overview | Understanding the app |

---

## 🎓 Learning Path

### New to GIS?
1. Start with `README.md` to understand the application
2. Read `REQUIREMENTS.md` to understand what you need
3. Follow this Quick Start guide
4. Use local testing first (Method 1)
5. Deploy to GitHub Pages (Method 2)

### Experienced Developer?
1. Skim `DEPLOYMENT_SUMMARY.md` for overview
2. Configure `config/application.json`
3. Deploy to Netlify or Vercel (Methods 3-4)
4. Reference `DEPLOYMENT.md` for advanced configuration

### Enterprise Deployment?
1. Review `REQUIREMENTS.md` thoroughly
2. Plan infrastructure using `DEPLOYMENT.md`
3. Use AWS or Azure (Method 5)
4. Configure security headers and monitoring
5. Set up CI/CD pipeline

---

## 💡 Pro Tips

### Tip 1: Use Environment-Specific Configs
Create multiple config files:
- `application.dev.json` - Development
- `application.staging.json` - Staging
- `application.prod.json` - Production

Copy the appropriate one to `application.json` before deploying.

### Tip 2: Test Locally First
Always test locally before deploying:
```bash
python3 -m http.server 8000
```
Check browser console for errors.

### Tip 3: Version Your Deployments
Tag releases in Git:
```bash
git tag -a v1.0.0 -m "Initial production release"
git push origin v1.0.0
```

### Tip 4: Monitor Your Application
- Use browser DevTools (F12) to check performance
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Use Google Lighthouse for performance audits

### Tip 5: Keep Dependencies Updated
Review and update CDN versions quarterly:
- ArcGIS Maps SDK
- Calcite Components
- Chart.js

---

## 🎉 Success!

Once deployed, you'll have:
- ✅ Interactive flood simulation map
- ✅ Time-based scenario comparison
- ✅ Side-by-side swipe tool
- ✅ Location-specific depth analysis
- ✅ Animated flood progression
- ✅ Professional web interface

**Share your deployment URL and start analyzing flood scenarios!**

---

## 🆘 Need Help?

1. **Check documentation**: Review `DEPLOYMENT.md` for detailed instructions
2. **Browser console**: Look for JavaScript errors (F12)
3. **Verify configuration**: Ensure `config/application.json` is correct
4. **Test locally**: Use local server to isolate issues
5. **ArcGIS resources**: Verify API key and Web Map are accessible

**Resources:**
- ArcGIS Developers: https://developers.arcgis.com/
- Calcite Components: https://developers.arcgis.com/calcite-design-system/
- Chart.js Docs: https://www.chartjs.org/docs/

---

**Last Updated:** December 16, 2025  
**Application Status:** ✅ Production Ready  
**Estimated Setup Time:** 15-30 minutes
