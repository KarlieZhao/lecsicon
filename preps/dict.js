const fs = require('fs');
const csv = require('csv-parser');

const results = [];

fs.createReadStream('words.csv')
  .pipe(csv())
  .on('data', (data) => {
    results.push(data['Word']);
  })
  .on('end', () => {
    // console.log(results); // array of column values
    let words = JSON.stringify(results);
    // console.log(JSON.stringify(results)); // JSON representation of array
    fs.writeFile("word.json", words, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Data written to file');
    });
});