import { RiTa } from "rita";

export function meetRules(word: string, tokens: string[]): boolean {
    if (!word || !tokens.length) {
        return false;
    }
    // filter punctuations
    const filteredTokens = tokens.filter(token => !RiTa.isPunct(token));
    // Check if the lengths match after filtering
    if (filteredTokens.length !== word.length) {
        return false;
    }
    // compare each character of the word with the first character of each token
    return word.split('').every((char, index) =>
        char === filteredTokens[index][0]
    );
}