const fs = require('fs');
let RiTa = require('rita');

loadJson(handleResponse);

async function loadJson(callback) {
    try {
        const olddata = fs.readFileSync("poetry.json", 'utf-8');
        const json = JSON.parse(olddata);
        callback(json);
    } catch (error) {
        console.error(error);
    }
}

function handleResponse(data) {
    let sentences = data;
    let obj_arr = [];
    for (let i in sentences) {
        let words = RiTa.tokenize(sentences[i]);
        const firstLetters = words.map(str => {
            if (!RiTa.isPunct(str)) {
                return str.charAt(0);
            }
        });
        const keyword = firstLetters.join("");
        console.log(keyword);
        let obj = {};
        obj.word = keyword;
        obj.sentence = sentences[i];
        obj_arr.push(obj);
    }

    writeToJson(obj_arr,"poem_1.json")
}

function writeToJson(data, fileName) {
    try {
        // Check if the file exists
        fs.accessSync(fileName);
    } catch (error) {
        // Create the file with an empty object
        fs.writeFileSync(fileName, JSON.stringify([]));
    }

    //preserve old data in json
    const olddata = fs.readFileSync(fileName, 'utf-8');
    let json = JSON.parse(olddata);
    json.push(data);
    const newData = JSON.stringify(json, null, 2);
    fs.writeFileSync(fileName, newData, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Data written to file');
    });
}