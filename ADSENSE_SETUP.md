# AdSense Setup Instructions

## ✅ What's Already Done

1. **ads.txt file** - Created at `/public/ads.txt` with your publisher ID
2. **AdSense script** - Added to HTML `<head>`
3. **Ad units** - Placed in 2 locations (top banner, between sections)
4. **Express route** - Configured to serve ads.txt properly

## 🔧 What You Need to Do

### Step 1: Create Ad Units in AdSense Dashboard

1. Go to https://adsense.google.com
2. Navigate to **Ads** → **By ad unit**
3. Click **+ New ad unit** → **Display ads**
4. Create TWO ad units:
   - **Top Banner Ad** (Responsive)
   - **Middle Content Ad** (Responsive)
5. For each ad unit, Google will give you a code with a `data-ad-slot` value like this:
   ```html
   data-ad-slot="1234567890"
   ```

### Step 2: Update Ad Slot IDs

Open `public/index.html` and replace `data-ad-slot="0000000000"` with your actual slot IDs:

**Line 26** - Top Banner Ad:
```html
data-ad-slot="YOUR_TOP_BANNER_SLOT_ID"
```

**Line 91** - Middle Content Ad:
```html
data-ad-slot="YOUR_MIDDLE_CONTENT_SLOT_ID"
```

### Step 3: Add Your Domain to AdSense

1. In AdSense dashboard: **Sites** → **Add site**
2. Enter your domain (e.g., `yourdomain.com`)
3. If asked for verification:
   - Download the verification HTML file
   - Place it in `/public/` folder
   - Access it at `http://yourdomain.com/verification-file.html`

### Step 4: Deploy and Verify

1. Deploy your weather app to your domain
2. Make sure these URLs are accessible:
   - `http://yourdomain.com/ads.txt`
   - `http://yourdomain.com/` (your main site)
3. Wait for Google to verify (can take 24-48 hours)
4. Ads will start showing once approved

## 📝 Notes

- **Ad slots `0000000000`** are placeholders - replace with real slot IDs from AdSense
- **ads.txt** is already configured with: `google.com, pub-1091636822057337, DIRECT, f08c47fec0942fa0`
- Ads won't show until:
  - You replace placeholder slot IDs
  - Your site is verified in AdSense
  - Google approves your site (usually 24-48 hours)

## 🚀 Quick Test

After updating slot IDs and deploying:
1. Visit your site in incognito mode
2. Check browser console for AdSense errors
3. Look for `adsbygoogle.push()` calls succeeding

## 🆘 Troubleshooting

- **No ads showing?** - Check console for errors, verify slot IDs are correct
- **ads.txt errors?** - Make sure `http://yourdomain.com/ads.txt` loads properly
- **Verification issues?** - Ensure verification file is in `/public/` folder
