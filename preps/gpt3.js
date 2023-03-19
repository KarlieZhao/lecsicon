const fs = require('fs');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();
let RiTa = require('rita');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let wordList = [];
run();
// compare();

function compare() {
    const olddata = fs.readFileSync("correct.json", 'utf-8');
    const json = JSON.parse(olddata);
    const correctWords = json.map(item => item.word);
    const incorrect_words = wordList.filter(item => !correctWords.includes(item));
    console.log(incorrect_words);
}

function run() {
    for (let i = 0; i < wordList.length; i++) {
        let template =
            `I will give you a word. Make a sentence with a series of words whose first letters compose my word. Your sentence doesn't have to have a strong semantic connection with the word I give you. 
Here're some good examples: Cake - Creating amazing kitchen experiences; Fire - Fierce inferno razed everything;
Here's a bad example: word: abandon; sentence: Alice abandoned her plans to move to the city when she realized the cost of living was too high.
Now make a sentence for '$1'. According to our rules, there should be $2 words in the sentence. Your response should only contain the sentence you make. `

        let add = `The $1 word should shold start with '$2'`;
        let prompt = template.replace("$1", wordList[i]);
        prompt = prompt.replace("$2", wordList[i].length);
        sendRequest(prompt, i, handleResponse);
    }
}
let count_correct = 0;

function handleResponse(word_index, data) {
    let correct = checkRules(wordList[word_index], data.content);

    let output = {
        word: wordList[word_index],
        sentence: data.content
    }
    if (correct) {
        writeToJson(output, "correct.json");
        count_correct++;
    } else {
        writeToJson(output, "incorrect.json");
    }

    console.log("correct: " + count_correct);
}

function checkRules(word, sentence) {
    let words = RiTa.tokenize(sentence.toLowerCase());
    let index = 0;
    for (let i = 0; i < word.length; i++) {
        if (RiTa.isPunct(words[i])) {
            //if punct in the sentence, ignore, jump to next token
            index++;
        } else {
            if (word[i] != words[index][0]) {
                console.log(word + ": " + words[index]);
                return false;
            }
        }
        index++;
    }
    return true;
}

async function sendRequest(prompt, word_index, callback) {
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{
            role: "user",
            content: prompt
        }],
    });
    // console.log(completion.data.choices[0].message);
    let output = completion.data.choices[0].message;
    callback(word_index, output);
}

function writeToJson(data, fileName) {
    const olddata = fs.readFileSync(fileName, 'utf-8');
    const json = JSON.parse(olddata);
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