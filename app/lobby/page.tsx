'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDecks, signOut } from "./actions";
import { createClient } from "@/utils/supabase/client";
import HowToPlayModal from "../components/howToPlay";
import SignOutButton from "../components/signOutButton";
import { Loading } from "../components/loading";
import GoogleMiniButton from "../components/googleMiniButton";
import ReloadModal from "../components/reloadModal";
import { greatVibes } from "../fonts";
import Image from "next/image";

export default function Lobby() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [reloadModal, setReloadModal] = useState(false);
    const [activeDeck, setActiveDeck] = useState<number | null>(null);
    const [decks, setDecks] = useState<any[] | null>([]);
    const [purchasedTopics, setPurchasedTopics] = useState<number[]>([]);
    const [userData, setUserData] = useState<any>(null);
    const [emailParam, setEmailParam] = useState('');

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
        setEmailParam(userD ? `?prefilled_email=${userD[0]?.email}` : '')
    }
    useEffect(() => {
        getUserData()
    }, [])

    const onClickDeck = (id: number, isPremium: boolean) => {
        setActiveDeck(id);
    }

    const onClickPlay = (id: number) => {
        setLoading(true)
        router.push(`/game?deck_id=${id}`);
    }

    const onClickSignOut = () => {
        setLoading(true)
        signOut().then(() => {
            setLoading(false)
        })
    }

    const onClickBuyBtn = () => {
        setReloadModal(true)
    }

    return (
        <main className="min-h-screen md:px-10"
            style={{ backgroundImage: "url('/assets/lobby_bg.avif')", backgroundSize: 'cover' }}>

            {loading ? <Loading /> : null}

            <HowToPlayModal show={showModal} onClose={() => setShowModal(false)} />

            <ReloadModal show={reloadModal} />

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
                    <h1 className={`text-5xl ${greatVibes.className} text-primary-bg `}>Ishaare</h1>
                </div>

                {/* Deck List */}
                <div className="flex flex-col w-full md:px-6 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {decks?.map((deck, index) => (
                            <div key={index} className={`p-0.5 pb-4 mb-2 h-[30vh] group md:mb-0 border-4 rounded-lg relative shadow-md overflow-hidden 
                            hover:cursor-pointer ${activeDeck === deck.id ? 'bg-teal-400 border-teal-400' : 'border-transparent bg-white'}`}
                                onClick={() => !deck.coming_soon ? onClickDeck(deck.id, deck.is_premium) : null}>

                                <img src={deck.image} alt="Topic Image" className={`w-full mb-2 mx-auto object-cover rounded-lg md:group-hover:h-[30%] 
                                transition-height duration-300 ease-in-out ${activeDeck === deck.id ? 'h-[30%]' : 'h-[86%]'} ${deck.coming_soon ? 'grayscale' : ''}`} />
                                {deck.coming_soon ?
                                    <h2 className={`text-md pl-1 text-gray-500 font-semibold`}>Coming Soon...</h2>
                                    :
                                    <h2 className={`text-md pl-1 ${activeDeck === deck.id ? 'text-white' : 'text-primary-bg'} font-semibold`}>{deck.name}</h2>
                                }
                                <p className={`text-sm pl-1 md:group-hover:block ${activeDeck === deck.id ? 'text-white block' : 'hidden text-primary-bg'} `}>
                                    {deck.description}
                                </p>


                                <div className="flex justify-center">
                                    {deck.coming_soon ?
                                        <div className="absolute w-[96%] bottom-0 m-1 px-4 py-2 bg-gray-700 shadow-inner hidden md:group-hover:flex justify-center items-center rounded-lg">
                                            <p className="text-md tracking-[0.1rem] font-bold text-gray-300">Coming Soon</p>
                                        </div>
                                        : deck.is_premium && (!purchasedTopics || !purchasedTopics.includes(deck.id)) ?
                                            userData ?
                                                <a className={`absolute w-[96%] bottom-0 m-1 px-4 py-2 md:group-hover:flex justify-center items-center bg-yellow-400 rounded-lg hover:bg-yellow-500 active:bg-yellow-700 active:scale-[90%] ${activeDeck === deck.id ? 'flex' : 'hidden'}`}
                                                    href={deck.buy_link + emailParam} onClick={onClickBuyBtn} target="_blank">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                                                    <p className="text-xl tracking-[0.1rem] font-bold">BUY</p>
                                                </a>
                                                :
                                                <div className={`absolute w-[96%] bottom-0 m-1 px-4 py-2 bg-gray-700 shadow-inner md:group-hover:flex justify-center items-center rounded-lg ${activeDeck === deck.id ? 'flex' : 'hidden'}`}>
                                                    <p className="text-md tracking-[0.1rem] font-bold text-gray-300">Sign in to Buy</p>
                                                </div>
                                            :
                                            <button className={`absolute w-[96%] m-1 px-4 py-2 bottom-0 md:group-hover:flex justify-center items-center bg-secondary-bg rounded-lg hover:bg-teal-700 active:bg-primary-bg active:scale-[90%] ${activeDeck === deck.id ? 'flex' : 'hidden'}`}
                                                onClick={() => onClickPlay(deck.id)}>
                                                <img src="/assets/icons/play.png" alt="Play" className="w-5 h-5 mr-2" />
                                                <p className="text-xl tracking-[0.1rem] font-bold">START</p>
                                            </button>
                                    }
                                </div>

                                {deck.is_premium
                                    ?
                                    <div>
                                        <div className={`absolute w-[170px] flex justify-center items-center top-[20px] right-[-55px] rotate-45 shadow-lg bg-gradient-to-r ${!purchasedTopics || !purchasedTopics.includes(deck.id) ? 'from-yellow-500 via-yellow-200 to-yellow-500' : 'from-indigo-600 via-blue-500 to-indigo-600'}`}>
                                            {
                                                !(purchasedTopics && purchasedTopics.includes(deck.id)) ?
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
                                                    :
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={5} stroke="white" className="w-[18px] h-[18px] m-1 "><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                                            }
                                        </div>
                                    </div> : <></>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </main>
    );
}
