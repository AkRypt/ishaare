'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDecks } from "./actions";

export default function Lobby() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [activeDeck, setActiveDeck] = useState<number | null>(null);
    const [decks, setDecks] = useState<any[] | null>([]);

    useEffect(() => {
        getDecks().then((data) => {
            setDecks(data)
            setLoading(false)
        })
    }, [])

    const onClickDeck = (id: number) => {
        setActiveDeck(id);
    }

    const onClickPlay = () => {
        router.push(`/game?deck_id=${activeDeck}`);
    }

    return (
        <main className="min-h-screen max-h-screen md:p-10"
            style={{ backgroundImage: "url('/assets/green_bg.png')", backgroundSize: 'fill' }}>

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



            {/* Lobby Body */}
            <div className="flex flex-col md:w-[80%] md:h-[90vh] px-2 md:px-10 py-6 mx-auto justify-center bg-[#092E21] bg-opacity-10 shadow-3xl shadow-inner shadow-green-950 rounded-lg">
                <h1 className="text-6xl mb-4 font-vibe text-center">Ishaare</h1>

                {/* Deck List */}
                <div className="flex flex-col md:px-6 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {decks?.map((deck, index) => (
                            <div key={index} className={`p-2 pb-4 md:p-4 mb-2 h-[30vh] group md:mb-0 border-4 rounded-lg overflow-hidden hover:cursor-pointer ${activeDeck === deck.id ? 'bg-secondary-bg border-action-bg' : 'border-transparent bg-gray-200'}`}
                                onClick={() => onClickDeck(deck.id)}>
                                <img src={deck.image} alt="Card Back" className="w-full h-[86%] mb-2 mx-auto object-cover rounded-lg group-hover:h-[40%] transition-height duration-300 ease-in-out" />
                                <h2 className={`text-lg ${activeDeck === deck.id ? 'text-white' : 'text-primary-bg'} font-bold`}>{deck.name}</h2>
                                <p className={`hidden text-sm group-hover:block ${activeDeck === deck.id ? 'text-white' : 'text-primary-bg'}`}>{deck.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="fixed w-[200px] mx-auto rounded-lg bottom-16 left-0 right-0 bg-black">
                <button className={`flex justify-center items-center bg-action-bg w-[200px] px-4 py-2 rounded-lg -translate-y-1.5 translate-x-1 hover:bg-green-500 active:bg-green-700 active:translate-x-0 active:translate-y-0 ${activeDeck ? '' : 'hidden'}`}
                    onClick={onClickPlay}>
                    <img src="/assets/icons/play.png" alt="Play" className="w-5 h-5 mr-2" />
                    <p className="text-xl tracking-[0.1rem] font-bold">START</p>
                </button>
            </div>

        </main>
    );
}
