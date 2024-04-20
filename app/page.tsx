'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GoogleButton from "./components/googleButton";
import HowToPlayModal from "./components/howToPlay";
import { jsonLd } from "./helpers";
import { greatVibes, raleway } from "./fonts";

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
            style={{ backgroundImage: "url('/assets/vector_bg.avif')", backgroundSize: 'cover' }}>

            <HowToPlayModal show={showModal} onClose={() => setShowModal(false)} />

            {/* Lobby Body */}
            <div className="flex flex-col w-[90%] md:w-[60%] md:h-[90vh] px-4 py-6 mx-auto justify-center bg-[#092E21] bg-white bg-opacity-90 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-lg">
                <h1 className={`text-5xl mb-4 text-primary-bg text-center ${greatVibes.className}`}>Ishaare</h1>

                <div className="relative">
                    <div className="absolute top-0 bottom-0 my-auto bg-teal-900 -rotate-[3deg] w-full h-[130%] shadow-lg"></div>
                    <h1 className={`text-4xl text-center relative ${raleway.className} bg-gradient-to-br from-teal-500 via-teal-400 to-teal-400 bg-clip-text text-transparent`}>
                        Gather Your Gang!
                    </h1>
                </div>
                <div className="relative">
                    <h1 className={`text-xl mt-4 text-center relative ${raleway.className} bg-gradient-to-br from-gray-900 to-gray-400 bg-clip-text text-transparent`}>
                        It's Game Night with Ishaare.
                    </h1>
                </div>
                <div className="relative">
                    <h1 className={`text-3xl text-center relative my-2 ${raleway.className} bg-gradient-to-br from-teal-600 to-teal-400 bg-clip-text text-transparent`}>
                        Find Out How Funny Your Friend Group Is
                    </h1>
                </div>

                <div className="w-[90%] md:w-[300px] mx-auto my-4 mt-6 rounded-lg bg-black">
                    <button className={`w-full px-4 py-6 rounded-lg translate-x-1 -translate-y-2 bg-gradient-to-br from-teal-600 to-teal-400 md:hover:from-teal-400 md:hover:to-teal-300 active:from-teal-500 active:to-teal-400 active:translate-y-0 active:translate-x-0`}
                        onClick={createLobby}>
                        <p className="text-4xl font-bold">Let's GO!</p>
                    </button>
                </div>

                <div className="w-[90%] md:w-[300px] mx-auto rounded-lg bg-black">
                    <button className={`bg-white w-full px-4 py-2 rounded-lg border border-gray-600 translate-x-1 -translate-y-2 hover:bg-gray-300 active:translate-y-0 active:translate-x-0`}
                        onClick={() => setShowModal(true)}>
                        <p className="text-xl text-secondary-bg font-bold">How to play?</p>
                    </button>
                </div>

                <div className="w-[90%] md:w-[300px] mx-auto my-4 rounded-lg bg-black">
                    <GoogleButton style={"w-full translate-x-1 -translate-y-2 active:translate-y-0 active:translate-x-0"} onClick={onClickGoogleLogin} />
                </div>

            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

        </main>
    );
}
