'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { getWords } from "./actions";
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
    const [wordKey, setWordKey] = useState(0);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [correctSwiped, setCorrectSwiped] = useState(false);
    const [skipSwiped, setSkipSwiped] = useState(false);

    const [seenWords, setSeenWords] = useState<Record<string, boolean>>({});
    const seenWordsRef = useRef<Record<string, boolean>>({});
    const busyRef = useRef(false);

    const [words, setWords] = useState<any[]>([]);

    const randomizeWords = (list: any[]) => {
        const copy = [...list];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    };

    useEffect(() => {
        const snackTimeout = setTimeout(() => setShowSnack(false), 2800);
        return () => clearTimeout(snackTimeout);
    }, []);

    useEffect(() => {
        const coarse =
            typeof window !== "undefined" &&
            (window.matchMedia("(pointer: coarse)").matches ||
                /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent
                ));
        setIsMobile(coarse);
        getWords(deck_id).then((deck_words) => {
            if (deck_words?.length === 0) {
                return router.back();
            }
            setWords(randomizeWords(deck_words ?? []));
            setLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!loading && words.length > 0) {
            setCurrentWord(words[currentWordIndex]["word"]);
            setWordKey((k) => k + 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    useEffect(() => {
        if (gameOver || loading) return;
        const timeOut = setTimeout(() => {
            if (timer > 0) {
                setTimer((t) => t - 1);
            }
        }, 1000);
        if (timer === 0) {
            handleGameOver();
        }
        return () => clearTimeout(timeOut);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timer, gameOver, loading]);

    const nextWord = useCallback(() => {
        setCurrentWordIndex((prevIndex) => {
            const newIndex = prevIndex + 1;
            if (newIndex >= words.length) {
                setTimeout(() => handleGameOver(), 0);
                return prevIndex;
            }
            setCurrentWord(words[newIndex]["word"]);
            setWordKey((k) => k + 1);
            return newIndex;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [words]);

    const addToSeenWords = useCallback((word: string, correct: boolean) => {
        setSeenWords((prevSeenWords) => {
            const updatedSeenWords = { ...prevSeenWords, [word]: correct };
            seenWordsRef.current = updatedSeenWords;
            return updatedSeenWords;
        });
    }, []);

    const handleGameOver = useCallback(() => {
        setGameOver((already) => {
            if (already) return true;
            setSeenWords((prev) => {
                if (prev[currentWord] !== undefined) {
                    seenWordsRef.current = prev;
                    return prev;
                }
                const updated = { ...prev, [currentWord]: false };
                seenWordsRef.current = updated;
                return updated;
            });
            return true;
        });
    }, [currentWord]);

    const onCorrectWord = useCallback(() => {
        if (busyRef.current || gameOver || loading) return;
        busyRef.current = true;
        setCorrectSwiped(true);
        addToSeenWords(currentWord, true);
        setTimeout(() => {
            setCorrectSwiped(false);
            nextWord();
            busyRef.current = false;
        }, 480);
    }, [addToSeenWords, currentWord, gameOver, loading, nextWord]);

    const onSkipWord = useCallback(() => {
        if (busyRef.current || gameOver || loading) return;
        busyRef.current = true;
        setSkipSwiped(true);
        addToSeenWords(currentWord, false);
        setTimeout(() => {
            setSkipSwiped(false);
            nextWord();
            busyRef.current = false;
        }, 480);
    }, [addToSeenWords, currentWord, gameOver, loading, nextWord]);

    keyboardHandler({
        gameOver,
        isMobile,
        correctFunc: onCorrectWord,
        skipFunc: onSkipWord,
    });

    preventReload();

    swipeHandler({
        gameOver,
        loading,
        correctFunc: onCorrectWord,
        skipFunc: onSkipWord,
    });

    const correctCount = Object.values(seenWords).filter(Boolean).length;
    const skipCount = Object.values(seenWords).filter((v) => !v).length;

    return (
        <main className="bg-brand-deep">
            {loading ? <Loading /> : null}

            {showSnack && !gameOver && !loading ? (
                <div className="fixed top-[18%] left-0 right-0 w-[90%] max-w-md mx-auto z-50 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-deep/80 backdrop-blur-md rounded-full shadow-lg animate-pulse-soft">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-brand-mist shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                    </svg>
                    <p className="text-sm text-white/95 font-medium text-center">
                        Rotate landscape · hold on forehead
                    </p>
                </div>
            ) : null}

            {!gameOver ? (
                <div className="game-shell" data-testid="game-shell">
                    {correctSwiped ? (
                        <div className="game-flash game-flash-correct" aria-hidden />
                    ) : null}
                    {skipSwiped ? (
                        <div className="game-flash game-flash-skip" aria-hidden />
                    ) : null}

                    <div className="game-zones">
                        <button
                            type="button"
                            aria-label="Skip word"
                            data-testid="skip-zone"
                            className={`game-zone game-zone-skip ${skipSwiped ? "active" : ""}`}
                            onClick={onSkipWord}
                        >
                            <div className="game-zone-label">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                Skip
                            </div>
                            <div className="game-zone-hint">
                                {isMobile ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                        </svg>
                                        Swipe left or tap
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z" />
                                        </svg>
                                        Backspace
                                    </>
                                )}
                            </div>
                        </button>

                        <div className="game-divider" aria-hidden />

                        <button
                            type="button"
                            aria-label="Mark correct"
                            data-testid="correct-zone"
                            className={`game-zone game-zone-correct ${correctSwiped ? "active" : ""}`}
                            onClick={onCorrectWord}
                        >
                            <div className="game-zone-label">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                Correct
                            </div>
                            <div className="game-zone-hint">
                                {isMobile ? (
                                    <>
                                        Swipe right or tap
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                        </svg>
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                                        </svg>
                                        Enter
                                    </>
                                )}
                            </div>
                        </button>
                    </div>

                    <div className="game-center">
                        <h1 key={wordKey} className="game-word game-word-enter" data-testid="current-word">
                            {currentWord}
                        </h1>
                        <p className="game-timer" data-testid="timer">
                            {formatTime(timer)}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col w-[92%] max-w-lg p-5 my-6 mx-auto justify-center items-center rounded-2xl bg-secondary-bg shadow-xl safe-pad">
                    <h1 className="text-3xl font-bold mb-1">Round over</h1>
                    <p className="text-sm text-white/80 mb-4">
                        <span className="text-correct-soft font-semibold">{correctCount} correct</span>
                        <span className="mx-2 text-white/40">·</span>
                        <span className="text-skip-soft font-semibold">{skipCount} skipped</span>
                    </p>

                    <div className="w-full my-1 mx-auto max-h-[45vh] overflow-y-auto rounded-xl">
                        {Object.keys(seenWords).map((word) => (
                            <div
                                key={word}
                                className={`flex justify-center items-center px-3 py-2 mb-1 rounded-lg ${
                                    seenWords[word] ? "result-correct" : "result-skip"
                                }`}
                            >
                                <p className="w-full text-center text-base m-0">
                                    {seenWords[word] ? "✓ " : "✕ "}
                                    {word}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="w-full mt-5 space-y-3">
                        <div className="w-full h-[44px] rounded-xl bg-black/80">
                            <button
                                className="w-full h-[44px] bg-white rounded-xl translate-x-1 -translate-y-1 hover:bg-gray-100 active:translate-y-0 active:translate-x-0 transition-transform"
                                onClick={() => window.location.reload()}
                            >
                                <p className="text-lg text-secondary-bg font-bold m-0">Play again</p>
                            </button>
                        </div>

                        <div className="w-full h-[44px] rounded-xl bg-black/80">
                            <button
                                className="w-full h-[44px] bg-primary-bg rounded-xl translate-x-1 -translate-y-1 hover:bg-brand-deep active:translate-y-0 active:translate-x-0 transition-transform"
                                onClick={() => router.back()}
                            >
                                <p className="text-lg text-white font-bold m-0">Choose another deck</p>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

const SuspenseWrapper = () => (
    <Suspense fallback={<Loading />}>
        <Game />
    </Suspense>
);

export default SuspenseWrapper;
