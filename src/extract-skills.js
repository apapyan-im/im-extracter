const {parseEmployeesSkillsMatrix} = require("./support/parsers");
const {parseRatingsFactorMatrix} = require("./support/parsers");
const {parseSkillsHeaderMatrix} = require("./support/parsers");

const {writeData2File} = require("./support/common");

const {getSheetData} = require("./support/google-sheet-reader");

const SKILLS_DB_V3_SHEET_ID = "128DC7ZmNv8gOe7bp8VzNySicC8RINKBAB-3ManPnmxg";
const SKILLS_MATRIX_TAB_TITLE = "SkillsMatrix";
const RATINGS_RANGE = '!A3:A7';
const SKILLS_RANGE = '!D6:FD8';
const EMPLOYEES_RANGE = '!A9:FD175';

const constructEmployeesObject = async () => {
    let employees = await getSheetData(SKILLS_DB_V3_SHEET_ID, SKILLS_MATRIX_TAB_TITLE, EMPLOYEES_RANGE);
    let skillsHeaderMatrix = parseSkillsHeaderMatrix(await getSheetData(SKILLS_DB_V3_SHEET_ID, SKILLS_MATRIX_TAB_TITLE, SKILLS_RANGE));
    let ratingsFactorMatrix = parseRatingsFactorMatrix(await getSheetData(SKILLS_DB_V3_SHEET_ID, SKILLS_MATRIX_TAB_TITLE, RATINGS_RANGE));
    return parseEmployeesSkillsMatrix(
        employees,
        skillsHeaderMatrix,
        ratingsFactorMatrix
    );
};


constructEmployeesObject()
    .then(e => writeData2File(".", "employees.json", e));