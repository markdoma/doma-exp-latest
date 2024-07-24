import { getSheetData, appendRow, updateRow, deleteRow } from '../../../../lib/sheets';

export async function POST(req) {
  try {
    const { operation, range, values } = await req.json();

    console.log(`Operation: ${operation}, Range: ${range}, Values: ${values}`);

    let result;
    switch (operation) {
      case 'read':
        result = await getSheetData(range);
        break;
      case 'create':
        result = await appendRow(values);
        break;
      case 'update':
        result = await updateRow(range, values);
        break;
      case 'delete':
        result = await deleteRow(range);
        break;
      default:
        return new Response(JSON.stringify({ error: 'Invalid operation' }), { status: 400 });
    }
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
