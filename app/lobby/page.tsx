'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Lobby() {
    const router = useRouter();

    // const [players, setPlayers] = useState([]);
    const [activeDeck, setActiveDeck] = useState<number | null>(null);

    const players = [
        {
            name: "Player 1",
            deck: "Deck 1"
        },
        {
            name: "Player 2",
            deck: "Deck 2"
        },
        {
            name: "Player 3",
            deck: "Deck 3"
        }
    ]

    const decks = [
        {
            id: 1,
            name: "Deck 1",
            image: "https://wallpapercave.com/wp/wp9134142.png",
            cards: 10
        },
        {
            id: 2,
            name: "Deck 2",
            image: "https://wallpapercave.com/wp/wp9134142.png",
            cards: 10
        },
        {
            id: 3,
            name: "Deck 3",
            image: "https://wallpapercave.com/wp/wp9134142.png",
            cards: 10
        },
        {
            id: 4,
            name: "Deck 4",
            image: "https://wallpapercave.com/wp/wp9134142.png",
            cards: 10
        },
    ]

    const onClickDeck = (id: number) => {
        console.log(id);
        setActiveDeck(id);
        // router.push(`/game/${id}`);
        router.push(`/game`);
    }

    return (
        <main className="p-12">

            <h1 className="text-4xl my-10 font-mono text-center">Ishaare</h1>

            {/* Lobby Body */}
            <div className="flex mx-[10%] gap-4 justify-center">

                {/* Users List */}
                {/* <div className="w-[30%] h-[90vh] p-6 bg-secondary-bg rounded-lg">
                    <h1 className="text-xl font-bold text-center">PLAYERS: 2</h1>
                    {
                        players.map((player, index) => {
                            return (
                                <div key={index}>
                                    <h1 className="text-lg ">{player.name}</h1>
                                </div>
                            )
                        })
                    }
                    <button className="w-full mt-6 bg-primary-bg p-2 rounded-lg px-6">
                        <p>Start</p>
                    </button>
                </div> */}

                {/* Deck List */}
                <div className="flex flex-col">
                    <div className="grid grid-cols-3 gap-4 overflow-y-auto">
                        {decks.map((deck, index) => (
                            <div key={index} className={`p-4 bg-secondary-bg rounded-lg ${activeDeck === deck.id ? 'bg-blue-300 border-2 border-secondary-bg' : ''}`}
                            onClick={() => onClickDeck(deck.id)}>
                                <img src={deck.image} alt="Card Back" className="w-[160px] h-[200px] mb-2 mx-auto object-cover rounded-lg" />
                                <h1 className="text-lg font-bold">{deck.name}</h1>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </main>
    );
}
