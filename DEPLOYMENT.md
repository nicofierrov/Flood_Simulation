# Deployment Guide

## Overview

This document provides comprehensive deployment instructions and recommendations for the Flood Simulation web application. The application is a static web application that requires no build process or server-side processing.

## Pre-Deployment Preparation

### 1. Configure the Application

Edit `config/application.json` with your specific settings:

```json
{
  "title": "Your Flood Simulation Title",
  "snippet": "Brief description of your simulation",
  "description": "Detailed description with HTML formatting if needed",
  "portalUrl": "https://www.arcgis.com",
  "oauthappid": "your-oauth-app-id-or-null",
  "authMode": "anonymous",
  "apiKey": "your-api-key-or-null",
  "webmap": "your-webmap-item-id",
  "webscene": "",
  "viewProps": {
    "alphaCompositingEnabled": true
  },
  "depthVariableName": "B1",
  "timeDimensionName": "StdTime",
  "depthUnit": {
    "name": "meters",
    "label": "m"
  }
}
```

### 2. Set Up ArcGIS Resources

#### Create/Configure Web Map
1. Sign in to ArcGIS Online or ArcGIS Enterprise
2. Create a new Web Map or use existing one
3. Organize layers as shown in README.md diagram:
   - **Expected** group with Flow and Depth layers
   - **Mitigation** group with Flow and Depth layers
4. Ensure layers are multidimensional image services
5. Note the Web Map Item ID (found in item details URL)
6. Update `webmap` property in `application.json`

#### Configure Authentication

**Option A: Anonymous Access (Recommended for Public Apps)**
```json
{
  "authMode": "anonymous",
  "apiKey": "YOUR_ARCGIS_API_KEY",
  "oauthappid": null
}
```

Get API Key:
1. Go to https://developers.arcgis.com/
2. Sign in to your developer account
3. Navigate to "API Keys"
4. Create new API key
5. Copy and paste into `application.json`

**Option B: OAuth Authentication (For User-Authenticated Apps)**
```json
{
  "authMode": "oauth",
  "oauthappid": "YOUR_OAUTH_APP_ID",
  "apiKey": null
}
```

Register OAuth Application:
1. Sign in to ArcGIS Developer dashboard
2. Go to "Applications"
3. Click "New Application"
4. Set redirect URI: `https://yourdomain.com/oauth-callback.html`
5. Copy OAuth App ID
6. Update `oauthappid` in `application.json`

### 3. Test Locally

Before deploying, test the application locally:

**Option 1: Using Python**
```bash
# Python 3
cd /path/to/Flood_Simulation
python -m http.server 8000

# Access at: http://localhost:8000
```

**Option 2: Using Node.js (http-server)**
```bash
npm install -g http-server
cd /path/to/Flood_Simulation
http-server -p 8000

# Access at: http://localhost:8000
```

**Option 3: Using PHP**
```bash
cd /path/to/Flood_Simulation
php -S localhost:8000
```

## Deployment Options

### Option 1: GitHub Pages (Recommended for Public Projects)

#### Steps:
1. Push code to GitHub repository
2. Go to repository Settings → Pages
3. Select branch (e.g., `main`)
4. Select root directory `/`
5. Click Save
6. Access at: `https://yourusername.github.io/repositoryname/`

#### Advantages:
- ✅ Free hosting
- ✅ Automatic HTTPS
- ✅ Built-in CDN
- ✅ Easy updates (just push to repository)
- ✅ Custom domain support

#### Configuration:
- Update `oauth-callback.html` redirect URI in OAuth app
- No additional configuration needed
- `.nojekyll` file (optional, to bypass Jekyll processing)

#### Example Commands:
```bash
git add .
git commit -m "Deploy application"
git push origin main
```

---

### Option 2: Netlify (Recommended for Enterprise)

#### Steps:
1. Create account at https://www.netlify.com/
2. Connect your Git repository OR drag & drop folder
3. Configure build settings:
   - **Build command**: (leave empty)
   - **Publish directory**: `.` (root)
4. Click Deploy

#### Advantages:
- ✅ Free tier available
- ✅ Automatic HTTPS with custom domains
- ✅ Continuous deployment from Git
- ✅ Edge CDN distribution
- ✅ Instant cache invalidation
- ✅ Easy rollback capabilities
- ✅ Environment variables support
- ✅ Excellent performance

#### netlify.toml (Optional Configuration):
```toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    
[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=604800, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=604800, immutable"
```

---

### Option 3: Vercel

#### Steps:
1. Create account at https://vercel.com/
2. Import Git repository
3. Framework Preset: Other
4. Root Directory: `./`
5. Click Deploy

#### Advantages:
- ✅ Free tier
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Serverless functions (if needed later)
- ✅ Great developer experience

#### vercel.json (Optional):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

---

### Option 4: AWS S3 + CloudFront

#### Steps:
1. Create S3 bucket
2. Enable static website hosting
3. Upload all files to bucket
4. Set bucket policy for public read access
5. Create CloudFront distribution
6. Point distribution to S3 bucket

#### Advantages:
- ✅ Highly scalable
- ✅ Global CDN
- ✅ Pay-as-you-go pricing
- ✅ Enterprise-grade reliability
- ✅ Fine-grained access control

#### S3 Bucket Policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

#### AWS CLI Commands:
```bash
# Create bucket
aws s3 mb s3://your-flood-simulation-app

# Upload files
aws s3 sync . s3://your-flood-simulation-app --exclude ".git/*"

# Enable website hosting
aws s3 website s3://your-flood-simulation-app \
  --index-document index.html \
  --error-document index.html
```

---

### Option 5: Azure Static Web Apps

#### Steps:
1. Create Azure account
2. Go to Static Web Apps service
3. Connect to GitHub repository
4. Configure build:
   - **App location**: `/`
   - **Api location**: (leave empty)
   - **Output location**: (leave empty)
5. Deploy

#### Advantages:
- ✅ Free tier with custom domains
- ✅ Global distribution
- ✅ Integrated authentication (Azure AD)
- ✅ CI/CD from GitHub

---

### Option 6: Traditional Web Server (Apache/Nginx)

#### Apache Configuration

**httpd.conf or .htaccess:**
```apache
# Enable HTTPS redirect
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType text/css "access plus 1 week"
  ExpiresByType application/javascript "access plus 1 week"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 month"
</IfModule>

# Security headers
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "DENY"
Header set X-XSS-Protection "1; mode=block"
Header set Referrer-Policy "strict-origin-when-cross-origin"
```

**Deployment Steps:**
```bash
# Copy files to web root
sudo cp -r /path/to/Flood_Simulation/* /var/www/html/flood-simulation/

# Set permissions
sudo chown -R www-data:www-data /var/www/html/flood-simulation/
sudo chmod -R 755 /var/www/html/flood-simulation/

# Restart Apache
sudo systemctl restart apache2
```

#### Nginx Configuration

**nginx.conf or site configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    root /var/www/flood-simulation;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json;
    
    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Browser caching
    location ~* \.(css|js)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
    
    location ~* \.(png|jpg|jpeg|ico)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Deployment Steps:**
```bash
# Copy files
sudo mkdir -p /var/www/flood-simulation
sudo cp -r /path/to/Flood_Simulation/* /var/www/flood-simulation/

# Set permissions
sudo chown -R nginx:nginx /var/www/flood-simulation/
sudo chmod -R 755 /var/www/flood-simulation/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## Post-Deployment Steps

### 1. Update OAuth Redirect URI
If using OAuth authentication:
1. Go to ArcGIS Developer dashboard
2. Edit your OAuth application
3. Update redirect URI to your deployed domain:
   - `https://yourdomain.com/oauth-callback.html`

### 2. Test All Features
- [ ] Application loads without errors
- [ ] Map displays correctly with data
- [ ] Time slider controls work
- [ ] Swipe functionality operates smoothly
- [ ] Location comparison tool functions
- [ ] Chart displays data correctly
- [ ] Authentication works (if enabled)
- [ ] Mobile responsive layout works
- [ ] All CDN resources load successfully

### 3. Performance Optimization

#### Enable CDN Caching
If using a CDN, configure appropriate cache rules:
- HTML files: No cache or short cache (5 minutes)
- CSS/JS files: Long cache (7 days)
- Images: Very long cache (30 days)

#### Monitor Performance
Use tools to monitor:
- Google Lighthouse (Performance audit)
- WebPageTest (Load time analysis)
- Browser DevTools (Network analysis)

### 4. Security Hardening

#### Set Security Headers
Ensure your web server sends these headers:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.arcgis.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://js.arcgis.com;
```

#### HTTPS Configuration
- Always use HTTPS in production
- Use Let's Encrypt for free SSL certificates
- Configure HSTS (HTTP Strict Transport Security)

### 5. Configure Custom Domain (Optional)

For GitHub Pages:
1. Add CNAME file with your domain
2. Configure DNS A/CNAME records
3. Enable HTTPS in repository settings

For Netlify/Vercel:
1. Add custom domain in dashboard
2. Update DNS records as instructed
3. HTTPS is automatic

### 6. Set Up Monitoring

#### Error Tracking
Consider integrating error tracking:
- Sentry (https://sentry.io/)
- Rollbar (https://rollbar.com/)
- LogRocket (https://logrocket.com/)

#### Analytics (Optional)
Add web analytics to track usage:
- Google Analytics
- Plausible (privacy-friendly)
- Simple Analytics

## Maintenance and Updates

### Updating the Application

#### For Git-based Deployments (GitHub Pages, Netlify, Vercel):
```bash
git pull origin main
# Make your changes
git add .
git commit -m "Update application"
git push origin main
# Deployment happens automatically
```

#### For Manual Deployments (S3, Traditional Servers):
```bash
# Download new version
git pull origin main

# Upload to server
# For S3:
aws s3 sync . s3://your-bucket-name --exclude ".git/*"

# For traditional server:
scp -r * user@server:/var/www/flood-simulation/
```

### Updating Dependencies

The application uses CDN-hosted dependencies. To update:

1. Edit `index.html`
2. Update CDN version numbers:
   - Chart.js: Change version in URL
   - Calcite Components: Change version in URL
   - ArcGIS SDK: Change version in URL
3. Test thoroughly after updates
4. Deploy updated files

### Backup Strategy

#### What to Backup:
- `config/application.json` (your configuration)
- Any custom modifications to code
- Documentation of your Web Map IDs and OAuth settings

#### Backup Frequency:
- Before any major changes
- After configuration updates
- Monthly for good practice

## Troubleshooting

### Common Issues

**Issue: Application shows blank page**
- Check browser console for errors
- Verify CDN resources are loading
- Check `config/application.json` is valid JSON
- Ensure Web Map ID is correct

**Issue: Map doesn't display**
- Verify Web Map ID is correct
- Check authentication credentials
- Ensure layers in Web Map are published and accessible
- Verify API key or OAuth app is active

**Issue: Time slider doesn't work**
- Check multidimensional data is properly configured
- Verify `depthVariableName` and `timeDimensionName` are correct
- Ensure image service has time dimension

**Issue: OAuth redirect fails**
- Verify redirect URI matches exactly in OAuth app settings
- Check that `oauth-callback.html` is accessible
- Ensure `oauthappid` is correct in config

**Issue: CORS errors**
- Ensure ArcGIS services allow your domain
- Check that HTTPS is enabled (required for some services)
- Verify API key or OAuth has appropriate privileges

## Deployment Recommendations Summary

### For Different Use Cases:

**Public Demo/Portfolio Project:**
→ **GitHub Pages** (Free, simple, fast)

**Professional/Commercial Application:**
→ **Netlify** or **Vercel** (Best features, reliability, performance)

**Enterprise Internal Application:**
→ **Azure Static Web Apps** (AD integration) or **AWS S3 + CloudFront** (Scalability)

**Existing Infrastructure:**
→ **Apache/Nginx** (Full control, custom configuration)

**Rapid Prototyping/Testing:**
→ **Local Python/Node.js server** (Quick setup, no deployment)

## Conclusion

This application is designed for easy deployment as a static web application. Choose the deployment option that best fits your needs, budget, and technical expertise. All options will provide a functional deployment with proper configuration.

For most users, **GitHub Pages** (free) or **Netlify** (free tier with advanced features) are the recommended starting points.
