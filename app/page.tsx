'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GoogleButton from "./components/googleButton";
import HowToPlayModal from "./components/howToPlay";
import { jsonLd } from "./helpers";

export default function Home() {
    const router = useRouter();

    const [showModal, setShowModal] = useState(false)

    const createLobby = () => {
        router.push('/lobby');
    }

    // Google Login
    const onClickGoogleLogin = async () => {
        router.push('/auth/google')
    }

    return (
        <main className="min-h-screen max-h-screen md:p-10 flex justify-center items-center"
            style={{ backgroundImage: "url('/assets/vector2_bg.png')", backgroundSize: 'fill' }}>

            <HowToPlayModal show={showModal} onClose={() => setShowModal(false)} />

            {/* Lobby Body */}
            <div className="flex flex-col w-[90%] md:w-[60%] md:h-[90vh] px-10 py-6 mx-auto justify-center bg-[#092E21] bg-white bg-opacity-90 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] shadow-green-950 rounded-lg">
                <h1 className="text-6xl mb-4 font-vibe text-primary-bg text-center">Ishaare</h1>

                <div className="w-[90%] md:w-[300px] mx-auto my-4 rounded-lg bg-black">
                    <button className={`bg-secondary-bg w-full px-4 py-2 rounded-lg translate-x-1 -translate-y-2 hover:bg-green-700 active:bg-green-800`}
                        onClick={createLobby}>
                        <p className="text-xl font-bold">Play Game</p>
                    </button>
                </div>

                <div className="w-[90%] md:w-[300px] mx-auto rounded-lg bg-black">
                    <button className={`bg-white w-full px-4 py-2 rounded-lg border border-gray-600 translate-x-1 -translate-y-2 hover:bg-gray-300 active:bg-gray-400`}
                        onClick={() => setShowModal(true)}>
                        <p className="text-xl text-secondary-bg font-bold">How to play?</p>
                    </button>
                </div>

                <div className="w-[90%] md:w-[300px] mx-auto my-4 rounded-lg bg-black">
                    <GoogleButton style={"w-full translate-x-1 -translate-y-2"} onClick={onClickGoogleLogin} />
                </div>

            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

        </main>
    );
}
