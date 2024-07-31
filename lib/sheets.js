import { google } from 'googleapis';
import { clouddebugger } from 'googleapis/build/src/apis/clouddebugger';

const sheets = google.sheets('v4');

// Ensure that GOOGLE_SHEETS_PRIVATE_KEY is defined
const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

if (privateKey) {
  const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');
  // Use formattedPrivateKey as needed
} else {
  console.error('GOOGLE_SHEETS_PRIVATE_KEY is not defined.');
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    // private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
    private_key: formattedPrivateKey,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export async function getSheetData(sheetName) {
    // Determine the range based on the sheetName
    let rangeToUse;
    if (sheetName === 'budget') {
      rangeToUse = 'A2:D'; // Range for 'budget'
    } else if (sheetName === 'budget-category') {
      rangeToUse = 'A2:B'; // Range for 'budget-category'
    } else {
      rangeToUse = 'A2:A'; // Default range if sheetName doesn't match
    }
  const client = await auth.getClient();
  console.log(process.env.SPREADSHEET_ID)
  const response = await sheets.spreadsheets.values.get({
    auth: client,
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: `${sheetName}!${rangeToUse}`
  });
  return response.data.values;
}

export async function appendRow(sheetName, values) {
  const client = await auth.getClient();

  // Fetch the existing data to find the last row in the specified sheet
  const response = await sheets.spreadsheets.values.get({
    auth: client,
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: `${sheetName}!A:A`, // Get all rows in column A to find the last row in the specified sheet
  });

  const rows = response.data.values || [];
  const lastRow = rows.length + 1; // Last row is the number of rows plus one

  const result = await sheets.spreadsheets.values.append({
    auth: client,
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: `${sheetName}!A${lastRow}:F${lastRow}`, // Append to the next available row in the specified sheet
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [values],
    },
  });
  return result.data;
}


export async function updateRow(range, values) {
  const client = await auth.getClient();
  const response = await sheets.spreadsheets.values.update({
    auth: client,
    spreadsheetId: process.env.SPREADSHEET_ID,
    range,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [values],
    },
  });
  return response.data;
}

export async function deleteRow(range) {
  const client = await auth.getClient();
  const response = await sheets.spreadsheets.values.clear({
    auth: client,
    spreadsheetId: process.env.SPREADSHEET_ID,
    range,
  });
  return response.data;
}
