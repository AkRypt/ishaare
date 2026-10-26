'use client';

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

    const onClickGoogleLogin = async () => {
        router.push('/auth/google')
    }

    return (
        <main
            className="min-h-dvh md:p-10 flex justify-center items-center safe-pad"
            style={{
                backgroundImage: "url('/assets/vector_bg.avif')",
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        >
            <HowToPlayModal show={showModal} onClose={() => setShowModal(false)} />

            <div className="flex flex-col w-[92%] max-w-xl md:w-[60%] md:min-h-[80vh] px-5 py-7 mx-auto justify-center bg-white/90 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-2xl backdrop-blur-sm">
                <h1 className={`text-5xl sm:text-6xl mb-5 text-primary-bg text-center ${greatVibes.className} m-0`}>
                    Ishaare
                </h1>

                <div className="relative mb-1">
                    <div className="absolute top-0 bottom-0 my-auto bg-teal-900 -rotate-[3deg] w-full h-[130%] shadow-lg rounded-sm" />
                    <h2 className={`text-3xl sm:text-4xl text-center relative ${raleway.className} bg-gradient-to-br from-teal-500 via-teal-400 to-teal-400 bg-clip-text text-transparent m-0`}>
                        Gather Your Gang!
                    </h2>
                </div>

                <p className={`text-lg mt-4 text-center ${raleway.className} bg-gradient-to-br from-gray-900 to-gray-500 bg-clip-text text-transparent m-0`}>
                    It&apos;s Game Night with Ishaare.
                </p>

                <p className={`text-2xl sm:text-3xl text-center my-3 ${raleway.className} bg-gradient-to-br from-teal-600 to-teal-400 bg-clip-text text-transparent m-0`}>
                    Find Out How Funny Your Friend Group Is
                </p>

                <div className="w-full max-w-[300px] mx-auto my-4 mt-6 rounded-xl bg-black/80">
                    <button
                        type="button"
                        className="w-full px-4 py-5 rounded-xl translate-x-1 -translate-y-2 bg-gradient-to-br from-teal-600 to-teal-400 md:hover:from-teal-400 md:hover:to-teal-300 active:from-teal-500 active:to-teal-400 active:translate-y-0 active:translate-x-0 transition-transform"
                        onClick={createLobby}
                    >
                        <span className="text-3xl sm:text-4xl font-bold text-white">Let&apos;s GO!</span>
                    </button>
                </div>

                <div className="w-full max-w-[300px] mx-auto rounded-xl bg-black/80">
                    <button
                        type="button"
                        className="bg-white w-full px-4 py-2.5 rounded-xl border border-gray-600 translate-x-1 -translate-y-2 hover:bg-gray-100 active:translate-y-0 active:translate-x-0 transition-transform"
                        onClick={() => setShowModal(true)}
                    >
                        <span className="text-xl text-secondary-bg font-bold">How to play?</span>
                    </button>
                </div>

                <div className="w-full max-w-[300px] mx-auto my-4 rounded-xl bg-black/80">
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
