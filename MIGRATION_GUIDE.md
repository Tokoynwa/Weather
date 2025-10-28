# Migration Guide: CloudVibes.org Deployment

## 📋 Pre-Migration Checklist

- [ ] Domain: cloudvibes.org is registered and accessible
- [ ] Docker installed and running on your server
- [ ] AdSense account configured with pub-1091636822057337
- [ ] Google Analytics account (optional but recommended)

## 🚀 Step-by-Step Migration

### 1. Server Setup

**Option A: Docker Deployment (Recommended)**
```bash
# On your server, clone or upload the weather-app directory
cd /path/to/weather-app

# Build and start the container
docker-compose up -d

# Verify it's running
docker ps
docker logs weather-app
```

**Option B: Direct Node.js Deployment**
```bash
cd /path/to/weather-app
npm install
npm start
```

### 2. Configure Reverse Proxy (Nginx)

Create `/etc/nginx/sites-available/cloudvibes.org`:

```nginx
server {
    listen 80;
    server_name cloudvibes.org www.cloudvibes.org;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Ensure ads.txt is served correctly
    location = /ads.txt {
        proxy_pass http://localhost:3000/ads.txt;
        proxy_set_header Host $host;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/cloudvibes.org /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d cloudvibes.org -d www.cloudvibes.org
```

After SSL is installed, your Nginx config will be auto-updated to:
```nginx
server {
    listen 443 ssl;
    server_name cloudvibes.org www.cloudvibes.org;

    ssl_certificate /etc/letsencrypt/live/cloudvibes.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cloudvibes.org/privkey.pem;

    # ... rest of config
}
```

### 4. Google Analytics Setup

1. Go to https://analytics.google.com
2. Create a new property for "cloudvibes.org"
3. Copy your Measurement ID (format: `G-XXXXXXXXXX`)
4. Edit `public/index.html` line 32:
   ```javascript
   gtag('config', 'G-XXXXXXXXXX'); // Replace with your ID
   ```
5. Rebuild Docker: `docker-compose up -d --build`

### 5. AdSense Configuration

**A. Create Ad Units**
1. Go to https://adsense.google.com
2. **Ads** → **By ad unit** → **Display ads**
3. Create two ad units:
   - "CloudVibes Top Banner" (Responsive)
   - "CloudVibes Middle Content" (Responsive)
4. Copy the `data-ad-slot` IDs

**B. Update HTML**
Edit `public/index.html`:
- Line 56: Update `data-ad-slot="0000000000"` with Top Banner slot ID
- Line 121: Update `data-ad-slot="0000000000"` with Middle Content slot ID

**C. Verify ads.txt**
Visit: `https://cloudvibes.org/ads.txt`

Should show:
```
google.com, pub-1091636822057337, DIRECT, f08c47fec0942fa0
```

**D. Add Domain to AdSense**
1. AdSense → **Sites** → **Add site**
2. Enter: `cloudvibes.org`
3. If verification is needed, download the HTML file
4. Place it in `public/` folder
5. Rebuild: `docker-compose up -d --build`
6. Verify at: `https://cloudvibes.org/verification-file.html`

### 6. SEO & Social Media

**A. Update OG Image** (Optional but recommended)
Create a 1200x630px image for social sharing:
```bash
# Place image in public folder
cp your-og-image.png public/og-image.png
```

**B. Submit to Search Engines**
- Google: https://search.google.com/search-console
- Bing: https://www.bing.com/webmasters

**C. Create sitemap.xml**
Create `public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://cloudvibes.org/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

**D. Create robots.txt**
Create `public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://cloudvibes.org/sitemap.xml
```

### 7. Performance & Monitoring

**A. Enable Compression in Nginx**
Add to your Nginx server block:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

**B. Monitor Logs**
```bash
# Docker logs
docker logs -f weather-app

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

**C. Auto-restart on Crash**
Docker Compose already has `restart: unless-stopped` configured.

## 📈 Increasing Traffic

### 1. SEO Optimization (Already Implemented)
✅ Meta descriptions and keywords
✅ Open Graph tags for social sharing
✅ Semantic HTML structure
✅ Fast loading times

### 2. Content Marketing
- **Blog**: Add weather tips, climate insights
- **City Pages**: Create dedicated pages for popular cities
- **Weather Alerts**: Add severe weather notifications

### 3. Social Media
- Share daily weather updates
- Post interesting weather facts
- Use hashtags: #weather #forecast #cloudvibes
- Pinterest: Create weather infographics

### 4. Backlinks
- Submit to web directories
- Guest post on weather/travel blogs
- Partner with local news sites

### 5. Local SEO
- Add location-specific landing pages
- Use schema markup for LocalBusiness
- Register on Google My Business

### 6. User Engagement
- Add weather widgets for websites
- Create browser extension
- Develop mobile app
- Email newsletter with weather tips

### 7. Paid Advertising (Optional)
- Google Ads for weather-related keywords
- Facebook/Instagram ads targeting travelers
- Reddit ads in r/weather communities

## 🔄 Regular Maintenance

**Daily:**
- Monitor AdSense earnings
- Check for errors in logs

**Weekly:**
- Review Google Analytics traffic
- Update meta descriptions if needed
- Respond to user feedback

**Monthly:**
- Renew SSL certificates (auto with certbot)
- Review and optimize ad placements
- Analyze top-performing pages
- Update content/features

## 🆘 Troubleshooting

### Ads Not Showing
- Wait 24-48 hours after AdSense approval
- Check browser console for errors
- Verify ad slot IDs are correct
- Test in incognito mode

### Site Down
```bash
docker ps  # Check if container is running
docker logs weather-app  # Check for errors
sudo systemctl status nginx  # Check Nginx
```

### SSL Issues
```bash
sudo certbot renew --dry-run  # Test renewal
sudo certbot certificates  # Check expiry
```

### High Server Load
```bash
docker stats  # Monitor container resources
htop  # Check server resources
```

## 📞 Support Resources

- Weather API: https://open-meteo.com/
- Google AdSense Help: https://support.google.com/adsense
- Nginx Docs: https://nginx.org/en/docs/
- Docker Docs: https://docs.docker.com/

---

**🎉 Your CloudVibes.org is now ready for the world!**
