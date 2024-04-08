import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const createLobby = () => {
    router.push('/lobby');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      
      <div className="flex flex-col gap-6 justify-center">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={createLobby}>
          Create Lobby
        </button>
        <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Join Lobby
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Sign Up / Sign In
        </button>
      </div>

    </main>
  );
}
