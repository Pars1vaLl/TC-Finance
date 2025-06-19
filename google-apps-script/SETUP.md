# Google Apps Script Setup Guide

## Step 1: Create Google Sheets

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Rename it to "Warehouse Profit Analytics"
4. Copy the spreadsheet ID from the URL (the long string between /d/ and /edit)

## Step 2: Set Up Sheets Structure

Create the following sheets in your Google Spreadsheet:

### Transactions Sheet
| Column | Header | Description |
|--------|--------|-------------|
| A | id | UUID for transaction |
| B | date | Transaction date (YYYY-MM-DD) |
| C | warehouse_id | Reference to warehouse |
| D | cost_type_id | Reference to cost type |
| E | is_income | 1 for income, 0 for expense |
| F | amount | Transaction amount |
| G | currency | Currency code (TJS, USD, EUR) |
| H | amount_tjs | Amount converted to TJS |
| I | created_at | Timestamp |

### Warehouses Sheet
| Column | Header | Description |
|--------|--------|-------------|
| A | id | UUID for warehouse |
| B | name | Warehouse name |
| C | emoji | Emoji icon |
| D | color | Brand color |
| E | created_at | Timestamp |

### CostTypes Sheet
| Column | Header | Description |
|--------|--------|-------------|
| A | id | UUID for cost type |
| B | name | Cost type name |
| C | is_direct | 1 for direct cost, 0 for indirect |
| D | created_at | Timestamp |

### Snapshots Sheet (Auto-created)
| Column | Header | Description |
|--------|--------|-------------|
| A | month | Month (YYYY-MM) |
| B | report_data | Cached report JSON |
| C | created_at | Timestamp |

## Step 3: Create Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Rename the project to "Warehouse Profit Analytics API"
4. Replace the default code with the contents of `Code.gs`
5. Update the `SPREADSHEET_ID` constant with your actual spreadsheet ID

## Step 4: Deploy as Web App

1. Click "Deploy" → "New deployment"
2. Choose "Web app" as the type
3. Set the following:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click "Deploy"
5. Copy the Web app URL

## Step 5: Configure Frontend

1. Create a `.env` file in your React project root
2. Add the following variables:
   ```
   VITE_GOOGLE_SHEETS_API_URL=your_web_app_url_here
   ```

## Step 6: Test the API

You can test the API endpoints using curl or Postman:

### Get Metadata
```
GET https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?path=meta
```

### Create Transaction
```
POST https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?path=txn
Content-Type: application/json

{
  "date": "2024-01-15",
  "warehouse_id": "warehouse-uuid",
  "cost_type_id": "cost-type-uuid",
  "is_income": true,
  "amount": 1000,
  "currency": "USD"
}
```

### Get Report
```
GET https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?path=report&month=2024-01
```

## Step 7: Add Sample Data

Add some sample data to test the system:

### Sample Warehouses
```
id: warehouse-1
name: Main Warehouse
emoji: 🏢
color: #3B82F6

id: warehouse-2  
name: Secondary Warehouse
emoji: 🏭
color: #10B981
```

### Sample Cost Types
```
id: cost-type-1
name: Rent
is_direct: 1

id: cost-type-2
name: Utilities
is_direct: 1

id: cost-type-3
name: Marketing
is_direct: 0
```

## Troubleshooting

### CORS Issues
If you encounter CORS errors, make sure:
1. The Web app is deployed with "Anyone" access
2. The CORS headers are properly set in the code

### Permission Issues
If you get permission errors:
1. Make sure the script has access to the spreadsheet
2. Check that the spreadsheet ID is correct
3. Ensure the script is executed as the correct user

### API Not Found
If endpoints return 404:
1. Check that the `path` parameter is correctly set
2. Verify the deployment is active
3. Make sure the URL is correct

## Security Considerations

1. **Spreadsheet Access**: Consider restricting spreadsheet access to specific users
2. **API Rate Limiting**: Google Apps Script has rate limits (20 requests per second)
3. **Data Validation**: The script includes basic validation, but consider adding more robust checks
4. **Error Handling**: Monitor the Apps Script logs for errors

## Next Steps

Once the Google Apps Script is set up and working:
1. Update your React app's environment variables
2. Test the API endpoints
3. Proceed with Phase B2: Frontend API Integration 