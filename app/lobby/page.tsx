'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, getDecks, signOut } from "./actions";
import HowToPlayModal from "../components/howToPlay";
import SignOutButton from "../components/signOutButton";
import { Loading } from "../components/loading";
import GoogleMiniButton from "../components/googleMiniButton";
import ReloadModal from "../components/reloadModal";
import { greatVibes } from "../fonts";
import { DEFAULT_DECK_IMAGE, resolveDeckImage } from "@/utils/deck-image";

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
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        getDecks()
            .then((data) => {
                setDecks(data)
            })
            .catch((error) => {
                console.error('getDecks failed', error)
                setDecks([])
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        getCurrentUser()
            .then((user) => {
                setUserData(user)
                setPurchasedTopics(user?.purchased_topics ?? [])
                setEmailParam(user?.email ? `?prefilled_email=${user.email}` : '')
            })
            .catch((error) => {
                console.error('getCurrentUser failed', error)
            })
    }, [])

    const onClickDeck = (id: number) => {
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

    const filtered = decks?.filter((deck) =>
        deck.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? []

    return (
        <main className="lobby-shell" data-testid="lobby">
            {loading ? <Loading /> : null}

            <HowToPlayModal show={showModal} onClose={() => setShowModal(false)} />
            <ReloadModal show={reloadModal} />

            <div className="lobby-panel">
                <div className="flex w-full justify-between items-center px-1 mb-1">
                    <button
                        type="button"
                        className="p-1.5 rounded-full hover:bg-white/20 active:scale-95 transition"
                        aria-label="How to play"
                        onClick={() => setShowModal(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#2c7c8d" className="w-9 h-9 drop-shadow-sm">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                    </button>

                    {userData ? (
                        <SignOutButton text={userData?.email || ''} onClick={() => onClickSignOut()} />
                    ) : (
                        <GoogleMiniButton onClick={() => { router.push('/auth/google') }} />
                    )}
                </div>

                <div className="px-5 pt-2 pb-1.5 mb-3 bg-white/75 backdrop-blur-sm rounded-full shadow-md self-center">
                    <h1 className={`text-5xl leading-none ${greatVibes.className} text-primary-bg m-0`}>
                        Ishaare
                    </h1>
                </div>

                <p className="text-center text-sm text-white/90 mb-3 font-medium drop-shadow">
                    Pick a deck · hold phone on forehead · guess
                </p>

                <div className="flex flex-col w-full overflow-y-auto flex-1 min-h-0">
                    <div className="flex justify-center mb-3 px-1">
                        <input
                            type="search"
                            placeholder="Search decks…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="lobby-search md:w-1/2"
                            aria-label="Search decks"
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 px-0.5">
                        {filtered.map((deck) => {
                            if (!deck.enabled) return null
                            const imageSrc = resolveDeckImage(deck.image)
                            const isActive = activeDeck === deck.id
                            const owned = purchasedTopics?.includes(deck.id)
                            return (
                                <div
                                    key={deck.id}
                                    className={`deck-card group ${isActive ? 'is-active' : ''}`}
                                    onClick={() => !deck.coming_soon ? onClickDeck(deck.id) : undefined}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault()
                                            if (!deck.coming_soon) onClickDeck(deck.id)
                                        }
                                    }}
                                >
                                    <picture>
                                        {imageSrc.endsWith('.avif') ? (
                                            <source srcSet={imageSrc} type="image/avif" />
                                        ) : null}
                                        <img
                                            src={imageSrc}
                                            alt={deck.name || 'Topic Image'}
                                            onError={(e) => {
                                                const el = e.currentTarget
                                                if (el.getAttribute('src') === DEFAULT_DECK_IMAGE) return
                                                el.onerror = null
                                                el.src = DEFAULT_DECK_IMAGE
                                                const picture = el.parentElement
                                                const source = picture?.querySelector('source')
                                                if (source) source.remove()
                                            }}
                                            className={`w-full mb-1.5 mx-auto object-cover rounded-md ${
                                                isActive ? 'h-[28%]' : 'h-[82%]'
                                            } ${deck.coming_soon ? 'grayscale' : ''} md:group-hover:h-[28%]`}
                                        />
                                    </picture>

                                    {deck.coming_soon ? (
                                        <h2 className="text-sm pl-2 pr-1 text-gray-500 font-semibold">Coming Soon…</h2>
                                    ) : (
                                        <h2 className={`text-sm pl-2 pr-1 font-semibold leading-snug ${isActive ? 'text-white' : 'text-primary-bg'}`}>
                                            {deck.name}
                                        </h2>
                                    )}

                                    <p className={`text-xs pl-2 pr-1 mt-0.5 line-clamp-2 ${isActive ? 'text-white/95 block' : 'hidden text-primary-bg'} md:group-hover:block`}>
                                        {deck.description}
                                    </p>

                                    <div className="flex justify-center">
                                        {deck.coming_soon ? (
                                            <div className="absolute w-[94%] bottom-1 left-[3%] px-3 py-2 bg-gray-700/90 shadow-inner hidden md:group-hover:flex justify-center items-center rounded-lg">
                                                <p className="text-sm tracking-wide font-bold text-gray-300 m-0">Coming Soon</p>
                                            </div>
                                        ) : deck.is_premium && !owned ? (
                                            userData ? (
                                                <a
                                                    className={`absolute w-[94%] bottom-1 left-[3%] px-3 py-2.5 justify-center items-center bg-amber-400 rounded-lg hover:bg-amber-500 active:scale-[96%] ${isActive ? 'flex' : 'hidden'} md:group-hover:flex`}
                                                    href={deck.buy_link + emailParam}
                                                    onClick={onClickBuyBtn}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-5 h-5 mr-1.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                    </svg>
                                                    <p className="text-lg tracking-wide font-bold m-0 text-white">BUY</p>
                                                </a>
                                            ) : (
                                                <div className={`absolute w-[94%] bottom-1 left-[3%] px-3 py-2 bg-gray-700/90 shadow-inner justify-center items-center rounded-lg ${isActive ? 'flex' : 'hidden'} md:group-hover:flex`}>
                                                    <p className="text-sm tracking-wide font-bold text-gray-300 m-0">Sign in to Buy</p>
                                                </div>
                                            )
                                        ) : (
                                            <button
                                                type="button"
                                                className={`absolute w-[94%] bottom-1 left-[3%] px-3 py-2.5 justify-center items-center bg-secondary-bg rounded-lg hover:bg-brand-deep active:scale-[96%] ${isActive ? 'flex' : 'hidden'} md:group-hover:flex`}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onClickPlay(deck.id)
                                                }}
                                            >
                                                <img src="/assets/icons/play.png" alt="" className="w-5 h-5 mr-1.5" />
                                                <p className="text-lg tracking-wide font-bold m-0">START</p>
                                            </button>
                                        )}
                                    </div>

                                    {deck.is_premium ? (
                                        <div className={`absolute w-[150px] flex justify-center items-center top-[16px] right-[-52px] rotate-45 shadow-md ${
                                            owned
                                                ? 'bg-gradient-to-r from-teal-700 via-teal-500 to-teal-700'
                                                : 'bg-gradient-to-r from-amber-500 via-amber-200 to-amber-500'
                                        }`}>
                                            {owned ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={5} stroke="white" className="w-[16px] h-[16px] m-1">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                                </svg>
                                            )}
                                        </div>
                                    ) : null}
                                </div>
                            )
                        })}

                        {filtered.length === 0 && (
                            <div className="col-span-2 md:col-span-3 text-center py-8">
                                <p className="text-white/90 m-0">No decks match that search.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
