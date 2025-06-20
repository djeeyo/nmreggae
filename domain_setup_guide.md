
# Custom Domain Setup Guide for nmreggaecalendar.com

This comprehensive guide will walk you through setting up a custom domain for your New Mexico Reggae Calendar NextJS application. Follow these steps to get your site live at nmreggaecalendar.com.

## Table of Contents
1. [Domain Purchase](#1-domain-purchase)
2. [Hosting Platform Selection](#2-hosting-platform-selection)
3. [Deploying Your NextJS App](#3-deploying-your-nextjs-app)
4. [Custom Domain Configuration](#4-custom-domain-configuration)
5. [DNS Configuration](#5-dns-configuration)
6. [SSL Certificate Setup](#6-ssl-certificate-setup)
7. [Testing and Verification](#7-testing-and-verification)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Domain Purchase

### Step 1.1: Choose a Domain Registrar
Popular and reliable domain registrars include:
- **Namecheap** (recommended for beginners)
- **GoDaddy**
- **Google Domains** (now part of Squarespace)
- **Cloudflare Registrar**
- **Porkbun**

### Step 1.2: Purchase nmreggaecalendar.com
1. Visit your chosen registrar's website
2. Search for "nmreggaecalendar.com"
3. Add to cart and proceed to checkout
4. **Important**: During checkout, consider these options:
   - **Domain Privacy Protection**: Recommended to hide your personal information
   - **Auto-renewal**: Recommended to prevent accidental expiration
   - **DNS Management**: Usually included for free

### Step 1.3: Domain Registration Tips
- Register for at least 2 years for better SEO
- Keep your registrar login credentials secure
- Set up account notifications for renewal reminders

---

## 2. Hosting Platform Selection

For NextJS applications, here are the best hosting options:

### Option A: Vercel (Recommended for NextJS)
**Pros:**
- Built specifically for NextJS
- Automatic deployments from Git
- Free tier available
- Excellent performance
- Built-in CDN

**Cons:**
- Can be expensive for high traffic
- Limited backend capabilities on free tier

### Option B: Netlify
**Pros:**
- Great free tier
- Easy to use interface
- Good for static sites
- Built-in form handling

**Cons:**
- Less optimized for NextJS than Vercel
- Function limitations on free tier

### Option C: Railway
**Pros:**
- Good for full-stack applications
- Reasonable pricing
- Easy database integration

**Cons:**
- Smaller community
- Less documentation

### Option D: DigitalOcean App Platform
**Pros:**
- Predictable pricing
- Good performance
- Full control over infrastructure

**Cons:**
- More technical setup required
- No free tier

**Recommendation**: Use Vercel for the best NextJS experience.

---

## 3. Deploying Your NextJS App

### Option A: Deploying to Vercel

#### Step 3.1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up using GitHub, GitLab, or Bitbucket (recommended)
3. Verify your email address

#### Step 3.2: Prepare Your Code Repository
1. **Create a GitHub repository:**
   ```bash
   # Navigate to your project directory
   cd /home/ubuntu/nm-reggae-calendar
   
   # Initialize git (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit your code
   git commit -m "Initial commit - NM Reggae Calendar"
   
   # Add your GitHub repository as remote
   git remote add origin https://github.com/yourusername/nm-reggae-calendar.git
   
   # Push to GitHub
   git push -u origin main
   ```

#### Step 3.3: Deploy to Vercel
1. In your Vercel dashboard, click "New Project"
2. Import your GitHub repository
3. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./app` (since your NextJS app is in the app folder)
   - **Build Command**: `yarn build`
   - **Output Directory**: `.next`
4. Click "Deploy"
5. Wait for deployment to complete (usually 2-3 minutes)

### Option B: Deploying to Netlify

#### Step 3.1: Create Netlify Account
1. Go to [netlify.com](https://netlify.com)
2. Sign up using GitHub, GitLab, or Bitbucket
3. Verify your email address

#### Step 3.2: Deploy Your Site
1. In Netlify dashboard, click "New site from Git"
2. Choose your Git provider and repository
3. Configure build settings:
   - **Base directory**: `app`
   - **Build command**: `yarn build`
   - **Publish directory**: `app/.next`
4. Click "Deploy site"

---

## 4. Custom Domain Configuration

### Step 4.1: Add Domain to Hosting Platform

#### For Vercel:
1. Go to your project dashboard
2. Click on "Settings" tab
3. Click "Domains" in the sidebar
4. Click "Add Domain"
5. Enter `nmreggaecalendar.com`
6. Click "Add"
7. Also add `www.nmreggaecalendar.com` and set it to redirect to the main domain

#### For Netlify:
1. Go to your site dashboard
2. Click "Domain settings"
3. Click "Add custom domain"
4. Enter `nmreggaecalendar.com`
5. Click "Verify"
6. Add `www.nmreggaecalendar.com` as an alias

### Step 4.2: Note the DNS Records
Your hosting platform will provide DNS records that you need to configure. Common records include:
- **A Record**: Points to an IP address
- **CNAME Record**: Points to another domain
- **AAAA Record**: Points to an IPv6 address

---

## 5. DNS Configuration

### Step 5.1: Access Your Domain's DNS Settings
1. Log into your domain registrar account
2. Find "DNS Management" or "DNS Settings"
3. Look for options to add/edit DNS records

### Step 5.2: Configure DNS Records

#### For Vercel:
Add these records to your DNS:
```
Type: A
Name: @
Value: 76.76.19.61

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### For Netlify:
Add these records to your DNS:
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site-name.netlify.app
```

### Step 5.3: DNS Propagation
- DNS changes can take 24-48 hours to propagate globally
- You can check propagation status at [whatsmydns.net](https://whatsmydns.net)
- Most changes are visible within 1-2 hours

---

## 6. SSL Certificate Setup

### Automatic SSL (Recommended)
Most modern hosting platforms provide automatic SSL certificates:

#### Vercel:
- SSL certificates are automatically provisioned
- No additional configuration needed
- Certificates auto-renew

#### Netlify:
- Go to "Domain settings"
- Click "HTTPS"
- Click "Verify DNS configuration"
- Certificate will be automatically provisioned

### Manual SSL Setup (Advanced)
If you need manual SSL setup:
1. Obtain an SSL certificate from:
   - Let's Encrypt (free)
   - Cloudflare (free with their service)
   - Commercial providers (Comodo, DigiCert, etc.)
2. Upload certificate files to your hosting platform
3. Configure HTTPS redirects

---

## 7. Testing and Verification

### Step 7.1: Basic Functionality Test
1. Visit `https://nmreggaecalendar.com`
2. Verify the site loads correctly
3. Test navigation between pages
4. Check that all images and assets load

### Step 7.2: SSL Certificate Verification
1. Look for the padlock icon in your browser
2. Click on the padlock to view certificate details
3. Verify the certificate is valid and trusted

### Step 7.3: Performance Testing
Use these tools to test your site:
- **Google PageSpeed Insights**: [pagespeed.web.dev](https://pagespeed.web.dev)
- **GTmetrix**: [gtmetrix.com](https://gtmetrix.com)
- **WebPageTest**: [webpagetest.org](https://webpagetest.org)

### Step 7.4: Mobile Responsiveness
- Test on various devices and screen sizes
- Use browser developer tools to simulate mobile devices
- Check that all functionality works on mobile

---

## 8. Troubleshooting

### Common Issues and Solutions

#### Issue: "Domain not found" or DNS errors
**Solutions:**
- Wait for DNS propagation (up to 48 hours)
- Double-check DNS record configuration
- Clear your browser cache and DNS cache
- Try accessing from a different network

#### Issue: SSL certificate errors
**Solutions:**
- Wait for certificate provisioning (can take up to 24 hours)
- Verify DNS records are correct
- Contact hosting platform support
- Try accessing via HTTPS explicitly

#### Issue: Site loads but assets are missing
**Solutions:**
- Check build configuration
- Verify all files were uploaded correctly
- Check for case-sensitive file path issues
- Review browser console for error messages

#### Issue: Slow loading times
**Solutions:**
- Optimize images (use WebP format, compress files)
- Enable CDN if not already active
- Minimize JavaScript and CSS files
- Consider upgrading hosting plan

### Getting Help
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Netlify Support**: [netlify.com/support](https://netlify.com/support)
- **Domain Registrar Support**: Contact your registrar's customer service
- **Community Forums**: Stack Overflow, Reddit r/webdev

---

## Additional Considerations

### SEO Optimization
1. **Google Search Console**: Add your domain to track search performance
2. **Sitemap**: Ensure your NextJS app generates a sitemap
3. **Meta Tags**: Verify all pages have proper meta descriptions and titles
4. **Analytics**: Set up Google Analytics or similar tracking

### Security Best Practices
1. **Regular Updates**: Keep your NextJS app and dependencies updated
2. **Environment Variables**: Never commit sensitive data to your repository
3. **HTTPS Only**: Ensure all traffic is redirected to HTTPS
4. **Content Security Policy**: Consider implementing CSP headers

### Backup and Monitoring
1. **Regular Backups**: Set up automated backups of your code and data
2. **Uptime Monitoring**: Use services like UptimeRobot or Pingdom
3. **Error Tracking**: Consider tools like Sentry for error monitoring
4. **Performance Monitoring**: Set up alerts for performance degradation

### Cost Considerations
- **Domain Renewal**: Budget for annual domain renewal costs
- **Hosting Costs**: Monitor usage to avoid unexpected charges
- **CDN Costs**: Understand bandwidth pricing for your hosting platform
- **SSL Certificate**: Most platforms include free SSL, but verify this

---

## Quick Reference Checklist

- [ ] Domain purchased and registered
- [ ] Hosting platform account created
- [ ] Code repository set up on GitHub/GitLab
- [ ] Application deployed to hosting platform
- [ ] Custom domain added to hosting platform
- [ ] DNS records configured at domain registrar
- [ ] SSL certificate provisioned and active
- [ ] Site tested and verified working
- [ ] Performance optimized
- [ ] Analytics and monitoring set up

---

**Congratulations!** Once you've completed all these steps, your New Mexico Reggae Calendar will be live at nmreggaecalendar.com, bringing irie vibes to the high desert for all to enjoy!

For any technical issues or questions, don't hesitate to reach out to your hosting platform's support team or consult the extensive documentation they provide.
