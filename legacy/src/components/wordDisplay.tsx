import React, { useState, useEffect, useRef } from 'react';

interface TypewriterEntryProps {
    word: string;
    sentence: string;
    onComplete: () => void;
}

interface WordData {
    word: string;
    sentence: string;
}

interface WordDisplayProps {
    maxHeight: number;
}

// Component for individual typewriter entries
const TypewriterEntry: React.FC<TypewriterEntryProps> = ({ word, sentence, onComplete }) => {
    const [displayText, setDisplayText] = useState('');
    const fullText = `${word}: ${sentence}`;
    const charIndex = useRef(0);
    const typewriterSpeed = 70; // Milliseconds per character

    useEffect(() => {
        const typeNextChar = () => {
            if (charIndex.current < fullText.length) {
                setDisplayText(fullText.slice(0, charIndex.current + 1));
                charIndex.current += 1;
            } else {
                onComplete();
            }
        };

        const typingInterval = setInterval(typeNextChar, typewriterSpeed);

        return () => clearInterval(typingInterval);
    }, [fullText, onComplete]);


    const renderColoredText = (text: string): React.ReactNode => {
        // Split text into parts (before and after colon)
        const parts: string[] = text.split(':');
        if (parts.length === 1) {
            // No colon in text, just color first letters of words
            const words: string[] = text.split(' ');
            return words.map((word, index) => (
                <span key={index}>
                    {index > 0 && ' '}
                    {word && (
                        <>
                            <span className="text-red">{word[0]}</span>
                            <span>{word.slice(1)}</span>
                        </>
                    )}
                </span>
            ));
        } else {
            // Text contains colon
            return (
                <>
                    <span className="text-red">{parts[0]}</span>:<br />
                    {parts[1] && (
                        <>
                            {/* Process text after colon for first letters */}
                            {parts[1].split(' ').map((word, index) => (
                                <span key={index}>
                                    {index === 0 && ' '}
                                    {word && (
                                        <>
                                            <span className="text-red">{word[0]}</span>
                                            <span>{word.slice(1)}</span>
                                            {index < parts[1].split(' ').length - 1 && ' '}
                                        </>
                                    )}
                                </span>
                            ))}
                        </>
                    )}
                </>
            );
        }
    };

    return <p>{renderColoredText(displayText)}</p>;
};

const WordDisplay: React.FC<WordDisplayProps> = ({ maxHeight = 900 }) => {
    const [displayedWords, setDisplayedWords] = useState<WordData[]>([]);
    const wordData = useRef<WordData[]>([]);
    const displayRef = useRef<HTMLDivElement>(null);

    const isTypingRef = useRef(false);
    const shouldAddNewEntryRef = useRef(false);
    const cleanupTimeoutRef = useRef<NodeJS.Timeout>();
    const typewriterTimeoutRef = useRef<NodeJS.Timeout>();

    const newEntryDelay: number = 1200;

    useEffect(() => {
        return () => {
            if (cleanupTimeoutRef.current) clearTimeout(cleanupTimeoutRef.current);
            if (typewriterTimeoutRef.current) clearTimeout(typewriterTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        const loadJSON = async () => {
            try {
                const response = await fetch('words.json');
                if (response.ok) {
                    const data: WordData[] = await response.json();
                    wordData.current = data;
                    addEntry();
                } else {
                    console.error('Failed to load JSON');
                }
            } catch (error) {
                console.error('Error loading JSON:', error);
            }
        };
        loadJSON();
    }, []);

    // on maxHeight change 
    useEffect(() => {
        if (displayRef.current && maxHeight) {
            const currentHeight = displayRef.current.getBoundingClientRect().height;
            if (currentHeight * 2 + 24 >= maxHeight) {
                cleanupTimeoutRef.current = setTimeout(() => {
                    shouldAddNewEntryRef.current = true;
                    isTypingRef.current = false;
                    setDisplayedWords([]);
                }, newEntryDelay);
            }
        }
    }, [maxHeight]);

    //  handle adding new entry after displayedWords cleared
    useEffect(() => {
        if (displayedWords.length === 0 && shouldAddNewEntryRef.current) {
            shouldAddNewEntryRef.current = false;
            isTypingRef.current = false;
            addEntry();
        }
    }, [displayedWords]);

    const findSentenceByWord = (word: string) => {
        const found = wordData.current.find((item) => item.word.toLowerCase() === word.toLowerCase());
        return found ? found.sentence : '';
    };

    const addEntry = () => {
        if (!wordData.current.length || isTypingRef.current) return;
        const currentHeight = displayRef.current?.getBoundingClientRect().height || 0;
        // console.log(currentHeight * 2 + 24 + " " + maxHeight)

        if (currentHeight * 2 + 24 >= maxHeight) {
            cleanupTimeoutRef.current = setTimeout(() => {
                shouldAddNewEntryRef.current = true;
                isTypingRef.current = false;
                setDisplayedWords([]);
            }, newEntryDelay);
            return;
        }

        isTypingRef.current = true;
        const randomWord = wordData.current[Math.floor(Math.random() * wordData.current.length)].word;
        const capWord = randomWord.slice(0, 1).toUpperCase() + randomWord.slice(1);
        const newWordData = { word: capWord, sentence: findSentenceByWord(randomWord) };
        setDisplayedWords((prevWords) => [...prevWords, newWordData]);
    };

    const handleTypewriterComplete = () => {
        isTypingRef.current = false;
        typewriterTimeoutRef.current = setTimeout(() => {
            addEntry();
        }, newEntryDelay);
    };

    return (
        <div>
            <div id="display" ref={displayRef} style={{ position: 'relative', height: 'fit-content' }}>
                {displayedWords.map((entry, index) => {
                    return (
                        <TypewriterEntry
                            key={index}
                            word={entry.word}
                            sentence={entry.sentence}
                            onComplete={index === displayedWords.length - 1 ? handleTypewriterComplete : () => { }}
                        />
                    )
                })}
            </div>
        </div>
    );
};

export default WordDisplay;
