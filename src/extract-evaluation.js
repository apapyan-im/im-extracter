const {google} = require('googleapis');

const EMPLOYEES_DIRECTORY_PATH = 'employees';
const EVALUATION_TAB_TITLE = "Evaluation";

const average = list => list.reduce((r, c) => r + c, 0) / list.length;

const saveData = (path, data) => {
    const fs = require('fs');
    if(!fs.existsSync(EMPLOYEES_DIRECTORY_PATH)){
        fs.mkdirSync(EMPLOYEES_DIRECTORY_PATH)
    }
    fs.writeFile(path, JSON.stringify(data, null, 4), (err) => {
        if (err) return console.error(err);
        console.log('Data saved to', path);
      });
};

const authorize = credentials => {
    const token = require('../auth/token.json');
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
};

const getSheetData = (sheetId, tabTitle = "", range = '!A1:Z500') => {
    const credentials = require('../auth/credentials.json');
    const sheets = google.sheets({version: 'v4', auth: authorize(credentials)});
    return sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `'${tabTitle}'${range}`,
    }).then(res => {
        return res.data.values;
    });
};

const NAME_COLUMN_RANGE = "!B1";
const REQUIREMENTS_SECTION_RANGE = "!A5:Z18";
const KNOWLEDGE_SECTION_RANGE = "!A20:Z24";
const COMPUTER_SCIENCE_SECTION_RANGE = "!A28:Z31";

const constructSectionObject = matrix => matrix.map(row => {
    const [title, b,c,d,e,f,g, ...evaluationResults] = row;
    const values = [b,c,d,e,f,g];
    const lastEvaluationResult = parseInt(evaluationResults[evaluationResults.length - 1]);
    return {
        title,
        evaluationResults,
        lastEvaluationResult,
        comment: values[lastEvaluationResult]
    };
});

const fetchEmployeeData = async (sheetId) => {
    const [[name]] = await getSheetData(sheetId, EVALUATION_TAB_TITLE, NAME_COLUMN_RANGE );
    const requirementsSection = constructSectionObject(await getSheetData(sheetId, EVALUATION_TAB_TITLE, REQUIREMENTS_SECTION_RANGE));
    const knowledgeSection = constructSectionObject(await getSheetData(sheetId, EVALUATION_TAB_TITLE, KNOWLEDGE_SECTION_RANGE));
    const computerScienceSection = constructSectionObject(await getSheetData(sheetId, EVALUATION_TAB_TITLE, COMPUTER_SCIENCE_SECTION_RANGE));
    return {
        name,
        rating: average([
            ...requirementsSection.map(e => e.lastEvaluationResult),
            ...knowledgeSection.map(e => e.lastEvaluationResult),
            ...computerScienceSection.map(e => e.lastEvaluationResult)
        ]),
        requirements: requirementsSection,
        knowledge: knowledgeSection,
        computerScience: computerScienceSection
    };
};

if (process.argv.length > 2){
    const [,,id, path] = process.argv;
    let savingPath = require("path").resolve(path || EMPLOYEES_DIRECTORY_PATH) + "/";
    fetchEmployeeData(id)
        .then(employeeDataObject => {
            saveData(`${savingPath}${employeeDataObject.name}.json`, employeeDataObject);
        });
} else {
    const filename = require('path').basename(__filename);
    console.log(`
        Missed argument sheet_id
        Usage:
            node ${filename} {google_sheet_id | required} {path | optional}
    `);
}