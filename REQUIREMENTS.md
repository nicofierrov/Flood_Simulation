# Requirements Documentation

## System Requirements

### Browser Requirements

#### Minimum Browser Versions
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile Safari**: iOS 14+
- **Chrome Mobile**: Android 90+

#### Browser Features Required
- ✅ ES6+ JavaScript support (modules, async/await)
- ✅ WebGL 2.0 support (for 3D mapping features)
- ✅ CSS Grid and Flexbox
- ✅ Web Components support
- ✅ Canvas API (for Chart.js)
- ✅ Fetch API
- ✅ Local Storage API
- ✅ Geolocation API (optional)

### Network Requirements

#### Internet Connection
- **Required**: Yes (all dependencies are CDN-based)
- **Minimum Bandwidth**: 5 Mbps recommended
- **Latency**: <500ms for optimal experience

#### Domain Whitelist
The application requires access to the following external domains:

1. **ArcGIS Services**
   - `js.arcgis.com` - ArcGIS Maps SDK
   - `www.arcgis.com` - ArcGIS Portal (configurable)
   - `*.arcgis.com` - ArcGIS services and tiles

2. **CDN Services**
   - `cdnjs.cloudflare.com` - Chart.js library

3. **Web Map Services**
   - ArcGIS Online or Enterprise portal (as configured)

### Hardware Requirements

#### Minimum Specifications
- **CPU**: Dual-core processor, 2.0 GHz
- **RAM**: 4 GB
- **GPU**: WebGL 2.0 compatible graphics
- **Screen Resolution**: 1280x720 (HD)

#### Recommended Specifications
- **CPU**: Quad-core processor, 2.5 GHz+
- **RAM**: 8 GB+
- **GPU**: Dedicated graphics card with WebGL 2.0
- **Screen Resolution**: 1920x1080 (Full HD) or higher

## Software Dependencies

### Runtime Dependencies (CDN-Based)

All dependencies are loaded from external CDNs - no local installation required:

#### 1. ArcGIS Maps SDK for JavaScript
- **Version**: 4.30
- **License**: Requires ArcGIS Developer account
- **CDN**: `https://js.arcgis.com/4.30/`
- **Documentation**: https://developers.arcgis.com/javascript/latest/
- **Purpose**: Core GIS and mapping functionality

#### 2. Calcite Design System
- **Version**: 2.10.1
- **License**: Apache 2.0
- **CDN**: `https://js.arcgis.com/calcite-components/2.10.1/`
- **Documentation**: https://developers.arcgis.com/calcite-design-system/
- **Purpose**: UI components and design system

#### 3. Chart.js
- **Version**: 4.4.1
- **License**: MIT
- **CDN**: `https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js`
- **Documentation**: https://www.chartjs.org/
- **Purpose**: Flood depth comparison charts

### Development Dependencies

**None** - This is a static web application with no build process.

### Web Server Requirements

#### Minimum Requirements
- Any static web server capable of serving HTML, CSS, and JavaScript files
- HTTPS support (recommended for production)
- Support for custom HTTP headers (optional, for security)

#### Supported Web Servers
- ✅ Apache HTTP Server 2.4+
- ✅ Nginx 1.18+
- ✅ Microsoft IIS 10+
- ✅ Node.js (http-server, serve, etc.)
- ✅ Python SimpleHTTPServer / http.server
- ✅ GitHub Pages
- ✅ Netlify
- ✅ Vercel
- ✅ AWS S3 + CloudFront
- ✅ Azure Static Web Apps
- ✅ Google Cloud Storage + CDN

## ArcGIS Platform Requirements

### ArcGIS Account

#### Required Components
1. **ArcGIS Developer Account** OR **ArcGIS Online Organization Account**
   - Free developer account: https://developers.arcgis.com/sign-up/
   - Organization account for enterprise deployment

#### Authentication Options

**Option 1: Anonymous Access (Public Apps)**
- Set `authMode: "anonymous"` in `config/application.json`
- Set `apiKey: "your-api-key"` for accessing ArcGIS services
- Set `oauthappid: null`

**Option 2: OAuth Authentication (User Sign-In)**
- Set `authMode: "oauth"` in `config/application.json`
- Register OAuth application in ArcGIS Developer dashboard
- Set `oauthappid: "your-oauth-app-id"`
- Configure redirect URI to point to `oauth-callback.html`

### Web Map Configuration

#### Required Web Map Structure
The application expects a specific layer organization in the ArcGIS Web Map:

**Expected Layers:**
1. **Group: "Expected"**
   - Stanwood Expected Flow (Imagery Layer)
   - Stanwood Expected Depth (Imagery Layer)

2. **Group: "Mitigation"**
   - Stanwood Mitigation Flow (Imagery Layer)
   - Stanwood Mitigation Depth (Imagery Layer)

3. **Optional: "Stanwood Mitigation"** (visual barriers)

#### Multidimensional Data Requirements
- **Variable Name**: Configurable (default: "B1")
- **Time Dimension**: Configurable (default: "StdTime")
- **Format**: NetCDF or compatible multidimensional raster format
- **Temporal Resolution**: Minute-level time steps

#### Web Map ID
- Must be set in `config/application.json` as `webmap` property
- Example: `"webmap": "d3e96b24ac9d421aa399fc9aec58b0b1"`

## Configuration Requirements

### Mandatory Configuration Items

Edit `config/application.json` before deployment:

```json
{
  "title": "Your Application Title",
  "snippet": "Short description",
  "description": "Detailed description",
  "portalUrl": "https://www.arcgis.com",
  "oauthappid": "your-oauth-app-id-or-null",
  "authMode": "anonymous",
  "apiKey": "your-api-key-or-null",
  "webmap": "your-webmap-id",
  "depthVariableName": "B1",
  "timeDimensionName": "StdTime",
  "depthUnit": {
    "name": "meters",
    "label": "m"
  }
}
```

### Required Parameters
- ✅ `portalUrl` - ArcGIS Portal URL
- ✅ `authMode` - "anonymous" or oauth-based
- ✅ `webmap` - Web map item ID
- ✅ `depthVariableName` - Variable name in multidimensional data
- ✅ `timeDimensionName` - Time dimension name

### Optional Parameters
- `oauthappid` - Required only for OAuth mode
- `apiKey` - Required only for anonymous mode with API key
- `webscene` - For 3D scene (not used in current config)
- `group` - ArcGIS group ID for content organization

## Security Requirements

### HTTPS Configuration
- **Production**: HTTPS is strongly recommended
- **Development**: HTTP acceptable for localhost only

### Content Security Policy (Optional)
Recommended CSP headers for enhanced security:

```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'unsafe-inline' 'unsafe-eval' 
    https://js.arcgis.com 
    https://cdnjs.cloudflare.com; 
  style-src 'self' 'unsafe-inline' 
    https://js.arcgis.com; 
  img-src 'self' data: https:; 
  connect-src 'self' https://*.arcgis.com; 
  font-src 'self' data:; 
  frame-src 'none';
```

### CORS Requirements
- Web map services must allow CORS requests from your domain
- Typically handled automatically by ArcGIS Online/Enterprise

## Data Requirements

### Multidimensional Raster Data
- **Format**: NetCDF, HDF, or ArcGIS-compatible format
- **Structure**: Must include time dimension and depth variable
- **Publishing**: Must be published as Image Service with multidimensional support
- **Time Intervals**: Consistent time steps (e.g., every minute)

### Spatial Reference
- **Recommended**: Web Mercator (EPSG:3857) or WGS84 (EPSG:4326)
- **Support**: Any spatial reference supported by ArcGIS

## Performance Requirements

### Initial Load Time
- **Target**: < 5 seconds on broadband connection
- **Factors**: Depends on web map complexity and data size

### Runtime Performance
- **Frame Rate**: 30+ FPS for smooth interactions
- **Memory**: < 500 MB typical usage
- **CPU**: < 50% on recommended hardware

## Accessibility Requirements

### WCAG 2.1 Support
- Calcite Components provide Level AA compliance
- Keyboard navigation supported
- Screen reader compatible
- High contrast mode available

## Localization Requirements

### Default Language
- **English** (US) - Default
- **Configurable**: Date/time formatters can be adjusted for locale

### Internationalization
- Application text can be modified in source files
- Calcite Components support multiple languages
- Number and date formatting uses browser locale

## Maintenance Requirements

### Update Frequency
- **ArcGIS SDK**: Check for updates quarterly
- **Calcite Components**: Check for updates quarterly
- **Chart.js**: Check for updates semi-annually
- **Web Map Data**: Update as needed

### Monitoring
- Browser console for JavaScript errors
- Network tab for failed resource loads
- ArcGIS service health dashboard

## Summary Checklist

### Pre-Deployment Checklist
- [ ] Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)
- [ ] Internet connection (5 Mbps+)
- [ ] ArcGIS Developer or Organization account
- [ ] Web server configured (Apache, Nginx, or cloud hosting)
- [ ] Web map created with proper layer structure
- [ ] Multidimensional flood data published as Image Service
- [ ] `config/application.json` configured with correct IDs
- [ ] OAuth app registered (if using user authentication)
- [ ] HTTPS enabled (for production)
- [ ] Domain whitelisted for CORS (if needed)

### Post-Deployment Verification
- [ ] Application loads without errors
- [ ] Map displays correctly
- [ ] Time slider functions properly
- [ ] Swipe widget works
- [ ] Location comparison chart displays data
- [ ] Authentication works (if enabled)
- [ ] Responsive layout on mobile devices
- [ ] Cross-browser compatibility verified
