
# New Mexico Reggae Calendar - Maintenance Guide

## Overview

This guide covers how to maintain your New Mexico Reggae Calendar app with rolling 6-month view, including managing events via CSV uploads, troubleshooting, and regular maintenance tasks.

## Admin Interface Usage

### Accessing Admin Panel

1. **URL**: `https://your-domain.com/admin`
2. **Password**: Use the ADMIN_PASSWORD set in your environment variables
3. **Default Password**: `nmreggae2025` (change this in production!)

### Managing Events via CSV

#### CSV Format Requirements

Your CSV file must include these columns (headers are case-insensitive):

| Column | Required | Format | Example |
|--------|----------|--------|---------|
| `date` | Yes | YYYY-MM-DD | 2025-07-15 |
| `event_name` | Yes | Text | "Iration w/ Mouse Powell" |
| `venue` | Yes | Text | "Santa Fe Brewing Company" |
| `city` | Yes | Text | "Santa Fe" |
| `type` | No | Text | "Live Show" (default) |
| `tickets_url` | No | URL | "https://..." |
| `day_of_week` | No | Text | Auto-calculated if empty |
| `state` | No | Text | "NM" (default) |
| `country` | No | Text | "USA" (default) |

#### Example CSV Content:
```csv
date,event_name,venue,city,type,tickets_url
2025-07-15,"311 Unity Tour","Rio Rancho Events Center","Rio Rancho","Live Show","https://ticketmaster.com/..."
2025-07-16,"Iration w/ Mouse Powell","Santa Fe Brewing Company","Santa Fe","Live Show","https://santafebrewing.com/..."
2025-07-18,"Dirty Heads","Sandia Amphitheater","Albuquerque","Live Show","https://jambase.com/..."
```

### Step-by-Step Upload Process

1. **Create Backup** (IMPORTANT):
   - Click "Download Backup" button
   - Save the CSV file safely (includes current data)

2. **Prepare CSV File**:
   - Ensure proper format (see above)
   - Include only events within your desired timeframe
   - Verify dates are correct

3. **Preview Upload**:
   - Select your CSV file
   - Click "Preview" button
   - Review the preview table
   - Check for any formatting issues

4. **Upload & Save**:
   - If preview looks correct, click "Upload & Save"
   - This will replace ALL existing events
   - Confirmation message will show number of events uploaded

### Rolling 6-Month Window

The calendar automatically displays events for the next 6 months from the current date:

- **Current behavior**: Shows upcoming 6 months from today
- **Navigation**: Users can navigate between months using Previous/Next buttons
- **Auto-filtering**: Past events are automatically filtered out
- **Monthly organization**: Events are grouped by month and city

## Regular Maintenance Tasks

### Monthly (Recommended)

1. **Update Event Data**:
   - Gather new event information from venues, promoters, social media
   - Update your CSV file with new events
   - Upload via admin interface

2. **Data Backup**:
   - Download current data backup via admin interface
   - Store backup files safely (cloud storage recommended)

3. **Review Analytics** (if enabled):
   - Check Vercel Analytics for usage patterns
   - Monitor popular events and cities

### Quarterly

1. **Dependency Updates**:
   ```bash
   cd /home/ubuntu/nm-reggae-calendar/app
   yarn upgrade
   yarn audit
   ```

2. **Database Maintenance**:
   - Review database storage usage
   - Clean up very old events if needed (optional)

3. **Security Review**:
   - Rotate admin password
   - Update environment variables
   - Review access logs

### As Needed

1. **Content Updates**:
   - Update branding or styling
   - Add new cities to the color scheme
   - Modify event types or categories

2. **Feature Additions**:
   - Add new fields to events
   - Implement additional filtering
   - Enhance mobile responsiveness

## Troubleshooting Common Issues

### Upload Problems

**Issue**: "Failed to parse CSV"
- **Solution**: Check CSV format, ensure proper encoding (UTF-8)
- **Check**: Column headers match expected format
- **Verify**: No special characters in dates

**Issue**: "Invalid password"
- **Solution**: Verify ADMIN_PASSWORD environment variable
- **Check**: Password hasn't been changed in Vercel settings

**Issue**: Events not appearing
- **Solution**: Check date format (YYYY-MM-DD required)
- **Verify**: Events are within 6-month window from today

### Display Issues

**Issue**: No events showing
- **Check**: Current date vs. event dates
- **Verify**: Database connection is working
- **Test**: API endpoint directly: `/api/events`

**Issue**: Wrong month/year displayed
- **Solution**: Check system date on server
- **Verify**: Rolling month calculation logic

**Issue**: City colors not working
- **Check**: City names match exactly (case-sensitive)
- **Add**: New cities to cityColors object if needed

### Performance Issues

**Issue**: Slow loading
- **Monitor**: Vercel function duration
- **Check**: Database query performance
- **Consider**: Adding database indexes

**Issue**: API timeouts
- **Review**: Vercel function logs
- **Check**: Database connection pool settings
- **Verify**: Large CSV files aren't causing timeouts

## Data Management Best Practices

### Event Data Quality

1. **Consistent City Names**:
   - Use standard city names: "Albuquerque", "Santa Fe", "Las Vegas", "Rio Rancho"
   - Avoid abbreviations or variations

2. **Date Formatting**:
   - Always use YYYY-MM-DD format
   - Verify dates are correct (common typo: wrong year)

3. **URL Validation**:
   - Test ticket URLs before uploading
   - Use full URLs (include https://)
   - Remove tracking parameters if possible

### Backup Strategy

1. **Regular Backups**:
   - Download CSV backup before each update
   - Store backups with date stamps
   - Keep at least 3 months of backups

2. **Version Control**:
   - Keep CSV source files in version control
   - Document changes and sources
   - Tag releases/major updates

### Data Sources

**Recommended Sources for Event Information**:
- Venue websites and social media
- Ticketing platforms (Ticketmaster, Eventbrite)
- Music platforms (Bandsintown, Songkick)
- Local music blogs and publications
- Artist and band social media

## Monitoring & Analytics

### Key Metrics to Track

1. **Usage Statistics**:
   - Page views and unique visitors
   - Popular months/events
   - Mobile vs desktop usage

2. **Technical Performance**:
   - Page load times
   - API response times
   - Error rates

3. **Content Performance**:
   - Most viewed events
   - Click-through rates on ticket links
   - Popular cities

### Setting Up Monitoring

1. **Vercel Analytics**:
   ```bash
   yarn add @vercel/analytics
   ```

2. **Error Tracking** (optional):
   - Consider Sentry for error monitoring
   - Set up alerts for API failures

3. **Uptime Monitoring**:
   - Use services like UptimeRobot
   - Monitor main page and API endpoints

## Advanced Maintenance

### Database Optimization

1. **Query Performance**:
   - Monitor slow queries
   - Add indexes for common filters
   - Consider query optimization

2. **Data Cleanup**:
   ```sql
   -- Remove events older than 6 months (optional)
   DELETE FROM events WHERE date < NOW() - INTERVAL '6 months';
   ```

### Scaling Considerations

1. **Traffic Growth**:
   - Monitor Vercel function usage
   - Consider upgrading database plan
   - Implement caching if needed

2. **Feature Expansion**:
   - Plan for additional event types
   - Consider user-submitted events
   - Implement event categories

## Emergency Procedures

### Data Loss Recovery

1. **From Backup**:
   - Use most recent CSV backup
   - Upload via admin interface
   - Verify data integrity

2. **Database Issues**:
   - Check database provider status
   - Review connection settings
   - Contact database provider support

### Site Down

1. **Vercel Issues**:
   - Check Vercel status page
   - Review deployment logs
   - Trigger redeployment if needed

2. **Database Connection**:
   - Verify environment variables
   - Test database connectivity
   - Check database provider status

## Contact & Support

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Database Provider**: Check your provider's support channels
- **Technical Issues**: Review deployment and function logs

---

**Monthly Maintenance Checklist:**
- [ ] Download data backup
- [ ] Gather new event information
- [ ] Update and upload CSV file
- [ ] Verify events display correctly
- [ ] Check for any broken ticket links
- [ ] Review analytics (if enabled)
- [ ] Test admin interface functionality

**Emergency Contact Info:**
- Admin Password: [Store securely]
- Database Provider: [Your provider]
- Domain Registrar: [If using custom domain]
- Vercel Account: [Your account email]
