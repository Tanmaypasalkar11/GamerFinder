'use client'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-10 text-center">
        Welcome to Game Saviour
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        <button
          onClick={() => router.push('/listings')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-lg transition"
        >
          Find Player
        </button>

        <button
          onClick={() => router.push('/create-listing')}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl text-lg transition"
        >
          Be Saviour
        </button>
      </div>
    </main>
  )
}
