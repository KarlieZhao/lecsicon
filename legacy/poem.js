
let clickables = [];
let word_data = [];
let word_arr = [];
let display_list = [];
let textsize = 16;
const display = document.querySelector("#display_poem");
const ctx = display.getContext("2d");
const scaleFactor = window.devicePixelRatio;

display.addEventListener('click', mouseClicked);
// window.addEventListener('resize', resizeCanvas);


function setup() {
    display.width = window.innerWidth * 2 * scaleFactor;
    display.height = window.innerHeight * scaleFactor;
    display.style.width = window.innerWidth * 2 + 'px';
    display.style.height = window.innerHeight + 'px';
    ctx.scale(scaleFactor, scaleFactor);
    ctx.textBaseline = 'top';

    loadJson(init);
}
async function loadJson(callback) {
    try {
        const response = await fetch('./data/poem_1.json');
        const data = await response.json();
        word_data = data;
        callback(data);
    } catch (error) {
        console.error(error);
    }
}

function horizontalDisplay(i, keyword, startx, starty, addClickables, animate) {
    let sentence = findSentenceByWord(word_data, keyword);
    let words = RiTa.tokenize(sentence);
    console.log(sentence);
    let block_h = words[i].length * textsize * 1.1;
    let ypos = starty;
    if (addClickables && word_arr.includes(words[i].toLowerCase())) {
        ctx.fillStyle = `rgb(130, 0, 0)`;
        let obj = {};
        obj.word = words[i];
        obj.xpos = startx;
        obj.startYPos = ypos;
        obj.height = block_h;
        clickables.push(obj);
    } else {
        ctx.fillStyle = `rgb(0, 0, 0)`;
    }

    if (animate) {
        if (RiTa.isPunct(words[i + 1])) {
            words[i] = words[i] + words[i + 1] + "";
        }
        renderHorizontalText(words[i], startx, ypos, 0);
        if (RiTa.isPunct(words[i + 1])) i++;
        if (i < words.length - 1) {
            setTimeout(() => {
                i++;
                starty += 30;
                horizontalDisplay(i, keyword, startx, starty, addClickables, animate)
            }, delay * 15);
        }
    } else {
        for (let j = 0; j < words.length; j++) {
            if (RiTa.isPunct(words[j + 1])) words[j] = words[j] + words[j + 1] + "";
            renderStaticText(words[j], startx, ypos);
            ypos += 30;
            if (RiTa.isPunct(words[j + 1])) j++;
        }
    }
}

function findSentenceByWord(word_data, word) {
    for (let i in word_data) {
        if (word_data[i].word.toLowerCase() === word.toLowerCase()) {
            return word_data[i].sentence;
        }
    }
    return undefined;
}

function init(data) {
    for (let i in data) {
        word_arr.push(data[i].word.toLowerCase());
    }
    ctx.font = textsize + "px Special Elite";

    let x = 40;
    //window.innerWidth / 4;
    let y = window.innerHeight / 5;
    //70;
    display_list.push({ word: "Fractal", xpos: x, ypos: y });
    horizontalDisplay(0, "Fractal", x, y, true, true)

    // verticalDisplay(0, "Fractal", x, y, true, true);
    x = 40;
    //window.innerWidth / 4;
    y = window.innerHeight / 2;
    //70;
    display_list.push({ word: "Poetry", xpos: x, ypos: y });
    setTimeout(() => {
        horizontalDisplay(0, "Poetry", x, y, true, true)
    }, 7000);
    // x = window.innerWidth * 3 / 5;
    // display_list.push({ word: "Poetry", xpos: x, ypos: y });
    // setTimeout(() => {
    //     verticalDisplay(0, "Poetry", x, y, true, true);
    // }, 7000);
}

function drawLines(xpos, ypos, w) {
    let h = 100;
    ctx.beginPath();
    ctx.moveTo(xpos, ypos);
    ctx.lineTo(xpos, ypos + h);
    ctx.stroke();

    ctx.moveTo(xpos - w / 2, ypos + h);
    ctx.lineTo(xpos + w / 2, ypos + h);
    ctx.stroke();
}

function verticalDisplay(i, keyword, startx, starty, addClickables, animate) {
    let sentence = findSentenceByWord(word_data, keyword);
    let words = RiTa.tokenize(sentence);
    let block_h = words[i].length * textsize * 1.1;
    let ypos = starty;
    if (addClickables && word_arr.includes(words[i].toLowerCase())) {
        ctx.fillStyle = `rgb(130, 0, 0)`;
        let obj = {};
        obj.word = words[i];
        obj.xpos = startx;
        obj.startYPos = ypos;
        obj.height = block_h;
        clickables.push(obj);
    } else {
        ctx.fillStyle = `rgb(0, 0, 0)`;
    }


    if (animate) {
        if (RiTa.isPunct(words[i + 1])) {
            words[i] = words[i] + words[i + 1] + "";
        }
        renderText(words[i], startx, ypos, 0);
        if (RiTa.isPunct(words[i + 1])) i++;
        if (i < words.length - 1) {
            setTimeout(() => {
                i++;
                startx += 30;
                verticalDisplay(i, keyword, startx, starty, addClickables, animate)
            }, delay * 15);
        }
    } else {
        for (let j = 0; j < words.length; j++) {
            if (RiTa.isPunct(words[j + 1])) words[j] = words[j] + words[j + 1] + "";
            renderStaticText(words[j], startx, ypos);
            startx += 30;
            if (RiTa.isPunct(words[j + 1])) j++;
        }
    }
}

function update() {
    ctx.clearRect(0, 0, display.width, display.height);
    let addClickables = false;
    let animate = false
    for (let i = 0; i < display_list.length; i++) {
        console.log(display_list[i])
        if (i === display_list.length - 1) {
            addClickables = true;
            animate = true;
        }
        horizontalDisplay(0, display_list[i].word, display_list[i].xpos, display_list[i].ypos, addClickables, animate);
        // verticalDisplay(0, display_list[i].word, display_list[i].xpos, display_list[i].ypos, addClickables, animate);
    }
}

function mouseClicked(event) {
    // console.log(clickables)
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log("x: " + x + "; y: " + y);
    mouseInClickable(x, y);
}

function mouseInClickable(mouseX, mouseY) {
    for (let i in clickables) {
        let element = clickables[i];
        // if (mouseX > element.xpos && mouseX < element.xpos + 20 &&
        //     mouseY > element.startYPos && mouseY < element.startYPos + element.height) {
        //     let newWord = {};
        //     newWord.word = element.word;
        //     newWord.xpos = element.xpos - 130;
        //     newWord.ypos = element.startYPos + element.height + 100;
        //     display_list.push(newWord);
        //     update();
        //     return;
        // }

        //horizontal
        if (mouseX > element.xpos && mouseX < element.xpos + element.height &&
            mouseY > element.startYPos && mouseY < element.startYPos + 20) {
            let newWord = {};
            newWord.word = element.word;
            newWord.xpos = element.xpos + element.height + 100;
            newWord.ypos = element.startYPos - 50;
            display_list.push(newWord);
            update();
            return;
        }
    }
}

function renderTextOpacity(text, rect_x, rect_y, rect_w, rect_h) {
    // Check if all letters have been rendered
    if (opacity === 1 && index >= text.length) {
        return;
    }
    ctx.clearRect(rect_x - 50, rect_y - 50, rect_w, rect_h);
    // ctx.clearRect(0, 0, 0,0, rect_w, rect_h);
    ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
    // console.log(timeStamp+": "+text)
    const partialText = text.slice(0, index);
    ctx.fillText(partialText, rect_x, rect_y);
    // opacity += 0.02;
    timeStamp++;
    if (timeStamp % 4 === 0) {
        index++;
        opacity += 0.04;
    }

    setTimeout(() => {
        requestAnimationFrame(function() {
            renderTextOpacity(text, rect_x, rect_y, rect_w, rect_h);
        });
    }, 1000 / fps);
}

const delay = 70; // milliseconds
function renderHorizontalText(text, x, y, index) {
    // Check if all letters have been rendered
    if (index >= text.length) {
        return;
    }
    const partialText = text.slice(index, index + 1);
    ctx.fillText(partialText, x + index * textsize * 0.8, y);
    index++;

    setTimeout(() => {
        renderHorizontalText(text, x, y, index);
    }, delay);
}

function renderText(text, x, y, index) {
    // Check if all letters have been rendered
    if (index >= text.length) {
        return;
    }
    const partialText = text.slice(index, index + 1);
    ctx.fillText(partialText, x, y + index * textsize * 1.2);
    index++;

    setTimeout(() => {
        renderText(text, x, y, index);
    }, delay);
}

function renderStaticText(text, x, y) {
    // for (let i = 0; i < text.length; i++) {
    //     ctx.fillText(text[i], x, y + i * textsize * 1.2);
    // }

    for (let i = 0; i < text.length; i++) {
        ctx.fillText(text[i], x + i * textsize * 0.8, y);
    }
}