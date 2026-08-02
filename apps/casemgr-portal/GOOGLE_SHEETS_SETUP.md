# Google Sheets Integration Setup Guide

## Overview
This guide will help you set up free Google Sheets integration for collaborative resource management. Team members can add/edit resources in a shared spreadsheet, and the portal will sync automatically.

## Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Community Resources Database"
3. Set up the following columns in Row 1 (header row):
   - A: `id`
   - B: `name`
   - C: `category`
   - D: `phone`
   - E: `address`
   - F: `city`
   - G: `hours`
   - H: `website`
   - I: `email`
   - J: `services`
   - K: `eligibility`
   - L: `notes`
   - M: `addedBy`
   - N: `dateAdded`

## Step 2: Create Google Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code
3. Paste the following code:

```javascript
// Google Apps Script for Resource Management
// This creates a REST API for your spreadsheet

const SHEET_NAME = 'Sheet1'; // Change if your sheet has a different name

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    const resources = rows.map(row => {
      const resource = {};
      headers.forEach((header, index) => {
        resource[header] = row[index];
      });
      return resource;
    }).filter(resource => resource.id && resource.name); // Filter out empty rows
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      resources: resources,
      count: resources.length
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'add') {
      // Add new resource
      const resource = data.resource;
      const newId = Utilities.getUuid();
      
      sheet.appendRow([
        newId,
        resource.name || '',
        resource.category || '',
        resource.phone || '',
        resource.address || '',
        resource.city || '',
        resource.hours || '',
        resource.website || '',
        resource.email || '',
        resource.services || '',
        resource.eligibility || '',
        resource.notes || '',
        resource.addedBy || 'Portal User',
        new Date().toISOString()
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        id: newId
      })).setMimeType(ContentService.MimeType.JSON);
      
    } else if (data.action === 'update') {
      // Update existing resource
      const allData = sheet.getDataRange().getValues();
      const headers = allData[0];
      const idIndex = headers.indexOf('id');
      
      for (let i = 1; i < allData.length; i++) {
        if (allData[i][idIndex] === data.id) {
          // Update the row
          Object.keys(data.updates).forEach(key => {
            const colIndex = headers.indexOf(key);
            if (colIndex !== -1) {
              sheet.getRange(i + 1, colIndex + 1).setValue(data.updates[key]);
            }
          });
          
          return ContentService.createTextOutput(JSON.stringify({
            success: true
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Resource not found'
      })).setMimeType(ContentService.MimeType.JSON);
      
    } else if (data.action === 'delete') {
      // Delete resource
      const allData = sheet.getDataRange().getValues();
      const headers = allData[0];
      const idIndex = headers.indexOf('id');
      
      for (let i = 1; i < allData.length; i++) {
        if (allData[i][idIndex] === data.id) {
          sheet.deleteRow(i + 1);
          
          return ContentService.createTextOutput(JSON.stringify({
            success: true
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Resource not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (disk icon)
5. Name your project: "Community Resources API"

## Step 3: Deploy as Web App

1. Click **Deploy > New deployment**
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**
3. Configure settings:
   - **Description**: Resource Management API
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Authorize** the script:
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" if you see a warning
   - Click "Go to Community Resources API (unsafe)"
   - Click "Allow"
6. **Copy the Web App URL** (it looks like: `https://script.google.com/macros/s/...../exec`)

## Step 4: Configure Your Portal

1. Create a `.env.local` file in your portal directory if it doesn't exist:
   ```bash
   # In apps/casemgr-portal/.env.local
   NEXT_PUBLIC_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

2. Update the configuration in `lib/google-sheets.ts`:
   ```typescript
   const GOOGLE_SHEETS_CONFIG = {
     WEB_APP_URL: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL || '',
     SHEET_NAME: 'Resources',
     ENABLED: true // Change to true
   }
   ```

3. Restart your development server

## Step 5: Test the Integration

1. Go to your Resources page in the portal
2. Click "Sync with Google Sheets" button
3. Add a test resource through the portal
4. Check your Google Sheet to see if it appears
5. Add a resource directly in Google Sheets
6. Sync again in the portal to pull it in

## Usage Tips

### For Case Managers:
- Use the portal's "Add Resource" button for quick additions
- Click "Sync" periodically to get updates from the team

### For Admin/Team:
- Edit resources directly in Google Sheets for bulk updates
- Use Sheet's built-in features: filtering, sorting, data validation
- Share the sheet with team members for collaborative editing
- Use Sheet's version history to track changes

### Best Practices:
- **Don't delete the header row** in Google Sheets
- **Generate unique IDs** for each resource (or let the script auto-generate)
- **Use consistent formatting** for phone numbers: `(XXX) XXX-XXXX`
- **Separate services with commas** in the services column
- **Sync regularly** to avoid conflicts

## Security Considerations

### Current Setup (Simple):
- ✅ Free and easy to set up
- ✅ No API keys needed
- ⚠️ Web app is publicly accessible (anyone with URL can read/write)
- ⚠️ Suitable for internal/low-risk data

### For Production (Recommended):
Consider upgrading to Google Sheets API with OAuth if you need:
- User authentication
- Fine-grained permissions
- Audit logging
- API rate limits
- Enterprise security

## Troubleshooting

### "Script not found" error:
- Check that the Web App URL is correct
- Make sure the script is deployed
- Try redeploying the script

### Resources not syncing:
- Check browser console for errors
- Verify `ENABLED: true` in config
- Test the Web App URL directly in browser
- Check Google Sheets permissions

### Duplicate resources:
- Ensure each resource has a unique ID
- Run a one-time cleanup in Google Sheets
- Use Sheet's "Remove duplicates" feature

## Advanced: Import Existing Resources

To import your existing mock resources into Google Sheets:

1. Export the MOCK_RESOURCES array from your code
2. Convert to CSV format
3. In Google Sheets: **File > Import > Upload**
4. Choose "Append to current sheet"
5. Sync in portal to merge with local data

## Support

For issues or questions:
- Check the browser console for detailed error messages
- Verify all column names match exactly
- Test the Apps Script using **Apps Script > Run > doGet**
- Check Google Sheets Apps Script quotas (usually generous for free tier)
