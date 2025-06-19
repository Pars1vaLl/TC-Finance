# Warehouse Profit Analytics - Deployment Guide

## Overview
This guide covers the deployment of the Warehouse Profit Analytics (WPA) system to production.

## Prerequisites

### Required Accounts
- [ ] Google Workspace account with admin access
- [ ] GitHub account
- [ ] Domain name (optional but recommended)

### Required Permissions
- [ ] Google Sheets API access
- [ ] Google Apps Script deployment permissions
- [ ] Domain verification for OAuth (if using custom domain)

## Step 1: Google Apps Script Setup

### 1.1 Create Google Apps Script Project
1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the contents of `google-apps-script/Code.gs`
4. Save the project as "Warehouse Profit Analytics API"

### 1.2 Configure Spreadsheet ID
1. Create a new Google Spreadsheet
2. Copy the spreadsheet ID from the URL
3. Update `SPREADSHEET_ID` in `Code.gs`
4. Create the required sheets:
   - Transactions
   - Warehouses
   - CostTypes
   - Snapshots

### 1.3 Deploy as Web App
1. Click "Deploy" > "New deployment"
2. Choose "Web app" as type
3. Set access to "Anyone"
4. Deploy and copy the web app URL

## Step 2: Frontend Deployment

### 2.1 Build for Production
```bash
npm run build
```

### 2.2 Deploy to GitHub Pages
1. Create a new GitHub repository
2. Push the code to the repository
3. Go to Settings > Pages
4. Set source to "GitHub Actions"
5. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 2.3 Environment Variables
Create `.env.production`:
```
VITE_GOOGLE_SHEETS_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## Step 3: Google OAuth Setup

### 3.1 Create OAuth 2.0 Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
5. Set application type to "Web application"
6. Add authorized origins:
   - `https://yourdomain.com`
   - `https://yourusername.github.io`
7. Add authorized redirect URIs:
   - `https://yourdomain.com/auth/callback`
   - `https://yourusername.github.io/auth/callback`

### 3.2 Update Environment Variables
Update `VITE_GOOGLE_CLIENT_ID` with your OAuth client ID.

## Step 4: Domain Setup (Optional)

### 4.1 Custom Domain
1. Purchase domain from registrar
2. Add CNAME record pointing to `yourusername.github.io`
3. Configure GitHub Pages custom domain
4. Update OAuth credentials with new domain

### 4.2 SSL Certificate
- GitHub Pages provides automatic SSL
- For custom domains, configure SSL through registrar

## Step 5: Monitoring & Maintenance

### 5.1 Error Tracking
1. Set up Sentry account
2. Add Sentry SDK to the application
3. Configure error reporting

### 5.2 Performance Monitoring
1. Set up Google Analytics
2. Configure Core Web Vitals monitoring
3. Set up uptime monitoring (e.g., UptimeRobot)

### 5.3 Backup Procedures
1. Set up automated Google Sheets backup
2. Configure GitHub repository backup
3. Document recovery procedures

## Step 6: Security Review

### 6.1 Security Checklist
- [ ] OAuth 2.0 properly configured
- [ ] HTTPS enforced
- [ ] CORS headers configured
- [ ] Input validation implemented
- [ ] Rate limiting in place
- [ ] Error messages don't expose sensitive data

### 6.2 Access Control
- [ ] Admin users identified
- [ ] Role-based permissions configured
- [ ] Audit logging enabled
- [ ] Session management configured

## Step 7: Go-Live Checklist

### 7.1 Pre-Launch
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security audit completed
- [ ] Documentation updated
- [ ] Training materials prepared

### 7.2 Launch Day
- [ ] Deploy to production
- [ ] Verify all functionality
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Send launch announcement

### 7.3 Post-Launch
- [ ] Monitor system for 24 hours
- [ ] Collect user feedback
- [ ] Address any issues
- [ ] Schedule follow-up review

## Troubleshooting

### Common Issues

#### OAuth Errors
- Verify client ID is correct
- Check authorized origins and redirect URIs
- Ensure domain is verified

#### API Errors
- Verify Google Apps Script deployment URL
- Check spreadsheet permissions
- Review Apps Script logs

#### Performance Issues
- Check bundle size
- Optimize images
- Review caching configuration

## Support

For technical support:
1. Check the troubleshooting section
2. Review Google Apps Script logs
3. Check browser console for errors
4. Contact the development team

## Maintenance Schedule

### Daily
- Monitor error rates
- Check system performance
- Review user feedback

### Weekly
- Update dependencies
- Review security logs
- Backup verification

### Monthly
- Performance review
- Security audit
- User training sessions

### Quarterly
- Feature updates
- Infrastructure review
- User satisfaction survey 