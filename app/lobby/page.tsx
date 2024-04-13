'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDecks, signOut } from "./actions";
import { createClient } from "@/utils/supabase/client";
import HowToPlayModal from "../components/howToPlay";
import SignOutButton from "../components/signOutButton";
import { Loading } from "../components/loading";
import GoogleMiniButton from "../components/googleMiniButton";

export default function Lobby() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [activeDeck, setActiveDeck] = useState<number | null>(null);
    const [decks, setDecks] = useState<any[] | null>([]);
    const [canPlay, setCanPlay] = useState(false);
    const [purchasedTopics, setPurchasedTopics] = useState<number[]>([]);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        getDecks().then((data) => {
            setDecks(data)
            setLoading(false)
        })
    }, [])

    // Fetching logged in userData
    async function getUserData() {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser()
        const { data: userD, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data?.user?.id)
        setUserData(userD ? userD[0] : null)
        setPurchasedTopics(userD ? userD[0]?.purchased_topics : [])
    }
    useEffect(() => {
        getUserData()
    }, [])

    const onClickDeck = (id: number, isPremium: boolean) => {
        setActiveDeck(id);
        //// TODO UNCOMMENT AFTER IMPLEMENTING PAYMENT
        // if (isPremium) {
        //     if (purchasedTopics?.includes(id)) {
        //         setCanPlay(true)
        //     } else {
        //         // return setCanPlay(false)
        //     }
        // }
        setCanPlay(true)
    }

    const onClickPlay = () => {
        setLoading(true)
        router.push(`/game?deck_id=${activeDeck}`);
    }

    const onClickSignOut = () => {
        setLoading(true)
        signOut().then(() => {
            setLoading(false)
        })
    }

    return (
        <main className="min-h-screen md:px-10"
            style={{ backgroundImage: "url('/assets/lobby_bg.png')", backgroundSize: 'cover' }}>

            {loading ? <Loading /> : null}

            <HowToPlayModal show={showModal} onClose={() => setShowModal(false)} />

            {/* Lobby Body */}
            <div className="flex flex-col md:w-[80%] md:h-[100vh] md:my-auto overflow-hidden px-2 md:px-10 py-4 mx-auto bg-gray-700 bg-opacity-10 justify-center items-center shadow-lg rounded-lg">
                <div className="flex w-full justify-between items-center px-2">
                    {/* Info on how to playButton */}
                    <button className="md:ml-4"
                        onClick={() => setShowModal(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#2c7c8d" className="w-9 h-9"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>
                    </button>

                    {/* SignOut Btn */}
                    {userData ?
                        <SignOutButton text={userData?.email || ''} onClick={() => onClickSignOut()} />
                        :
                        <GoogleMiniButton onClick={() => { router.push('/auth/google') }} />
                    }
                </div>
                <div className="px-4 pt-3 pb-1 mb-4 bg-white bg-opacity-70 rounded-full relative">
                    <h1 className="text-6xl font-vibe text-primary-bg ">Ishaare</h1>
                </div>

                {/* Deck List */}
                <div className="flex flex-col w-full md:px-6 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {decks?.map((deck, index) => (
                            <div key={index} className={`p-0.5 pb-4 mb-2 h-[30vh] group md:mb-0 border-4 rounded-lg relative shadow-md overflow-hidden hover:cursor-pointer ${activeDeck === deck.id ? 'bg-teal-400 border-teal-400' : 'border-transparent bg-white'}`}
                                onClick={() => onClickDeck(deck.id, deck.is_premium)}>
                                <img src={deck.image} alt="Card Back" className="w-full h-[86%] mb-2 mx-auto object-cover rounded-lg group-hover:h-[30%] transition-height duration-300 ease-in-out" />
                                <h2 className={`text-md pl-1 ${activeDeck === deck.id ? 'text-white' : 'text-primary-bg'} font-semibold`}>{deck.name}</h2>
                                <p className={`hidden text-sm pl-1 group-hover:block ${activeDeck === deck.id ? 'text-white' : 'text-primary-bg'}`}>{deck.description}</p>
                                {deck.is_premium && 0
                                    ?
                                    <div className={`absolute w-[170px] flex justify-center items-center bottom-[26px] right-[-45px] -rotate-45 bg-gradient-to-r ${!purchasedTopics.includes(deck.id) ? 'from-primary-bg via-secondary-bg to-action-bg' : 'from-blue-500 via-indigo-500 to-cyan-500'}`}>
                                        {
                                            !(purchasedTopics && purchasedTopics.includes(deck.id)) ?
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="#FFD700" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#FFD700" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
                                                :
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={5} stroke="white" className="w-[18px] h-[18px] m-1 "><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                                        }
                                    </div> : <></>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="fixed w-[200px] mx-auto rounded-lg bottom-16 left-0 right-0 bg-black">
                {
                    activeDeck ?
                        canPlay ?
                            <button className="flex justify-center items-center bg-action-bg w-[200px] px-4 py-2 rounded-lg -translate-y-1.5 translate-x-1 hover:bg-green-500 active:bg-green-700 active:translate-x-0 active:translate-y-0"
                                onClick={onClickPlay}>
                                <img src="/assets/icons/play.png" alt="Play" className="w-5 h-5 mr-2" />
                                <p className="text-xl tracking-[0.1rem] font-bold">START</p>
                            </button>
                            :
                            <button className="flex justify-center items-center bg-action-bg bg-yellow-400 w-[200px] px-4 py-2 rounded-lg -translate-y-1.5 translate-x-1 hover:bg-green-500 active:bg-green-700 active:translate-x-0 active:translate-y-0"
                                onClick={() => { }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                                <p className="text-xl tracking-[0.1rem] font-bold">BUY</p>
                            </button>
                        : null
                }
            </div>

        </main>
    );
}
