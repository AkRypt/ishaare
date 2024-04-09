'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const createLobby = () => {
    router.push('/lobby');
  }

  const onHowToPlay = () => {
    // router.push('/how-to-play');
  }

  return (
    <main className="min-h-screen max-h-screen md:p-10"
      style={{ backgroundImage: "url('/assets/green_bg.png')", backgroundSize: 'fill' }}>


      {/* Lobby Body */}
      <div className="flex flex-col md:w-[60%] md:h-[90vh] px-10 py-6 mx-auto justify-center bg-[#092E21] bg-opacity-70 shadow-3xl shadow-inner shadow-green-950 rounded-lg">
        <h1 className="text-6xl mb-4 font-vibe text-center">Ishaare</h1>

        <div className="w-[300px] mx-auto my-4 rounded-lg bg-black">
          <button className={`bg-action-bg w-[300px] px-4 py-2 rounded-lg -translate-y-2 hover:bg-green-700`}
            onClick={createLobby}>
            <p className="text-xl font-bold">Start Game</p>
          </button>
        </div>

        {/* <div className="w-[300px] mx-auto rounded-lg bg-black">
          <button className={`bg-white w-[300px] px-4 py-2 rounded-lg -translate-y-2 hover:bg-green-700`}
            onClick={onHowToPlay}>
            <p className="text-xl text-secondary-bg font-bold">How to play?</p>
          </button>
        </div> */}
      </div>



    </main>
  );
}
