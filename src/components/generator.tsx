
import { RiTa } from "rita";
import { useState, ChangeEvent, useEffect } from "react";
import OpenAI from "openai";
import { meetRules } from "./processResponse";

interface TokenizedWordData {
    word: string;
    sentence: string[];
}

const openai = new OpenAI({
    organization: "org-86OHGzDu1zrgxhBRHX4yOeId",
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || "",
    // for development
    // dangerouslyAllowBrowser: true
});

export default function GeneratorSection() {
    const genPrompt = `I will give you a word. Write a sentence in which the first letter of each word sequentially spells out my word, like an acrostic sentence.
Your sentence should not contain my word or any of the variations of my word. 
Your response should only contain the sentence you make.
Your sentence should have a semantic connection with my word.`

    const [inputValue, setInputValue] = useState<string>(""); // State to store the input value
    const [DisplayedWords, setDisplayedWords] = useState<TokenizedWordData[]>([]);
    const [userPrompt, setUserPrompt] = useState<string>("");
    const [sendRequstFlag, setSendRequstFlag] = useState(false);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const isWord = (input: string): boolean => {
        const wordRegex = /^[a-zA-Z]+$/; // Only alphabetic characters
        return wordRegex.test(input);
    };

    const handleClick = (word: string) => {
        // console.log('Clicked word:', word);
        setInputValue(word);
        setSendRequstFlag(true);
    };

    useEffect(() => {
        if (sendRequstFlag) sendRequest();
    }, [sendRequstFlag])

    const sendRequest = async () => {
        setUserPrompt("");
        if (inputValue.trim() && isWord(inputValue.trim())) {
            try {
                const response = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "developer", content: genPrompt },
                        {
                            role: "user",
                            content: `Make an acrostic sentence for "${inputValue}".`,
                        },
                    ],
                    store: false,
                });

                const data = response.choices?.[0]?.message?.content;
                if (data) {
                    const capWord = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                    const words = RiTa.tokenize(data);
                    const newEntry = { word: capWord, sentence: words };
                    setDisplayedWords((prevWords) => [...prevWords, newEntry]);

                } else {
                    setUserPrompt("Some error has occurred. Please try again.");
                }
            } catch (error) {
                console.error(error);
                setUserPrompt("An error occurred while generating the acrostic sentence. Please try again.");
            }
        } else {
            setUserPrompt('"' + inputValue + '"' + " is not a word. Please type a word with no number, space, or punctuation.");
        }
        setSendRequstFlag(false);
    }

    const renderTokens = (entry: TokenizedWordData, token: string, index: number) => {
        const isValid = meetRules(entry.word, entry.sentence);

        return (
            <span key={index} className={`${isValid ? null : "text-gray"}`}>
                {RiTa.isPunct(token) ? (
                    <>{token}&nbsp;&nbsp;</>
                ) : (
                    <> <a onClick={(e) => {
                        e.preventDefault();
                        handleClick(token);
                    }}>{token}</a>
                        {index < entry.sentence.length - 1 && <>&nbsp;&nbsp;</>}
                    </>
                )}
            </span>
        )
    }

    return (<div className="gen-bookmark">
        <div>
            <section className="sticky-section">
                <div>
                    <h3>Acrostics Playground <span className="small">Running on GPT o1-mini.</span></h3>
                    <small> Type or click on a word in the section below to generate. </small>
                </div>
                <input name="myInput" className="word-input"
                    value={inputValue} onChange={handleInputChange} />
                <button
                    onClick={() => { setSendRequstFlag(true) }}
                    disabled={sendRequstFlag}>
                    {sendRequstFlag ? "Generating..." : "Look Up!"}</button>
                <button className="clear-button"
                    onClick={() => { setDisplayedWords([]) }}>Clear</button>
                <div className="gen-userPrompt">{userPrompt}</div>
            </section>
            <section className="generator">
                {DisplayedWords && DisplayedWords.map((entry, index) => {
                    return (
                        <p key={index}
                            //check rules, if meet rules: render text blue; else render it gray.
                            style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                            <span className="text-red">{entry.word}</span>:<>&nbsp;&nbsp;</>
                            {entry.sentence?.map((token, index) => renderTokens(entry, token, index))}</p>)
                })}
            </section>
        </div>
    </div>)
}