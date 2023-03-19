const fs = require('fs');
let RiTa = require('rita');

const json = fs.readFileSync("checked.json", 'utf-8');
const existing_words = JSON.parse(json);

// const rows = str.split('\n').map(row => {
//     const [word, sentence] = row.split('-');
//     return { word, sentence };
// });
// let data = JSON.stringify(rows, null, 2);

let new_list = [];

function letterCase() {
    for (let i = 0; i < existing_words.length; i++) {
        let ord = existing_words[i].word.substring(1);
        existing_words[i].word = existing_words[i].word[0].toUpperCase() + ord;

        let entence = existing_words[i].sentence.substring(1);
        existing_words[i].sentence = existing_words[i].sentence[0].toUpperCase() + entence;
        console.log(existing_words[i].sentence);
        new_list.push({
            "word": existing_words[i].word,
            "sentence": existing_words[i].sentence
        })
    }
}
sortAlphabet();

function sortAlphabet() {
    new_list = existing_words.sort((a, b) => a.word.localeCompare(b.word));
    console.log(existing_words);
}

let data = JSON.stringify(new_list, null, 2);

fs.writeFileSync("checked.json", data, (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Data written to file');
});