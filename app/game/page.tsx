'use client';

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Game() {
    const router = useRouter();

    const [timer, setTimer] = useState(60);
    const [currentWord, setCurrentWord] = useState("Loading...");
    const [gameOver, setGameOver] = useState(false);

    const [seenWords, setSeenWords] = useState<Record<string, boolean>>({});
    const seenWordsRef = useRef<Record<string, boolean>>({});

    // Will fetch words from the database
    // const [words, setWords] = useState([]);
    const countries = [
        "United States",
        "India",
        "China",
        "Russia",
        "Algeria",
        "Australia",
        "Brazil",
        "Canada",
        "Denmark",
        "Egypt",
        "France",
        "Germany",
        "Iceland",
        "Japan",
        "Mexico"
    ];

    const festivals = [
        "Holi",
        "Diwali",
        "Sankranti",
        "Dussehra",
        "Saree Function",
        "Haldi Function",
        "Ganesh Chaturthi",
        "Muharram",
        "Bakri Eid",
        "Christmas",
        "Easter"
    ]

    const cartoons = [
        "Tom & Jerry",
        "Doraemon",
        "Pokemon",
        "Ninja Hattori",
        "Oswald",
        "Scooby Doo",
        "Power Rangers",
        "Ben 10",
        "Oggy and the Cockroaches",
        "Jungle Book",
        "Tarzan"
    ]

    

    const words = festivals

    useEffect(() => {
        nextWord();
    }, []);

    // Timer Functionality
    useEffect(() => {
        const timeOut = setTimeout(() => {
            if (timer > 0) {
                setTimer(timer - 1);
            }
        }, 1000);
        if (timer === 0) {
            setGameOver(true);
        }
        return () => clearTimeout(timeOut);
    }, [timer]);

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    const nextWord = () => {
        const wordIndex = Math.floor(Math.random() * words.length);
        if (words[wordIndex] in seenWords) {
            nextWord();
        } else {
            setCurrentWord(words[wordIndex]);
        }
    }

    const onCorrectWord = () => {
        setSeenWords((prevSeenWords) => {
            const updatedSeenWords = { ...prevSeenWords, [currentWord]: true };
            seenWordsRef.current = updatedSeenWords;
            return updatedSeenWords;
        });
        nextWord();
    }

    const onSkipWord = () => {
        setSeenWords((prevSeenWords) => {
            const updatedSeenWords = { ...prevSeenWords, [currentWord]: false };
            seenWordsRef.current = updatedSeenWords;
            return updatedSeenWords;
        });
        nextWord();
    }

    // Choosing next word with keyboard
    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        if (e.key === "Enter") {
            onCorrectWord();
        }
        if (e.key === "Backspace") {
            onSkipWord();
        }
    }, [onCorrectWord, onSkipWord]);

    useEffect(() => {
        document.addEventListener("keyup", handleKeyUp);
        return () => {
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, [handleKeyUp]);

    return (
        <main className="p-12">

            <h1 className="text-4xl my-10 font-mono text-center">Ishaare</h1>

            {
                !gameOver ? (
                    <div className="flex flex-col w-[80%] h-[50vh] p-8 mx-auto justify-between items-center rounded-xl bg-secondary-bg relative">
                        {/* Right or Wrong */}
                        <div className="flex w-full h-full rounded-xl absolute">
                            <div
                                className="flex flex-col w-1/2 h-full justify-center items-center rounded-xl hover:cursor-pointer hover:opacity-50"
                                onClick={onSkipWord}
                            >
                                <h1 className="text-3xl font-bold">Skip</h1>
                                <p className="flex text-lg items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z" /></svg>
                                    Backspace
                                </p>
                            </div>
                            <div
                                className="flex flex-col w-1/2 h-full justify-center items-center rounded-xl hover:cursor-pointer hover:opacity-50"
                                onClick={onCorrectWord}
                            >
                                <h1 className="text-3xl font-bold">Next</h1>
                                <p className="flex text-lg items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" /></svg>

                                    Enter
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col w-full h-full justify-between items-center">
                            <h1 className="text-6xl font-bold">{currentWord}</h1>
                            <p className="px-2 py-1 mt-10 rounded-full bg-primary-bg">{formatTime(timer)}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col w-[80%] p-8 mx-auto justify-center items-center rounded-xl bg-secondary-bg relative">
                        <h1 className="text-3xl font-bold mb-10">Game Over</h1>
                        {
                            Object.keys(seenWords).map((word) => {
                                return (
                                    <div key={word} className={`${seenWords[word] ? '' : ''}`}>
                                        <p className={`${seenWords[word] ? 'font-bold text-lg' : 'text-red-800'}`}>{word}</p>
                                    </div>
                                )
                            })
                        }
                        <button className="w-[300px] bg-white text-primary-bg p-2 mt-4 rounded-md"
                            onClick={() => window.location.reload()}>
                            Play Again
                        </button>

                        <button className="w-[300px] bg-primary-bg text-white p-2 mt-4 rounded-md"
                        onClick={() => {
                            router.push('/lobby')
                            // router.back();
                        }}>
                            Choose Another Deck
                        </button>
                    </div>
                )
            }

        </main>
    );
}

