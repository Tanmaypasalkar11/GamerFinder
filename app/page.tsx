import Navbar from "./(auth)/components/layouts/Navbar";

export default function Home() {
  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center px-4">
      <Navbar />
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 text-center">
        Welcome to <span className="text-blue-600">Bullaburg</span>
      </h1>
      <p className="mt-6 text-lg md:text-xl text-gray-600 text-center max-w-2xl">
        The ultimate destination for everything bovine. From memes to merch, we’ve got the bull and the burg.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button className="px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-full hover:bg-blue-700 transition">
          Find Player
        </button>
        <button className="px-8 py-4 bg-gray-900 text-white text-lg font-medium rounded-full hover:bg-gray-800 transition">
          {`Be Someone's Rank Saver`}
        </button>
      </div>
    </div>
  );
}
