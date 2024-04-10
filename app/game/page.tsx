'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { getWords } from "./actions";

function Game() {
    const router = useRouter();
    const deck_id = parseInt(useSearchParams().get('deck_id') ?? '0', 10);


    const [isMobile, setIsMobile] = useState(true);
    const [timer, setTimer] = useState(60);
    const [loading, setLoading] = useState(true);
    const [currentWord, setCurrentWord] = useState("Loading...");
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [correctSwiped, setCorrectSwiped] = useState(false);
    const [skipSwiped, setSkipSwiped] = useState(false);

    const [seenWords, setSeenWords] = useState<Record<string, boolean>>({});
    const seenWordsRef = useRef<Record<string, boolean>>({});

    // Will fetch words from the database
    const [words, setWords] = useState<any[]>([]);

    const randomizeWords = (words: any[]) => {
        return words.sort(() => Math.random() - 0.5);
    }

    useEffect(() => {
        setIsMobile(/iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        getWords(deck_id).then((deck_words) => {
            setWords(randomizeWords(deck_words ?? []));
            setLoading(false);
        });
    }, []);

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

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    }

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
    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        if (gameOver) return;

        if (!isMobile) {
            if (e.key === "Enter") {
                onCorrectWord();
            }
            if (e.key === "Backspace") {
                onSkipWord();
            }
        }
    }, [onCorrectWord, onSkipWord]);

    useEffect(() => {
        document.addEventListener("keyup", handleKeyUp);
        return () => {
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, [handleKeyUp]);


    //// Handling user swipe input
    const [startX, setStartX] = useState(0);
    const [endX, setEndX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [endY, setEndY] = useState(0);

    useEffect(() => {
        if (!gameOver) {
            const touchStart = (e: TouchEvent) => {
                setStartX(e.touches[0].screenX);
                setStartY(e.touches[0].screenY);
            };

            const touchMove = (e: TouchEvent) => {
                setEndX(e.touches[0].screenX);
                setEndY(e.touches[0].screenY);
            };

            const touchEnd = () => {
                if (endX > 0 || endY > 0) {
                    if (startX - endX > 50 || startY - endY > 50) {
                        onSkipWord();
                    } else if (endX - startX > 50 || endY - startY > 50) {
                        onCorrectWord();
                    } else {
                        console.log("onSwipeNone")
                    }
                }
                setStartX(0);
                setStartY(0);
                setEndX(0);
                setEndY(0);
            };

            window.addEventListener('touchstart', touchStart);
            window.addEventListener('touchmove', touchMove);
            window.addEventListener('touchend', touchEnd);
            return () => {
                window.removeEventListener('touchstart', touchStart);
                window.removeEventListener('touchmove', touchMove);
                window.removeEventListener('touchend', touchEnd);
            };
        }
    }, [startY, endY]);

    return (
        <main>

            {
                loading ? (
                    <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                    </div>
                ) : null
            }

            {
                !gameOver ? (
                    <div className="flex flex-col w-full h-[100vh] md:p-8 md:mx-auto overflow-hidden rounded-xl bg-secondary-bg relative">

                        {/* Right or Wrong */}
                        <div className="flex flex-col md:flex-row w-full h-full justify-between items-center rounded-xl absolute left-0 top-0">
                            <div
                                className={`flex md:flex-col w-full md:w-1/2 h-1/2 md:h-full justify-center items-center rounded-xl hover:cursor-pointer  ${skipSwiped ? 'scale-[120%] opacity-20 transition-scale transition-opacity transform duration-500 ease-in-out' : ''}`}
                            >
                                {/* onClick={onSkipWord}> active:scale-[120%] */}

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6 mr-2 md:hidden"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" /></svg>
                                <h1 className="text-2xl md:text-3xl font-bold">Skip</h1>
                                {!isMobile ?
                                    <p className="flex flex-row text-md items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z" /></svg>
                                        Backspace
                                    </p> : null}
                            </div>

                            {/* Separation Lines */}
                            <div className="hidden md:block w-0.5 h-full rounded-full bg-gradient-to-b from-transparent from-20% via-transparent via-30% to-white"></div>
                            <div className="md:hidden w-full flex">
                                <div className="md:hidden w-1/2 h-0.5 rounded-full bg-gradient-to-r from-white via-transparent to-transparent"></div>
                                <div className="md:hidden w-1/2 h-0.5 rounded-full bg-gradient-to-r from-transparent via-transparent to-white"></div>
                            </div>

                            <div
                                className={`flex md:flex-col w-full md:w-1/2 h-1/2 md:h-full justify-center items-center rounded-xl hover:cursor-pointer  ${correctSwiped ? 'scale-[120%] opacity-20 transition-scale transition-opacity transform duration-500 ease-in-out' : ''}`}
                            >
                                {/* onClick={onCorrectWord}> */}

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={`${correctSwiped ? '#86efac' : 'white'}`} className="w-6 h-6 mr-2 md:hidden"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>

                                <h1 className={`text-2xl md:text-3xl font-bold ${correctSwiped ? 'text-green-300' : ''}`}>Correct</h1>
                                {!isMobile ?
                                    <p className="flex flex-row text-md items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" /></svg>
                                        Enter
                                    </p> : null}
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
                                    <button className="w-full h-[40px] bg-white p-2 rounded-lg -translate-y-1 hover:bg-gray-300 active:bg-gray-200 active:translate-y-0"
                                        onClick={() => window.location.reload()}>
                                        <p className="text-lg text-secondary-bg font-bold">Play Again</p>
                                    </button>
                                </div>

                                <div className="w-full h-[40px] mx-auto mt-4 rounded-lg bg-black">
                                    <button className="w-full h-[40px] bg-primary-bg p-2 rounded-lg -translate-y-1 hover:bg-secondary-bg active:bg-green-800 active:translate-y-0"
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