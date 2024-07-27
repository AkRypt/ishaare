'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { getWords, ilog } from "./actions";
import { keyboardHandler, preventReload, swipeHandler } from "./hooks";
import { formatTime } from "./helpers";
import { Loading } from "../components/loading";

function Game() {
    const router = useRouter();
    const deck_id = parseInt(useSearchParams().get('deck_id') ?? '0', 10);


    const [isMobile, setIsMobile] = useState(true);
    const [timer, setTimer] = useState(90);
    const [loading, setLoading] = useState(true);
    const [showSnack, setShowSnack] = useState(true);
    const [currentWord, setCurrentWord] = useState("Loading...");
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [correctSwiped, setCorrectSwiped] = useState(false);
    const [skipSwiped, setSkipSwiped] = useState(false);

    const [seenWords, setSeenWords] = useState<Record<string, boolean>>({});
    const seenWordsRef = useRef<Record<string, boolean>>({});

    // Will fetch words from the database
    const [words, setWords] = useState<any[]>([]);

    // Randomizing the received list of words
    const randomizeWords = (words: any[]) => {
        return words.sort(() => Math.random() - 0.5);
    }

    // Showing Snackbar to suggest screen rotation
    useEffect(() => {
        const snackTimeout = setTimeout(() => {
            setShowSnack(false);
        }, 2000);
        return () => clearTimeout(snackTimeout);
    }, []);

    // Getting words in the deck
    useEffect(() => {
        setIsMobile(/iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        getWords(deck_id).then((deck_words) => {
            // If there are no deck words
            if (deck_words?.length === 0) {
                return router.back();
            }
            setWords(randomizeWords(deck_words ?? []));
            setLoading(false);
        });
    }, []);

    // Loading the first word
    useEffect(() => {
        if (!loading) {
            setCurrentWord(words[currentWordIndex]["word"]);
        }
    }, [loading])

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

    // Displaying next word after action
    const nextWord = () => {
        setCurrentWordIndex((prevIndex) => {
            const newIndex = prevIndex + 1;
            if (newIndex === words.length) {
                setGameOver(true);
                return prevIndex;
            }
            setCurrentWord(words[newIndex]["word"]);
            return newIndex;
        });
    }

    // Handling correct swipe
    const onCorrectWord = () => {
        setCorrectSwiped(true);
        const resetCorrectSwiped = () => {
            setTimeout(() => {
                setCorrectSwiped(false);
            }, 500);
        }
        resetCorrectSwiped();

        setSeenWords((prevSeenWords) => {
            const updatedSeenWords = { ...prevSeenWords, [currentWord]: true };
            seenWordsRef.current = updatedSeenWords;
            return updatedSeenWords;
        });
        nextWord();
    }

    // Handling skip swipe
    const onSkipWord = () => {
        setSkipSwiped(true);
        const resetSkipSwiped = () => {
            setTimeout(() => {
                setSkipSwiped(false);
            }, 500);
        }
        resetSkipSwiped();

        setSeenWords((prevSeenWords) => {
            const updatedSeenWords = { ...prevSeenWords, [currentWord]: false };
            seenWordsRef.current = updatedSeenWords;
            return updatedSeenWords;
        });
        nextWord();
    }

    // Handling keyboard inputs for next word
    keyboardHandler({
        gameOver,
        isMobile,
        correctFunc: onCorrectWord,
        skipFunc: onSkipWord
    })

    // Preventing Reload on Swipe
    preventReload()

    // Handling user swipe input
    swipeHandler({
        gameOver,
        loading,
        correctFunc: onCorrectWord,
        skipFunc: onSkipWord
    })

    return (
        <main>

            {loading ? <Loading /> : null}

            {
                showSnack && (
                    <div className="fixed top-[35%] left-0 right-0 w-[90%] md:w-[80%] h-[40px] mx-auto z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-full">
                        <p className="text-sm">Rotate screen for better experience</p>
                    </div>
                )
            }

            {
                !gameOver ? (
                    <div className="flex flex-col w-full h-[100vh] md:p-8 md:mx-auto overflow-hidden rounded-xl bg-secondary-bg relative">

                        {/* Right or Wrong */}
                        <div className="flex flex-col md:flex-row w-full h-full justify-between items-center rounded-xl absolute left-0 top-0">

                            <div
                                className={`flex flex-col w-full md:w-1/2 h-1/2 md:h-full justify-center items-center rounded-xl hover:cursor-pointer  ${skipSwiped ? 'scale-[120%] opacity-20 transition-scale transition-opacity transform duration-500 ease-in-out' : ''}`}
                                onClick={() => { !isMobile ? onSkipWord() : null }}>

                                <div className="flex justify-center items-center order-2 md:order-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" /></svg>
                                    <h1 className="text-2xl md:text-3xl font-bold">Skip</h1>
                                </div>
                                {!isMobile ?
                                    <p className="flex flex-row text-md items-center order-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z" /></svg>
                                        Backspace
                                    </p> :
                                    <div className="flex mt-2 order-1 md:order-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#135454" className="w-6 h-6 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                                        <p className="text-[#135454] font-bold">Swipe Left</p>
                                    </div>
                                }
                            </div>

                            {/* Separation Lines */}
                            <div className="hidden md:block w-0.5 h-full rounded-full bg-gradient-to-b from-transparent from-20% via-transparent via-30% to-white"></div>
                            <div className="md:hidden w-full flex">
                                <div className="md:hidden w-1/2 h-0.5 rounded-full bg-gradient-to-r from-white via-transparent to-transparent"></div>
                                <div className="md:hidden w-1/2 h-0.5 rounded-full bg-gradient-to-r from-transparent via-transparent to-white"></div>
                            </div>

                            <div
                                className={`flex flex-col w-full md:w-1/2 h-1/2 md:h-full justify-center items-center rounded-xl hover:cursor-pointer  ${correctSwiped ? 'scale-[120%] opacity-20 transition-scale transition-opacity transform duration-500 ease-in-out' : ''}`}
                                onClick={() => { !isMobile ? onCorrectWord() : null }}>

                                <div className="flex justify-center items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={`${correctSwiped ? '#86efac' : 'white'}`} className="w-6 h-6 mr-2 "><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                                    <h1 className={`text-2xl md:text-3xl font-bold ${correctSwiped ? 'text-green-300' : ''}`}>Correct</h1>
                                </div>
                                {!isMobile ?
                                    <p className="flex flex-row text-md items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" /></svg>
                                        Enter
                                    </p> :
                                    <div className="flex mt-2">
                                        <p className="text-[#135454] font-bold">Swipe Right</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#135454" className="w-6 h-6 ml-2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                                    </div>
                                }
                            </div>
                        </div>

                        {/* Word Display */}
                        <div className="flex flex-col w-full h-full justify-center md:justify-start md:mt-10 items-center">
                            <h1 className="text-[10vw] md:text-6xl text-center font-bold">{currentWord}</h1>
                            <p className="px-2 py-1 mt-2 md:mt-6 rounded-full bg-primary-bg">{formatTime(timer)}</p>
                        </div>
                    </div>
                )
                    :
                    // Results View
                    (
                        <div className="flex flex-col w-[90%] md:w-[80%] p-6 my-6 mx-auto justify-center items-center rounded-xl bg-secondary-bg">
                            <h1 className="text-3xl font-bold mb-2">Game Over</h1>
                            <div className="w-full my-2 mx-auto">
                                {
                                    Object.keys(seenWords).map((word) => {
                                        return (
                                            <div key={word} className={`flex flex-col justify-center items-center ${seenWords[word] ? '' : ''}`}>
                                                <p className={`w-full text-center ${seenWords[word] ? 'my-1 font-bold  bg-gray-900 bg-opacity-40' : 'text-gray-300'}`}>
                                                    {word}
                                                </p>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            <div className="w-[95%] md:w-[300px] mt-4">
                                <div className="w-full h-[40px] mx-auto rounded-lg bg-black">
                                    <button className="w-full h-[40px] bg-white p-2 rounded-lg translate-x-1 -translate-y-1 hover:bg-gray-300 active:bg-gray-200 active:translate-y-0 active:translate-x-0"
                                        onClick={() => window.location.reload()}>
                                        <p className="text-lg text-secondary-bg font-bold">Play Again</p>
                                    </button>
                                </div>

                                <div className="w-full h-[40px] mx-auto mt-4 rounded-lg bg-black">
                                    <button className="w-full h-[40px] bg-primary-bg p-2 rounded-lg translate-x-1 -translate-y-1 hover:bg-secondary-bg active:bg-green-800 active:translate-x-0 active:translate-y-0"
                                        onClick={() => {
                                            router.back();
                                        }}>
                                        <p className="text-lg text-white font-bold">Choose Another Deck</p>
                                    </button>
                                </div>
                            </div>

                        </div>
                    )
            }

        </main>
    );
}

const SuspenseWrapper = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <Game />
    </Suspense>
)

export default SuspenseWrapper;
