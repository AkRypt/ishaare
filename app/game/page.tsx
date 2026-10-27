'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { getWords } from "./actions";
import { keyboardHandler, preventReload, swipeHandler } from "./hooks";
import { formatTime } from "./helpers";
import { Loading } from "../components/loading";
import { raleway } from "../fonts";

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
        <main>
            {loading ? <Loading /> : null}

            {showSnack && !gameOver && !loading ? (
                <div className="fixed top-[16%] left-0 right-0 w-[90%] max-w-md mx-auto z-50 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-sm">
                    <p className="text-sm text-[#1f4f5a] font-medium text-center m-0">
                        Rotate landscape · hold on forehead
                    </p>
                </div>
            ) : null}

            {!gameOver ? (
                <div className="game-shell" data-testid="game-shell">
                    <div className="game-zones">
                        <button
                            type="button"
                            aria-label="Skip word"
                            data-testid="skip-zone"
                            className={`game-zone game-zone-skip ${skipSwiped ? "active" : ""}`}
                            onClick={onSkipWord}
                        >
                            <div className="game-action">
                                <p className="game-action-label">
                                    <span className="game-action-icon" aria-hidden>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.4} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </span>
                                    Skip
                                </p>
                            </div>
                        </button>

                        <button
                            type="button"
                            aria-label="Mark correct"
                            data-testid="correct-zone"
                            className={`game-zone game-zone-correct ${correctSwiped ? "active" : ""}`}
                            onClick={onCorrectWord}
                        >
                            <div className="game-action">
                                <p className="game-action-label">
                                    <span className="game-action-icon" aria-hidden>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.4} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                        </svg>
                                    </span>
                                    Correct
                                </p>
                            </div>
                        </button>
                    </div>

                    <div className="game-center">
                        <div className="game-stage">
                            <h1 key={wordKey} className={`game-word ${raleway.className}`} data-testid="current-word">
                                {currentWord}
                            </h1>
                            <p className="game-timer" data-testid="timer">
                                {formatTime(timer)}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="game-results" data-testid="game-results">
                    <div className="game-results-card">
                        <h1 className={`game-results-title ${raleway.className}`}>Round over</h1>
                        <p className="game-results-stats">
                            <span className="game-results-stat-correct">{correctCount} correct</span>
                            <span className="game-results-stat-sep">·</span>
                            <span className="game-results-stat-skip">{skipCount} skipped</span>
                        </p>

                        <div className="game-results-list">
                            {Object.keys(seenWords).map((word) => (
                                <div
                                    key={word}
                                    className={`game-results-row ${seenWords[word] ? "is-correct" : "is-skip"}`}
                                >
                                    <p className="m-0">
                                        {seenWords[word] ? "✓ " : "✕ "}
                                        {word}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="game-results-actions">
                            <button
                                type="button"
                                className="game-results-btn game-results-btn-primary"
                                onClick={() => window.location.reload()}
                            >
                                Play again
                            </button>
                            <button
                                type="button"
                                className="game-results-btn game-results-btn-secondary"
                                onClick={() => router.back()}
                            >
                                Choose another deck
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
