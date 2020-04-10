const {
    parseEmployeesSkillsMatrix,
    parseRatingsFactorMatrix ,
    parseSkillsHeaderMatrix
} = require("./support/parsers");

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

module.exports = {
    getSkillsFor : async (employeeName, employeeLastName, branchName) => {
        return await constructEmployeesObject().then(employees => employees.find(e => e.name === `${employeeName} ${employeeLastName}` && e.branch === branchName))
    }
}