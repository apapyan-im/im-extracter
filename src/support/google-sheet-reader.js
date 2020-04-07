const {google} = require('googleapis');

const authorize = credentials => {
    const token = require('../../auth/token.json');
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
};

const getSheetData = (sheetId, tabTitle = "", range = '!A1:Z500') => {
    const credentials = require('../../auth/credentials.json');
    const sheets = google.sheets({version: 'v4', auth: authorize(credentials)});
    return sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `'${tabTitle}'${range}`,
    }).then(res => {
        return res.data.values;
    });
};

module.exports = {
    getSheetData
};