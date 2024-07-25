import { google } from 'googleapis';
import { clouddebugger } from 'googleapis/build/src/apis/clouddebugger';

const sheets = google.sheets('v4');

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export async function getSheetData(range) {
  const client = await auth.getClient();
  console.log(process.env.SPREADSHEET_ID)
  const response = await sheets.spreadsheets.values.get({
    auth: client,
    spreadsheetId: process.env.SPREADSHEET_ID,
    range,
  });
  return response.data.values;
}

// export async function appendRow(range, values) {
//   const client = await auth.getClient();
//   const response = await sheets.spreadsheets.values.append({
//     auth: client,
//     spreadsheetId: process.env.SPREADSHEET_ID,
//     range: 'Sheet1!A:C', // Specify the range where you want to append the data
//     valueInputOption: 'RAW',
//     resource: {
//       values: [values],
//     },
//   });
//   return response.data;
// }


export async function appendRow(values) {
  const client = await auth.getClient();


  const response = await sheets.spreadsheets.values.get({
    auth: client,
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: 'Sheet1!A:A'
  });

  const rows = response.data.values || [];
  const lastRow = rows.length + 1; // Last row is the number of rows plus one

  const result = await sheets.spreadsheets.values.append({
    auth: client,
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: `Sheet1!A${lastRow}:C${lastRow}`, // Append to the next available row
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
