const average = list => list.reduce((r, c) => r + c, 0) / list.length;

const writeData2File = (path, filename, data) => {
    const fs = require('fs');
    if(!fs.existsSync(path)){
        fs.mkdirSync(path)
    }
    fs.writeFile(path+"/"+filename, JSON.stringify(data, null, 2), (err) => {
        if (err) return console.error(err);
        console.log('Data saved to', path+"/"+filename);
    });
};

module.exports = {
    average,
    writeData2File
};