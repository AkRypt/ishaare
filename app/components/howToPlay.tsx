import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

export default function HowToPlayModal({ show, onClose }: { show: boolean, onClose: () => void }) {
    const [currentPage, setCurrentPage] = useState(0);

    const onNext = () => {
        setCurrentPage(currentPage + 1);
    }

    const onPrevious = () => {
        setCurrentPage(currentPage - 1);
    }

    return (
        <div>
            {show && (
                <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-900 bg-opacity-50">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <div className="absolute w-full h-full" onClick={onClose}></div>
                        <div className="bg-white p-4 w-[90%] md:w-[30%] rounded-lg shadow-2xl relative">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#2c7c8d" className="absolute top-4 right-4 w-6 h-6 cursor-pointer" onClick={onClose}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <h1 className="text-3xl text-primary-bg font-bold mb-4">How to Play</h1>

                            {/* Previous and Next Arrows */}
                            {currentPage > 0 ?
                                <img className="absolute left-4 top-1/2 -translate-y-1/2 w-[10%] h-[10%] cursor-pointer"
                                    src="/assets/icons/arrow-g.png" alt=""
                                    onClick={onPrevious} /> : <></>
                            }
                            {currentPage < 3 ?
                                <img className="absolute right-4 top-1/2 -translate-y-1/2 w-[10%] h-[10%] cursor-pointer rotate-180"
                                    src="/assets/icons/arrow-g.png" alt=""
                                    onClick={onNext} /> : <></>
                            }

                            {/* Instructions */}
                            {currentPage === 0 ?
                                <div className="flex flex-col justify-center items-center">
                                    <Image src="/assets/how-to/how-4.avif" alt="" width={1} height={1} style={{ width: "80%", height: "80%" }} priority={true} />
                                    <p className="text-md text-primary-bg mt-2">This is a turn based game. Gather your friends in a room. Select a player.
                                        Choose any topic you like and start the game.</p>
                                </div>
                                : currentPage === 1 ?
                                    <div className="flex flex-col justify-center items-center">
                                        <Image src="/assets/how-to/how-1.avif" alt="" width={1} height={1} style={{ width: "80%", height: "80%" }} priority={true} />
                                        <p className="text-md text-primary-bg mt-2">The player must hold the phone horizontally in front of
                                            them without looking at the screen. Words related to the topic will be shown on the screen.</p>
                                    </div>
                                    : currentPage === 2 ?
                                        <div className="flex flex-col justify-center items-center">
                                            <Image src="/assets/how-to/how-2.avif" alt="" width={1} height={1} style={{ width: "80%", height: "80%" }} priority={true} />
                                            <p className="text-md text-primary-bg mt-2">Your friends will either act the word out or describe it and you will have
                                                to guess the word. Guess as many words as possible in 1 minute.</p>
                                        </div>
                                        :
                                        <div className="flex flex-col justify-center items-center">
                                            <Image src="/assets/how-to/how-3.avif" alt="" width={1} height={1} style={{ width: "80%", height: "80%" }} priority={true} />
                                            <p className="text-md text-primary-bg mt-2">Swipe Right if you guessed the word correctly. Swipe Left to skip the word. (Without looking at the screen)</p>
                                        </div>
                            }

                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}