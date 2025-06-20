
# New Mexico Reggae Calendar - CSV Update Instructions

This guide explains how to update the reggae calendar events using the admin interface with a CSV file.

## Overview

The New Mexico Reggae Calendar admin interface allows you to:
- Upload new events via CSV file
- Preview events before importing them
- Backup existing data before making changes
- Replace all current events with new data

## Step-by-Step Instructions

### Step 1: Access the Admin Interface

1. **Navigate to the admin page**: Go to `http://localhost:3000/admin` (or your deployed domain + `/admin`)
2. **Enter the admin password**: The default password is `nmreggae2025`
3. **Click "Login"** to access the admin dashboard

### Step 2: Backup Current Data (Recommended)

**Before uploading new events, always backup your current data:**

1. In the admin interface, locate the **"Backup Data"** section
2. Click the **"Download Backup"** button
3. Save the JSON file to your computer (filename: `reggae-events-backup-YYYY-MM-DD.json`)
4. Keep this file safe - you can use it to restore data if needed

### Step 3: Prepare Your CSV File

#### Required CSV Format

Your CSV file must have exactly these 6 columns in this order:

```
date,event_name,venue,city,type,tickets_url
```

#### CSV Requirements

- **date**: Format as `YYYY-MM-DD` (e.g., `2025-07-15`)
- **event_name**: Full name of the event/artist
- **venue**: Name of the venue where the event takes place
- **city**: Must be one of: `Albuquerque`, `Santa Fe`, `Las Vegas`, `Rio Rancho`, or `Taos`
- **type**: Type of event (e.g., `Live Show`, `Free Outdoor Show`, `Festival`)
- **tickets_url**: Full URL for tickets (use empty cell if no tickets available)

#### Example CSV Content

```csv
date,event_name,venue,city,type,tickets_url
2025-07-15,311 Unity Tour,Rio Rancho Events Center,Rio Rancho,Live Show,https://www.ticketmaster.com/311-unity-tour-2025
2025-07-16,Iration w/ Mouse Powell,The Bridge at Santa Fe Brewing Company,Santa Fe,Live Show,https://santafebrewing.com/event/iration
2025-07-18,Dirty Heads,Sandia Amphitheater,Albuquerque,Live Show,https://www.jambase.com/show/dirty-heads
2025-07-18,Joseph General & High Vibration,Old Town Plaza,Albuquerque,Free Outdoor Show,
2025-07-20,Rebelution Summer Tour,Taos Mesa Brewing,Taos,Live Show,https://www.bandsintown.com/e/103456789
2025-07-27,Aaron Wolf - My People Tour,El Rialto Restaurant,Las Vegas,Live Show,https://www.eventbrite.com/e/aaron-wolf-tickets
```

### Step 4: Upload and Preview CSV

1. **In the admin interface**, locate the **"Upload CSV"** section
2. **Click "Choose File"** and select your prepared CSV file
3. **Click "Preview CSV"** to see how your events will appear
4. **Review the preview carefully**:
   - Check that all dates are formatted correctly
   - Verify venue names and cities are accurate
   - Ensure ticket URLs are working (click to test)
   - Look for any formatting issues or missing data

### Step 5: Import the Events

**Only proceed if the preview looks correct:**

1. **Click "Import Events"** button
2. **Confirm the action** when prompted
3. **Wait for confirmation** - you'll see a success message
4. **The page will reload** showing the updated event count

### Step 6: Verify the Update

1. **Go to the main calendar** at `http://localhost:3000`
2. **Navigate through the months** to verify your events appear correctly
3. **Check a few events** by clicking on them to ensure all details are accurate
4. **Test ticket links** to make sure they work properly

## Important Notes

### Data Replacement
- **WARNING**: Uploading a CSV file will **replace ALL existing events**
- Always backup your data before importing new events
- The system automatically removes all current events and replaces them with the CSV data

### Date Formatting
- Dates must be in `YYYY-MM-DD` format
- The system automatically calculates the day of the week
- Events outside the rolling 6-month window may not display immediately

### City Color Coding
The calendar uses specific color schemes for each city:
- **Albuquerque**: Emerald/Green theme
- **Santa Fe**: Purple theme  
- **Las Vegas**: Orange theme
- **Rio Rancho**: Cyan theme
- **Taos**: Rose/Pink theme

### Troubleshooting

#### CSV Upload Fails
- Check that your CSV has exactly 6 columns
- Verify date format is `YYYY-MM-DD`
- Ensure city names match exactly: `Albuquerque`, `Santa Fe`, `Las Vegas`, `Rio Rancho`, `Taos`
- Remove any special characters that might break the CSV format

#### Events Don't Appear
- Check that event dates are within the next 6 months
- Verify the city name is spelled correctly
- Refresh the main calendar page
- Use browser developer tools to check for JavaScript errors

#### Preview Shows Errors
- Fix the CSV file based on the error messages
- Re-upload and preview again before importing

### Security

- **Change the default password** for production use
- **Keep admin access secure** - only share credentials with authorized users
- **Regular backups** are recommended before major updates

### Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your CSV format matches the requirements exactly
3. Ensure you're using a recent version of Chrome, Firefox, or Safari
4. Try with a smaller CSV file first to test the process

---

**Last Updated**: June 20, 2025
**App Version**: Rolling 6-Month Calendar with Admin Interface

