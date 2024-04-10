'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function HowToPlayModal({ show, onClose }: { show: boolean, onClose: () => void }) {

    return (
        <div>
            {show && (
                <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-900 bg-opacity-50">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <div className="absolute w-full h-full" onClick={onClose}></div>
                        <div className="bg-primary-bg p-4 w-[90%] md:max-w-max rounded-lg shadow-2xl relative">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="absolute top-4 right-4 w-6 h-6 cursor-pointer" onClick={onClose}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <h1 className="text-3xl font-bold mb-4">How to Play</h1>
                            <p className="text-lg">1. Choose a topic</p>
                            <p className="text-lg">2. Hold the Phone in front of you</p>
                            <p className="text-lg">3. Your friends will describe or act the word out</p>
                            <p className="text-lg">4. You will have to guess the word</p>
                            <p className="text-lg">5. Tap the top part of your phone to skip the word</p>
                            <p className="text-lg">6. Tap the bottom part of your phone to guess the word</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function Home() {
    const router = useRouter();

    const [showModal, setShowModal] = useState(false)

    const createLobby = () => {
        router.push('/lobby');
    }

    const onHowToPlay = () => {
        setShowModal(true)
    }

    return (
        <main className="min-h-screen max-h-screen md:p-10 flex justify-center items-center"
            style={{ backgroundImage: "url('/assets/green_bg.png')", backgroundSize: 'fill' }}>

            {/* Lobby Body */}
            <div className="flex flex-col w-[90%] md:w-[60%] md:h-[90vh] px-10 py-6 mx-auto justify-center bg-[#092E21] bg-opacity-70 shadow-3xl shadow-inner shadow-green-950 rounded-lg border">
                <h1 className="text-6xl mb-4 font-vibe text-center">Ishaare</h1>

                <div className="w-[90%] md:w-[300px] mx-auto my-4 rounded-lg bg-black">
                    <button className={`bg-secondary-bg w-full px-4 py-2 rounded-lg -translate-y-2 hover:bg-green-700 active:bg-green-800`}
                        onClick={createLobby}>
                        <p className="text-xl font-bold">Play Game</p>
                    </button>
                </div>

                <div className="w-[90%] md:w-[300px] mx-auto rounded-lg bg-black">
                    <button className={`bg-white w-full px-4 py-2 rounded-lg -translate-y-2 hover:bg-gray-300 active:bg-gray-400`}
                        onClick={onHowToPlay}>
                        <p className="text-xl text-secondary-bg font-bold">How to play?</p>
                    </button>
                </div>
            </div>

            <HowToPlayModal show={showModal} onClose={() => setShowModal(false)} />

        </main>
    );
}
