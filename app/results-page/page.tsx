'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResultsPage() {
    const router = useRouter();

    // const [players, setPlayers] = useState([]);
    const [activeDeck, setActiveDeck] = useState<number | null>(null);


    return (
        <main className="p-12">

            <h1 className="text-4xl my-10 font-mono text-center">Ishaare</h1>



        </main>
    );
}
