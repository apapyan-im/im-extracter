const parseRatingsFactorMatrix = ratingsFactor => {
    return ratingsFactor.map(rating => ({
            ratingValue: parseInt(rating[0].substring(0, 1)),
            ratingComment: rating[0]
                .substring(
                    Math.max(rating[0].indexOf("–") + 2, rating[0].indexOf("-") + 1)
                ).trim()
        })
    )
        .sort((prev, next) => prev.ratingValue - next.ratingValue)
        .map(e => e.ratingComment.replace("mths", "months"))
};

const parseSkillsHeaderMatrix = skills => {
    const [categories, subCategories, skillTitles] = skills;
    let currentCategory = null;
    let currentSubCategory = null;
    let currentSkill = null;
    const parsed = [];
    for(let i = 0; i < skillTitles.length; ++i){
        if (categories[i]){
            currentCategory = categories[i];
            currentSubCategory = subCategories[i] ? subCategories[i] : null;
        }
        if (subCategories[i] && currentSubCategory !== subCategories[i]){
            currentSubCategory = subCategories[i]
        }
        currentSkill = skillTitles[i];
        let skillObject = {
            title: currentSkill,
            category: [currentCategory],
            relatedCategories: []
        };
        if(currentSubCategory){
            skillObject.relatedCategories.push(currentSubCategory)
        }
        parsed.push(skillObject)
    }
    return parsed;
};

const parseEmployeesSkillsMatrix = (employees, skillsHeaderMatrix, ratingsFactorMatrix) => {
    return employees.map(employee => {
            const [name, branch, lastUpdatedDate, ...ratings] = employee;
            const skills = ratings.map((rating, index) => ({
                rating: parseInt(rating),
                ratingComment: ratingsFactorMatrix[parseInt(rating)],
                ...skillsHeaderMatrix[index]
            })).filter(e => e.rating > 0);
        return {
                name,
                branch,
                lastUpdatedDate,
                skills
            };
    });
};

const parseEvaluationMatrix = matrix => matrix.map(row => {
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

module.exports = {
    parseRatingsFactorMatrix,
    parseSkillsHeaderMatrix,
    parseEmployeesSkillsMatrix,
    parseEvaluationMatrix
};