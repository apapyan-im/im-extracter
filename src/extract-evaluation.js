const {parseEvaluationMatrix} = require("./support/parsers");
const {writeData2File} = require("./support/common");
const {getSheetData} = require("./support/google-sheet-reader");


const EMPLOYEES_DIRECTORY_PATH = 'employees';
const EVALUATION_TAB_TITLE = "Evaluation";

const NAME_COLUMN_RANGE = "!B1";
const REQUIREMENTS_SECTION_RANGE = "!A5:Z18";
const KNOWLEDGE_SECTION_RANGE = "!A20:Z24";
const COMPUTER_SCIENCE_SECTION_RANGE = "!A28:Z31";

const fetchEmployeeData = async (sheetId) => {
    const [[name]] = await getSheetData(sheetId, EVALUATION_TAB_TITLE, NAME_COLUMN_RANGE );
    const requirementsSection = parseEvaluationMatrix(await getSheetData(sheetId, EVALUATION_TAB_TITLE, REQUIREMENTS_SECTION_RANGE));
    const knowledgeSection = parseEvaluationMatrix(await getSheetData(sheetId, EVALUATION_TAB_TITLE, KNOWLEDGE_SECTION_RANGE));
    const computerScienceSection = parseEvaluationMatrix(await getSheetData(sheetId, EVALUATION_TAB_TITLE, COMPUTER_SCIENCE_SECTION_RANGE));
    const {average} = require('./support/common');
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
            writeData2File(`${savingPath}${employeeDataObject.name}.json`, employeeDataObject);
        });
} else {
    const filename = require('path').basename(__filename);
    console.log(`
        Missed argument sheet_id
        Usage:
            node ${filename} {google_sheet_id | required} {path | optional}
    `);
}